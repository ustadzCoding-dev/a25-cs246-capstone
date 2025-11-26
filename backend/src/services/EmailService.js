import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

class EmailService {
  constructor() {
    // Debug: Log SMTP configuration
    console.log('[EmailService] SMTP Configuration:');
    console.log('[EmailService] SMTP_HOST:', process.env.SMTP_HOST);
    console.log('[EmailService] SMTP_PORT:', process.env.SMTP_PORT);
    console.log('[EmailService] SMTP_SECURE:', process.env.SMTP_SECURE);
    console.log('[EmailService] SMTP_USER:', process.env.SMTP_USER);
    console.log('[EmailService] SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***' : 'NOT SET');
    console.log('[EmailService] SMTP_FROM_EMAIL:', process.env.SMTP_FROM_EMAIL);

    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    this.fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  }

  /**
   * Send team invitation email
   * @param {Object} options - Email options
   * @param {string} options.memberEmail - Member email address
   * @param {string} options.memberName - Member name
   * @param {string} options.teamName - Team name
   * @param {string} options.useCaseName - Use case name
   * @param {string} options.leaderName - Leader name
   * @param {string} options.invitationId - Invitation ID
   */
  async sendInvitationEmail(options) {
    try {
      const {
        memberEmail,
        memberName,
        teamName,
        useCaseName,
        leaderName,
        invitationId
      } = options;

      console.log('[sendInvitationEmail] Starting email send...');
      console.log('[sendInvitationEmail] To:', memberEmail);
      console.log('[sendInvitationEmail] From:', this.fromEmail);

      const acceptLink = `${this.frontendUrl}/invitations/${invitationId}/accept`;
      const rejectLink = `${this.frontendUrl}/invitations/${invitationId}/reject`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
              .button { display: inline-block; padding: 12px 24px; margin: 10px 5px; border-radius: 6px; text-decoration: none; font-weight: bold; }
              .accept-btn { background-color: #10b981; color: white; }
              .reject-btn { background-color: #ef4444; color: white; }
              .info-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; }
              .team-details { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-row:last-child { border-bottom: none; }
              .label { font-weight: bold; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Tim Capstone Invitation</h1>
              </div>

              <div class="content">
                <p>Halo <strong>${memberName}</strong>,</p>

                <p><strong>${leaderName}</strong> mengundang Anda untuk bergabung dengan tim capstone mereka!</p>

                <div class="team-details">
                  <div class="detail-row">
                    <span class="label">Nama Tim:</span>
                    <span>${teamName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Use Case:</span>
                    <span>${useCaseName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Leader:</span>
                    <span>${leaderName}</span>
                  </div>
                </div>

                <div class="info-box">
                  <p><strong>Apa yang perlu Anda lakukan?</strong></p>
                  <p>Klik salah satu tombol di bawah untuk menerima atau menolak undangan ini. Jika Anda menerima, Anda akan secara otomatis ditambahkan ke tim.</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${acceptLink}" class="button accept-btn">✓ Terima Undangan</a>
                  <a href="${rejectLink}" class="button reject-btn">✗ Tolak Undangan</a>
                </div>

                <p style="color: #6b7280; font-size: 14px;">
                  Atau kunjungi <a href="${this.frontendUrl}/team">halaman Tim Saya</a> untuk melihat undangan Anda.
                </p>

                <p>Terima kasih,<br><strong>Tim Capstone</strong></p>
              </div>

              <div class="footer">
                <p>© 2025 Dicoding Capstone. Semua hak dilindungi.</p>
                <p>Jangan balas email ini. Hubungi admin jika ada pertanyaan.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: memberEmail,
        subject: `Undangan Tim Capstone: ${teamName}`,
        html: htmlContent
      };

      console.log('[sendInvitationEmail] Mail options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      console.log('[sendInvitationEmail] Attempting to send email...');
      await this.transporter.sendMail(mailOptions);
      console.log('[sendInvitationEmail] Email sent successfully!');
      logger.info(`Invitation email sent to ${memberEmail}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send invitation email: ${error.message}`);
      // Don't throw - email failure shouldn't block team creation
      return false;
    }
  }

  /**
   * Send rejection notification email
   * @param {Object} options - Email options
   */
  async sendRejectionNotificationEmail(options) {
    try {
      const { memberName, teamName, leaderName, leaderEmail } = options;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Undangan Ditolak</h1>
              </div>

              <div class="content">
                <p>Halo <strong>${leaderName}</strong>,</p>

                <p><strong>${memberName}</strong> telah menolak undangan untuk bergabung dengan tim <strong>${teamName}</strong>.</p>

                <p>Anda dapat mencari anggota tim lain atau menghubungi admin untuk bantuan lebih lanjut.</p>

                <p>Terima kasih,<br><strong>Tim Capstone</strong></p>
              </div>

              <div class="footer">
                <p>© 2025 Dicoding Capstone. Semua hak dilindungi.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: leaderEmail,
        subject: `Undangan Ditolak: ${teamName}`,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Rejection notification sent to ${leaderEmail}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send rejection notification: ${error.message}`);
      return false;
    }
  }

  /**
   * Send team approval notification to all members
   * @param {Array} memberEmails - Array of member email addresses
   * @param {string} teamName - Team name
   * @param {string} useCaseName - Use case name
   */
  async sendTeamApprovalNotification(memberEmails, teamName, useCaseName) {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4CAF50; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
              .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
              .success-badge { display: inline-block; background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 3px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>✅ Tim Anda Telah Disetujui!</h2>
              </div>
              <div class="content">
                <p>Halo,</p>
                <p>Kami dengan senang hati memberitahukan bahwa tim Anda telah <strong>disetujui</strong> oleh admin.</p>

                <div class="success-badge">Status: APPROVED</div>

                <h3>Detail Tim:</h3>
                <ul>
                  <li><strong>Nama Tim:</strong> ${teamName}</li>
                  <li><strong>Use Case:</strong> ${useCaseName}</li>
                  <li><strong>Tanggal Approval:</strong> ${new Date().toLocaleDateString('id-ID')}</li>
                </ul>

                <h3>Langkah Selanjutnya:</h3>
                <ol>
                  <li>Admin akan melakukan assignment ID Tim</li>
                  <li>Anda akan menerima notifikasi ID Tim melalui email</li>
                  <li>Gunakan ID Tim untuk semua submission dan dokumentasi</li>
                </ol>

                <p>Terima kasih atas partisipasi Anda!</p>
              </div>
              <div class="footer">
                <p>© 2025 Capstone Program. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: memberEmails.join(', '),
        subject: `✅ Tim Anda Telah Disetujui: ${teamName}`,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Team approval notification sent to ${memberEmails.length} members`);
      return true;
    } catch (error) {
      logger.error(`Failed to send team approval notification: ${error.message}`);
      return false;
    }
  }

  /**
   * Send team ID assignment notification to all members
   * @param {Array} memberEmails - Array of member email addresses
   * @param {string} teamName - Team name
   * @param {string} capstoneGroupId - Assigned capstone group ID
   */
  async sendTeamIdAssignmentNotification(memberEmails, teamName, capstoneGroupId) {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2196F3; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
              .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
              .id-box { background-color: #E3F2FD; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; font-size: 18px; font-weight: bold; }
              .important { background-color: #FFF3CD; border-left: 4px solid #FFC107; padding: 10px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>🎯 ID Tim Anda Telah Di-Assign!</h2>
              </div>
              <div class="content">
                <p>Halo,</p>
                <p>Admin telah melakukan assignment ID Tim untuk tim Anda. Berikut adalah detail lengkapnya:</p>

                <h3>Detail Tim:</h3>
                <ul>
                  <li><strong>Nama Tim:</strong> ${teamName}</li>
                  <li><strong>Tanggal Assignment:</strong> ${new Date().toLocaleDateString('id-ID')}</li>
                </ul>

                <div class="id-box">
                  ID Tim Anda: <strong>${capstoneGroupId}</strong>
                </div>

                <div class="important">
                  <strong>⚠️ PENTING:</strong> Gunakan ID Tim ini untuk semua submission, dokumentasi, dan komunikasi resmi terkait capstone project Anda.
                </div>

                <h3>Instruksi Penggunaan:</h3>
                <ol>
                  <li>Catat ID Tim Anda: <strong>${capstoneGroupId}</strong></li>
                  <li>Gunakan ID ini di semua file submission</li>
                  <li>Sertakan ID ini dalam komunikasi dengan mentor/advisor</li>
                  <li>Jangan bagikan ID ini ke tim lain</li>
                </ol>

                <p>Jika ada pertanyaan, silakan hubungi admin program capstone.</p>
              </div>
              <div class="footer">
                <p>© 2025 Capstone Program. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: memberEmails.join(', '),
        subject: `🎯 ID Tim Anda: ${capstoneGroupId}`,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Team ID assignment notification sent to ${memberEmails.length} members`);
      return true;
    } catch (error) {
      logger.error(`Failed to send team ID assignment notification: ${error.message}`);
      return false;
    }
  }

  /**
   * Send team rejection notification to member
   * @param {string} memberEmail - Member email address
   * @param {string} teamName - Team name
   * @param {string} reason - Rejection reason
   */
  async sendTeamRejectionNotification(memberEmail, teamName, reason) {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
              .reason-box { background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0; }
              .info-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>❌ Tim Anda Ditolak</h1>
              </div>

              <div class="content">
                <p>Halo,</p>

                <p>Kami dengan berat hati memberitahukan bahwa tim <strong>${teamName}</strong> Anda telah <strong>ditolak</strong> oleh admin.</p>

                <div class="reason-box">
                  <strong>Alasan Penolakan:</strong><br>
                  ${reason}
                </div>

                <div class="info-box">
                  <p><strong>Apa yang bisa Anda lakukan?</strong></p>
                  <ul>
                    <li>Hubungi admin untuk mendapatkan feedback lebih detail</li>
                    <li>Perbaiki komposisi tim sesuai saran admin</li>
                    <li>Daftar ulang dengan tim yang telah diperbaiki</li>
                  </ul>
                </div>

                <p>Jika ada pertanyaan, silakan hubungi admin program capstone.</p>

                <p>Terima kasih,<br><strong>Tim Capstone</strong></p>
              </div>

              <div class="footer">
                <p>© 2025 Dicoding Capstone. Semua hak dilindungi.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: memberEmail,
        subject: `❌ Tim Anda Ditolak: ${teamName}`,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Team rejection notification sent to ${memberEmail}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send team rejection notification: ${error.message}`);
      return false;
    }
  }

  /**
   * Verify email configuration
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service connected successfully');
      return true;
    } catch (error) {
      logger.error(`Email service connection failed: ${error.message}`);
      return false;
    }
  }
}

// Lazy load to ensure environment variables are loaded
let instance = null;

export default {
  getInstance() {
    if (!instance) {
      instance = new EmailService();
    }
    return instance;
  },

  // Proxy methods for backward compatibility
  async sendInvitationEmail(options) {
    return this.getInstance().sendInvitationEmail(options);
  },

  async sendRejectionNotificationEmail(options) {
    return this.getInstance().sendRejectionNotificationEmail(options);
  },

  async sendTeamApprovalNotification(memberEmails, teamName, useCaseName) {
    return this.getInstance().sendTeamApprovalNotification(memberEmails, teamName, useCaseName);
  },

  async sendTeamRejectionNotification(memberEmail, teamName, reason) {
    return this.getInstance().sendTeamRejectionNotification(memberEmail, teamName, reason);
  },

  async sendTeamIdAssignmentNotification(memberEmails, teamName, capstoneGroupId) {
    return this.getInstance().sendTeamIdAssignmentNotification(memberEmails, teamName, capstoneGroupId);
  },

  async verifyConnection() {
    return this.getInstance().verifyConnection();
  }
};
