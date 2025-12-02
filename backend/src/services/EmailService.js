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
      const { memberEmail, memberName, teamName, useCaseName, leaderName, invitationId } = options;

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
                    <span class="label">Nama Tim: </span>
                    <span>${teamName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Use Case: </span>
                    <span>${useCaseName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Leader: </span>
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
   * Send worksheet reminder email
   * @param {Object} options - Email options
   * @param {string} options.recipientEmail - Recipient email address
   * @param {string} options.recipientName - Recipient name
   * @param {string} options.periodTitle - Period title
   * @param {Date} options.deadline - Deadline date
   * @param {number} options.daysRemaining - Days remaining until deadline
   */
  async sendWorksheetReminderEmail(options) {
    try {
      const { recipientEmail, recipientName, periodTitle, deadline, daysRemaining } = options;

      const deadlineStr = new Date(deadline).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const worksheetUrl = `${this.frontendUrl}/worksheet`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #F59E0B; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .footer { background-color: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; }
              .btn { display: inline-block; padding: 12px 24px; margin: 10px 5px; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .btn-primary { background-color: #4F46E5; color: white; }
              .warning-box { background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 6px; padding: 15px; margin: 15px 0; }
              .deadline { font-size: 18px; font-weight: bold; color: #DC2626; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ Pengingat Worksheet</h1>
              </div>
              <div class="content">
                <p>Halo <strong>${recipientName}</strong>,</p>

                <div class="warning-box">
                  <p>⚠️ Anda belum mengisi worksheet untuk periode:</p>
                  <p style="font-size: 18px; font-weight: bold; color: #4F46E5;">${periodTitle}</p>
                </div>

                <p>Deadline pengisian worksheet:</p>
                <p class="deadline">${deadlineStr}</p>
                <p>Sisa waktu: <strong>${daysRemaining} hari lagi</strong></p>

                <p>Segera isi worksheet Anda untuk melaporkan progress capstone project. Pastikan untuk:</p>
                <ul>
                  <li>Menjelaskan aktivitas yang telah dilakukan selama periode ini</li>
                  <li>Melampirkan bukti berupa screenshot atau dokumen PDF</li>
                  <li>Submit sebelum deadline agar tidak terlambat</li>
                </ul>

                <div style="text-align: center; margin: 25px 0;">
                  <a href="${worksheetUrl}" class="btn btn-primary">Isi Worksheet Sekarang</a>
                </div>

                <p style="color: #6B7280; font-size: 14px;">
                  Jika Anda mengalami kesulitan, silakan hubungi tim Dicoding.
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Dicoding Indonesia. All rights reserved.</p>
                <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: recipientEmail,
        subject: `⏰ Pengingat: Isi Worksheet ${periodTitle} - ${daysRemaining} Hari Lagi!`,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Worksheet reminder sent to ${recipientEmail}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send worksheet reminder: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send worksheet validation notification email
   * @param {Object} options - Email options
   * @param {string} options.recipientEmail - Recipient email address
   * @param {string} options.recipientName - Recipient name
   * @param {string} options.periodTitle - Period title
   * @param {string} options.status - Validation status
   * @param {string} options.adminNotes - Admin notes (optional)
   */
  async sendWorksheetValidationEmail(options) {
    try {
      const { recipientEmail, recipientName, periodTitle, status, adminNotes } = options;

      const statusLabels = {
        completed: { label: 'Selesai ✅', color: '#10B981', icon: '✅' },
        completed_late: { label: 'Selesai, Terlambat ⚠️', color: '#F59E0B', icon: '⚠️' },
        incomplete: { label: 'Tidak Selesai ❌', color: '#EF4444', icon: '❌' }
      };

      const statusInfo = statusLabels[status] || statusLabels.incomplete;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: ${statusInfo.color}; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .footer { background-color: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; }
              .status-box { background-color: white; border: 2px solid ${statusInfo.color}; border-radius: 8px; padding: 20px; margin: 15px 0; text-align: center; }
              .status-label { font-size: 24px; font-weight: bold; color: ${statusInfo.color}; }
              .notes-box { background-color: #EFF6FF; border: 1px solid #3B82F6; border-radius: 6px; padding: 15px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${statusInfo.icon} Hasil Validasi Worksheet</h1>
              </div>
              <div class="content">
                <p>Halo <strong>${recipientName}</strong>,</p>

                <p>Worksheet Anda untuk periode <strong>${periodTitle}</strong> telah divalidasi.</p>

                <div class="status-box">
                  <p style="margin: 0; color: #6B7280;">Status Validasi:</p>
                  <p class="status-label">${statusInfo.label}</p>
                </div>

                ${
  adminNotes
    ? `
                <div class="notes-box">
                  <p style="margin: 0 0 5px 0; font-weight: bold;">📝 Catatan dari Admin:</p>
                  <p style="margin: 0;">${adminNotes}</p>
                </div>
                `
    : ''
}

                <p>Terima kasih telah berpartisipasi dalam program Dicoding Capstone!</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Dicoding Indonesia. All rights reserved.</p>
                <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: recipientEmail,
        subject: `${statusInfo.icon} Hasil Validasi Worksheet: ${periodTitle}`,
        html: htmlContent
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Worksheet validation notification sent to ${recipientEmail}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send worksheet validation notification: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send password reset email
   * @param {Object} options - Email options
   * @param {string} options.userEmail - User email address
   * @param {string} options.userName - User name
   * @param {string} options.resetToken - Reset token
   */
  async sendPasswordResetEmail(options) {
    try {
      const { userEmail, userName, resetToken } = options;

      const resetLink = `${this.frontendUrl}/reset-password/${resetToken}`;

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
              .button { display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .warning-box { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 15px 0; }
              .info-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Reset Password</h1>
              </div>

              <div class="content">
                <p>Halo <strong>${userName}</strong>,</p>

                <p>Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah untuk membuat password baru.</p>

                <div style="text-align: center;">
                  <a href="${resetLink}" class="button">Reset Password</a>
                </div>

                <div class="info-box">
                  <p><strong>Link ini akan berlaku selama 1 jam.</strong></p>
                  <p>Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda tetap aman.</p>
                </div>

                <div class="warning-box">
                  <p><strong>⚠️ Keamanan:</strong> Jangan pernah bagikan link ini kepada siapapun. Tim Dicoding tidak akan pernah meminta password Anda melalui email.</p>
                </div>

                <p>Jika tombol di atas tidak berfungsi, salin dan tempel URL berikut di browser Anda:</p>
                <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
                  ${resetLink}
                </p>

                <p>Terima kasih,<br><strong>Tim Dicoding</strong></p>
              </div>

              <div class="footer">
                <p>© 2025 Dicoding Indonesia. Semua hak dilindungi.</p>
                <p>Jangan balas email ini. Hubungi admin jika ada pertanyaan.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: userEmail,
        subject: '🔐 Reset Password - Dicoding Capstone',
        html: htmlContent
      };

      console.log('[sendPasswordResetEmail] Sending reset email to:', userEmail);
      await this.transporter.sendMail(mailOptions);
      console.log('[sendPasswordResetEmail] Email sent successfully!');
      logger.info(`Password reset email sent to ${userEmail}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send password reset email: ${error.message}`);
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
    return this.getInstance().sendTeamIdAssignmentNotification(
      memberEmails,
      teamName,
      capstoneGroupId
    );
  },

  async verifyConnection() {
    return this.getInstance().verifyConnection();
  },

  // Worksheet email methods
  async sendWorksheetReminderEmail(options) {
    return this.getInstance().sendWorksheetReminderEmail(options);
  },

  async sendWorksheetValidationEmail(options) {
    return this.getInstance().sendWorksheetValidationEmail(options);
  },

  // Password reset email method
  async sendPasswordResetEmail(options) {
    return this.getInstance().sendPasswordResetEmail(options);
  }
};
