import type { RequestHandler } from '@builder.io/qwik-city';

export const onPost: RequestHandler = async ({ json }) => {
  try {
    console.log('🧪 Mail servisi test ediliyor...');
    
    // Mail servisi fonksiyonunu import et
    const { testMailService } = await import('~/services/email.js');
    
    // Mail servisi test et
    const result = await testMailService();
    
    if (result.success) {
      console.log('✅ Mail servisi test başarılı');
      json(200, {
        success: true,
        message: 'Mail servisi başarıyla test edildi. SMTP bağlantısı çalışıyor.'
      });
    } else {
      console.error('❌ Mail servisi test hatası:', result.error);
      json(200, {
        success: false,
        error: result.error,
        message: 'Mail servisi test edilemedi. Lütfen EMAIL_USER ve EMAIL_PASS environment variables\'larını kontrol edin.'
      });
    }
    
  } catch (error) {
    console.error('❌ Mail test endpoint hatası:', error);
    json(500, {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      message: 'Mail servisi test edilirken sunucu hatası oluştu.'
    });
  }
};
