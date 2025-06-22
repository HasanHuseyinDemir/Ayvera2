import type { RequestHandler } from '@builder.io/qwik-city';

export const onPost: RequestHandler = async ({ request, json, clientConn }) => {
  try {
    const formData = await request.formData();
    
    // Form verilerini al
    const contactData = {
      company: formData.get('company')?.toString() || '',
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      subject: formData.get('subject')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      ip: clientConn?.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };
    
    // Basit doğrulama
    const errors = [];
    if (!contactData.name?.trim()) errors.push('Ad soyad gerekli');
    if (!contactData.email?.trim()) errors.push('E-posta gerekli');
    if (!contactData.subject?.trim()) errors.push('Konu gerekli');
    if (!contactData.message?.trim()) errors.push('Mesaj gerekli');
    
    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (contactData.email && !emailRegex.test(contactData.email)) {
      errors.push('Geçerli bir e-posta adresi girin');
    }
    
    if (errors.length > 0) {
      json(400, { success: false, errors });
      return;
    }
    
    // Veritabanına kaydet
    const { writeContact } = await import('~/services/db.js');
    const result = await writeContact(contactData);
    
    if (result.success) {
      console.log('✅ API: Contact mesajı kaydedildi:', result.contact?.id);
      
      // Mail servisi entegrasyonu - Şimdilik devre dışı
      const mailSent = false;
      console.log('📧 Mail servisi şimdilik devre dışı bırakıldı');
      
      // TODO: Mail gönderimi için .env dosyasını yapılandırın
      /*
      try {
        const { sendContactNotification } = await import('~/services/email.js');
        const mailResult = await sendContactNotification(contactData);
        
        if (mailResult.success) {
          console.log('✅ API: Mail bildirimi gönderildi');
          mailSent = true;
        } else {
          console.warn('⚠️  API: Mail gönderiminde sorun:', mailResult.error);
        }
      } catch (mailError) {
        console.warn('⚠️  API: Mail servisi hatası:', mailError instanceof Error ? mailError.message : mailError);
      }
      */
      
      json(200, { 
        success: true, 
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
        contactId: result.contact?.id,
        mailSent
      });
    } else {
      console.error('❌ API: Contact kaydetme hatası:', result.error);
      json(500, { 
        success: false, 
        error: 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' 
      });
    }
    
  } catch (error) {
    console.error('❌ API: Contact endpoint hatası:', error);
    json(500, { 
      success: false, 
      error: 'Sunucu hatası. Lütfen tekrar deneyin.' 
    });
  }
};
