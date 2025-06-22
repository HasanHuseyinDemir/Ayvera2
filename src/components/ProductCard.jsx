import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

// Ürün/hizmet kartı - Kompakt ve modern tasarım
export const ProductCard = component$(({ img, title, desc, buttonText = 'Detaylı Bilgi', detail, category, features = [], productId, onProductClick, driver, pdf }) => (
  <div 
    class="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 h-full flex flex-col"
  >
    {/* Gradient overlay for depth */}
    <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    {/* Kategori badge'i - Mobilde daha küçük */}
    {category && (
      <div class="absolute top-2 left-2 z-10">
        <span class="inline-flex items-center bg-blue-600 text-white font-medium px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs shadow-sm">
          <span class="truncate max-w-[60px] md:max-w-none">{category}</span>
        </span>
      </div>
    )}
    
    {/* Ürün görseli - Mobilde daha kompakt */}
    <div class="relative bg-gradient-to-br from-gray-50 to-gray-100 p-2 md:p-3 flex items-center justify-center h-32 md:h-48 overflow-hidden">
      <div class="relative w-full h-full flex items-center justify-center">
        <img 
          src={img} 
          alt={title} 
          class="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          style="max-width: 120px; max-height: 120px;"
          onError$={(e, element) => {
            element.src = '/stock/camera.png';
          }}
        />
      </div>
    </div>
    
    {/* Content Section - Mobilde daha kompakt */}
    <div class="relative p-2 md:p-4 flex-1 flex flex-col">
      {/* Başlık - Tıklanabilir */}
      <Link 
        href={`/content/cozumler/product/${productId}/#content`}
        class="block mb-1 md:mb-2"
        onClick$={() => onProductClick && onProductClick(productId)}
      >
        <h3 class="text-sm md:text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-200 cursor-pointer hover:underline line-clamp-2">
          {title}
        </h3>
      </Link>
      
      {/* Açıklama - Mobilde daha kısa */}
      <p class="text-gray-600 text-xs md:text-sm leading-relaxed mb-2 md:mb-3 line-clamp-2 flex-1">
        {desc}
      </p>
      
      {/* Features - Sadece tablet ve desktop'ta göster */}
      {features && features.length > 0 && (
        <div class="hidden md:flex flex-wrap items-center gap-1 mb-3 text-xs">
          {features.slice(0, 2).map((feature, index) => (
            <div key={index} class="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <div class={`w-1 h-1 rounded-full mr-1 ${
                index === 0 ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <span class="font-medium text-gray-600">{feature}</span>
            </div>
          ))}
          {features.length > 2 && (
            <span class="text-xs text-gray-400 font-medium">+{features.length - 2}</span>
          )}
        </div>
      )}
      
      {/* Kompakt bilgi */}
      {!detail && (
        <div class="mt-auto pt-1 md:pt-2 border-t border-gray-100">
          <div class="flex items-center justify-between text-xs md:text-sm">
            <span class="text-gray-500">Detaylar için tıklayın</span>
            <svg class="w-3 h-3 md:w-4 md:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
      
      {detail && (
        <div class="flex flex-col gap-2 mt-2">
          <div class="flex items-center text-blue-600 font-semibold text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Detaylı ürün sayfası
          </div>
          {/* İndir butonları */}
          <div class="flex gap-2 mt-1">
            {driver && (
              <a href={driver} download class="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded shadow text-xs font-semibold transition-colors duration-200">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                Driver İndir
              </a>
            )}
            {pdf && (
              <a href={pdf} download class="inline-flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded shadow text-xs font-semibold transition-colors duration-200">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                PDF İndir
              </a>
            )}
          </div>
        </div>
      )}
    </div>
    
    {/* Bottom accent line */}
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
  </div>
));

export default ProductCard;
