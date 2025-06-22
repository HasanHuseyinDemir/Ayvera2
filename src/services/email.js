import nodemailer from 'nodemailer';

// Mail konfigürasyonu - Environment variables'dan okunacak
const EMAIL_CONFIG = {
  // Gmail SMTP ayarları (örnek)
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || '', // Gmail adresi
    pass: process.env.EMAIL_PASS || ''  // App password (2FA aktifse)
  }
};

// Alternatif olarak Outlook/Hotmail için:
// host: 'smtp-mail.outlook.com'
// port: 587

let transporter = null;

function createTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransporter(EMAIL_CONFIG);
  }
  return transporter;
}

/**
 * İletişim formundan gelen mesaj için bildirim maili gönderir
 */
export async function sendContactNotification(contactData) {
  try {
    // Mail servisi aktif mi kontrol et
    if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
      console.log('⚠️  Mail servisi yapılandırılmamış - EMAIL_USER ve EMAIL_PASS environment variables gerekli');
      return { success: false, error: 'Mail servisi aktif değil' };
    }

    const transport = createTransporter();
    
    // Mail gönderme ayarları
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: 'info@ayvera.com.tr', // Alıcı mail adresi (kendi mail adresinizi yazın)
      subject: `🔔 Yeni İletişim Mesajı: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            📧 Yeni İletişim Mesajı
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">👤 Ad Soyad:</td>
                <td style="padding: 8px 0; color: #1f2937;">${contactData.name}</td>
              </tr>
              ${contactData.company ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏢 Şirket:</td>
                <td style="padding: 8px 0; color: #1f2937;">${contactData.company}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📧 E-posta:</td>
                <td style="padding: 8px 0; color: #1f2937;">
                  <a href="mailto:${contactData.email}" style="color: #1e40af; text-decoration: none;">
                    ${contactData.email}
                  </a>
                </td>
              </tr>
              ${contactData.phone ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📱 Telefon:</td>
                <td style="padding: 8px 0; color: #1f2937;">
                  <a href="tel:${contactData.phone}" style="color: #1e40af; text-decoration: none;">
                    ${contactData.phone}
                  </a>
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📋 Konu:</td>
                <td style="padding: 8px 0; color: #1f2937;">${contactData.subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">🌐 IP:</td>
                <td style="padding: 8px 0; color: #6b7280; font-size: 0.9em;">${contactData.ip}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📅 Tarih:</td>
                <td style="padding: 8px 0; color: #6b7280; font-size: 0.9em;">${new Date().toLocaleString('tr-TR')}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">💬 Mesaj:</h3>
            <p style="color: #1f2937; line-height: 1.6; margin: 0; white-space: pre-wrap;">${contactData.message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 0.9em; margin: 0;">
              Bu mesaj <strong>Ayvera</strong> web sitesi iletişim formundan gönderilmiştir.
            </p>
            <p style="color: #6b7280; font-size: 0.8em; margin: 5px 0 0 0;">
              <a href="https://ayvera.com.tr" style="color: #1e40af; text-decoration: none;">ayvera.com.tr</a>
            </p>
          </div>
        </div>
      `
    };

    // Otomatik yanıt maili
    const autoReplyOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: contactData.email,
      subject: '✅ Mesajınız Alındı - Ayvera Güvenlik Teknolojileri',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔒 Ayvera Güvenlik</h1>
          </div>
          
          <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1e40af; margin: 0 0 20px 0;">Merhaba ${contactData.name},</h2>
            
            <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
              Mesajınız başarıyla alınmış ve sistemimize kaydedilmiştir. Konunuzla ilgili <strong>en kısa sürede</strong> size dönüş yapacağız.
            </p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #1e40af; margin: 20px 0;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">📝 Gönderdiğiniz Mesaj Özeti:</h3>
              <p style="color: #6b7280; margin: 0 0 10px 0;"><strong>Konu:</strong> ${contactData.subject}</p>
              <p style="color: #6b7280; margin: 0;"><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>📞 Acil durumlar için:</strong><br>
                Telefon: 0555 123 45 67<br>
                WhatsApp: 0555 123 45 67
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Ayvera Güvenlik Teknolojileri</strong><br>
                Güvenlik sistemleri ve teknoloji çözümleri
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Bu otomatik yanıt mesajıdır. Lütfen bu mesajı yanıtlamayınız.
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Her iki maili de gönder
    const [notificationResult, autoReplyResult] = await Promise.allSettled([
      transport.sendMail(mailOptions),
      transport.sendMail(autoReplyOptions)
    ]);

    // Sonuçları kontrol et
    const results = {
      notification: notificationResult.status === 'fulfilled',
      autoReply: autoReplyResult.status === 'fulfilled'
    };

    console.log('📧 Mail gönderim sonuçları:', results);

    if (results.notification || results.autoReply) {
      return { 
        success: true, 
        message: 'Mail başarıyla gönderildi',
        results 
      };
    } else {
      return { 
        success: false, 
        error: 'Mail gönderiminde hata oluştu',
        details: {
          notification: notificationResult.reason?.message,
          autoReply: autoReplyResult.reason?.message
        }
      };
    }

  } catch (error) {
    console.error('❌ Mail gönderim hatası:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mail servisi test fonksiyonu
 */
export async function testMailService() {
  try {
    const transport = createTransporter();
    await transport.verify();
    console.log('✅ Mail servisi bağlantısı başarılı');
    return { success: true, message: 'Mail servisi çalışıyor' };
  } catch (error) {
    console.error('❌ Mail servisi test hatası:', error);
    return { success: false, error: error.message };
  }
}
