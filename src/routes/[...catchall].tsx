import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export const head = {
  title: '404 - Sayfa Bulunamadı | Ayvera Güvenlik',
  meta: [
    { name: 'description', content: 'Aradığınız sayfa bulunamadı. Ana sayfaya dönebilir veya menüden istediğiniz sayfayı seçebilirsiniz.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
};

export default component$(() => {
  const location = useLocation();
  
  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4">
      <div class="max-w-lg w-full text-center">
        {/* Ana Container */}
        <div class="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* 404 Icon */}
          <div class="mb-8">
            <div class="mx-auto w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h1 class="text-8xl font-bold text-gray-300 mb-2">404</h1>
          </div>
          
          {/* Başlık ve Açıklama */}
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Sayfa Bulunamadı</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir.
            </p>
            {location.url.pathname && (
              <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <p class="text-sm text-gray-500 mb-1">Aranan URL:</p>
                <code class="text-sm text-gray-800 font-mono bg-white px-2 py-1 rounded border">
                  {location.url.pathname}
                </code>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div class="space-y-4">
            <a 
              href="/" 
              class="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Ana Sayfaya Dön
            </a>
            
            <button 
              onClick$={() => window.history.back()}
              class="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Geri Git
            </button>
          </div>
          
          {/* Yararlı Linkler */}
          <div class="mt-8 pt-6 border-t border-gray-100">
            <p class="text-sm text-gray-500 mb-4">Yararlı linkler:</p>
            <div class="flex flex-wrap justify-center gap-3">
              <a href="/content/cozumler" class="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
                Çözümler
              </a>
              <span class="text-gray-300">•</span>
              <a href="/content/hakkimizda" class="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
                Hakkımızda
              </a>
              <span class="text-gray-300">•</span>
              <a href="/content/iletisim" class="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
                İletişim
              </a>
            </div>
          </div>
        </div>
        
        {/* Alt Bilgi */}
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            Sorun devam ederse <a href="/content/iletisim" class="text-blue-600 hover:text-blue-700 font-medium hover:underline">bizimle iletişime geçin</a>
          </p>
        </div>
      </div>
    </div>
  );
});
