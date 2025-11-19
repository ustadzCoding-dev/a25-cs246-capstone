import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

class EmailService {
  constructor() {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
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

      await this.transporter.sendMail(mailOptions);
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

export default new EmailService();
