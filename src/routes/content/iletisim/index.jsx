import { component$, useSignal, $, useStore } from '@builder.io/qwik';
import { Content } from '~/components/content';

export default component$(() => {
  const formData = useStore({
    company: '',
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const formState = useStore({
    isSubmitting: false,
    errors: [],
    success: false,
    message: ''
  });

  const validateForm = $(() => {
    const errors = [];
    
    if (!formData.name?.trim()) errors.push('Ad soyad gerekli');
    if (!formData.email?.trim()) errors.push('E-posta gerekli');
    if (!formData.subject?.trim()) errors.push('Konu gerekli');
    if (!formData.message?.trim()) errors.push('Mesaj gerekli');
    
    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Geçerli bir e-posta adresi girin');
    }
    
    // Telefon formatı kontrolü (opsiyonel)
    if (formData.phone && formData.phone.length > 0 && formData.phone.length < 10) {
      errors.push('Geçerli bir telefon numarası girin');
    }
    
    return errors;
  });

  const handleSubmit = $(async (event) => {
    event.preventDefault();
    
    // Reset previous state
    formState.errors = [];
    formState.success = false;
    formState.message = '';
    
    // Validate
    const errors = await validateForm();
    if (errors.length > 0) {
      formState.errors = errors;
      return;
    }
    
    formState.isSubmitting = true;
    
    try {
      // Form verilerini hazırla
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      
      // API'ye gönder
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: form
      });
      
      const result = await response.json();
      
      if (result.success) {
        formState.success = true;
        formState.message = result.message;
        
        // Formu temizle
        Object.keys(formData).forEach(key => {
          formData[key] = '';
        });
        
        console.log('✅ Form başarıyla gönderildi:', result.contactId);
        console.log('📧 Mail servisi durumu:', result.mailSent ? 'Gönderildi' : 'Devre dışı');
      } else {
        formState.errors = result.errors || [result.error || 'Bir hata oluştu'];
      }
    } catch (error) {
      console.error('❌ Form gönderme hatası:', error);
      formState.errors = ['Ağ hatası. Lütfen internet bağlantınızı kontrol edin.'];
    } finally {
      formState.isSubmitting = false;
    }
  });

  return (
    <Content title="İLETİŞİM">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sol: İletişim Bilgileri ve Bayilik */}
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-bold mb-2 text-blue-800">İletişim Bilgilerimiz</h2>
            <ul class="space-y-2 text-base text-gray-800">
              <li><strong>Firma Ünvanı:</strong> Ayvera Güvenlik Hizmetleri</li>
              <li><strong>Adres:</strong> Hacı İlyas Mh Celal Bayar Cd No 22/A Osmangazi BURSA</li>
              <li><strong>Telefon:</strong> <a href="tel:08504416010" class="text-blue-700 hover:underline">0850 441 60 10</a></li>
              <li><strong>E-Posta:</strong> <a href="mailto:info@ayvera.com.tr" class="text-blue-700 hover:underline">info@ayvera.com.tr</a></li>
            </ul>
          </div>
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow text-blue-900">
            <strong>Bayilik Başvurusu:</strong> Ayvera ailesine katılmak ve bayilik fırsatlarımızdan yararlanmak için bizimle iletişime geçebilirsiniz. Güvenliğinizi birlikte büyütelim!
          </div>
        </div>
        
        {/* Sağ: İletişim Formu */}
        <form 
          class="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border-t-4 border-blue-500"
          onSubmit$={handleSubmit}
          preventdefault:submit
        >
          {/* Başarı Mesajı */}
          {formState.success && (
            <div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {formState.message}
              </div>
            </div>
          )}
          
          {/* Hata Mesajları */}
          {formState.errors.length > 0 && (
            <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <div class="flex items-start">
                <svg class="w-5 h-5 mr-2 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  {formState.errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label class="block text-sm font-semibold text-blue-800 mb-1">
              Firma Ünvanı <span class="text-gray-500 font-normal">(Opsiyonel)</span>
            </label>
            <input 
              type="text" 
              value={formData.company}
              onInput$={(e) => formData.company = e.target.value}
              class="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
              placeholder="Firma Ünvanı" 
              disabled={formState.isSubmitting}
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-blue-800 mb-1">
              Adınız <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.name}
              onInput$={(e) => formData.name = e.target.value}
              class="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
              placeholder="Adınız" 
              required
              disabled={formState.isSubmitting}
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-blue-800 mb-1">
              E-Posta <span class="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              value={formData.email}
              onInput$={(e) => formData.email = e.target.value}
              class="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
              placeholder="E-Posta" 
              required
              disabled={formState.isSubmitting}
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-blue-800 mb-1">
              Telefon <span class="text-gray-500 font-normal">(Opsiyonel)</span>
            </label>
            <input 
              type="tel" 
              value={formData.phone}
              onInput$={(e) => formData.phone = e.target.value}
              class="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
              placeholder="Telefon" 
              disabled={formState.isSubmitting}
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-blue-800 mb-1">
              Konu <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.subject}
              onInput$={(e) => formData.subject = e.target.value}
              class="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
              placeholder="Konu" 
              required
              disabled={formState.isSubmitting}
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-blue-800 mb-1">
              Mesajınız <span class="text-red-500">*</span>
            </label>
            <textarea 
              value={formData.message}
              onInput$={(e) => formData.message = e.target.value}
              rows={4} 
              class="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
              placeholder="Mesajınız"
              required
              disabled={formState.isSubmitting}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            class={`mt-2 font-bold py-3 px-6 rounded shadow transition flex items-center justify-center ${
              formState.isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-700 hover:bg-blue-800 text-white'
            }`}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <>
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Gönderiliyor...
              </>
            ) : (
              'Gönder'
            )}
          </button>
          
          <p class="text-xs text-gray-600 mt-2">
            <span class="text-red-500">*</span> Zorunlu alanlar
          </p>
        </form>
      </div>
    </Content>
  );
});