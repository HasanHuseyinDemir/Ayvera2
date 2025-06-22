import { component$ } from '@builder.io/qwik';
import { ProductCard } from '~/components/ProductCard';

export const ProductGrid = component$(({ products, loading, onProductClick }) => {
  // Loading durumu için skeleton loader
  if (loading) {
    return (
      <div class="px-2 md:px-4">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} class="animate-pulse">
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gray-200 h-32 md:h-40 w-full"></div>
                <div class="p-2 md:p-4">
                  <div class="h-3 md:h-4 bg-gray-200 rounded mb-1 md:mb-2"></div>
                  <div class="h-4 md:h-5 bg-gray-200 rounded mb-2 md:mb-3"></div>
                  <div class="h-2 md:h-3 bg-gray-200 rounded mb-1 md:mb-2"></div>
                  <div class="h-2 md:h-3 bg-gray-200 rounded mb-2 md:mb-3 w-3/4"></div>
                  <div class="h-6 md:h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div class="px-2 md:px-4">
        <div class="text-center py-20">
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 max-w-lg mx-auto border border-gray-200 shadow-sm">
            <div class="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Ürün Bulunamadı</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Arama kriterlerinize uygun ürün bulunamadı. <br/>
              Filtreleri değiştirip tekrar deneyin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="px-2 md:px-4">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 items-start">
        {products.map((product, index) => (
          <div 
            key={product.id}
            class="animate-fade-in-up h-full"
            style={`animation-delay: ${index * 100}ms`}
          >
            <ProductCard
              img={product.img}
              title={product.title}
              desc={product.desc}
              category={product.category}
              features={product.features}
              buttonText="Detayları Gör"
              productId={product.id}
              onProductClick={onProductClick}
              driver={product.driver}
              pdf={product.pdf}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
