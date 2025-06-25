import { component$, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, routeLoader$ } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';
import { BsDownload, BsFilePdf } from '@qwikest/icons/bootstrap';

// Server-side loader - Ürün ve marka detaylarını getir
export const useProductData = routeLoader$(async (requestEvent) => {
  const productId = requestEvent.params.id;
  
  try {
    // Ürün ve marka verilerini doğrudan service'den al
    const { readProducts, readBrands } = await import('~/services/db.js');
    const products = await readProducts();
    const brands = await readBrands();
    
    const product = products.find(p => p.id.toString() === productId);
    
    if (!product) {
      throw new Error('Ürün bulunamadı');
    }
    
    // İlgili markayı bul
    const brand = brands.find(b => b.name === product.brand);
    
    return { product, brand, brands };
  } catch (error) {
    return { product: null, brand: null, brands: [], error: error.message };
  }
});

export default component$(() => {
  const productData = useProductData();
  const loc = useLocation();

  // Sayfa yüklendiğinde #content elementine scroll yap
  useVisibleTask$(() => {
    setTimeout(() => {
      const contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        console.log('Ürün detay sayfası: #content elementine scroll yapıldı');
      }
    }, 100);
  });

  // Loading durumu
  if (!productData.value) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">Ürün Detayları Yükleniyor</h2>
            <p class="text-gray-600">Lütfen bekleyin...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error durumu
  if (productData.value.error || !productData.value.product) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center">
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-red-600 mb-2">Ürün Bulunamadı</h2>
            <p class="text-gray-600 mb-6">Aradığınız ürün mevcut değil veya bir hata oluştu.</p>
            <Link 
              href="/content/cozumler"
              class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Çözümlere Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { product, brand } = productData.value;

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/content/cozumler" class="hover:text-blue-600 transition-colors">Çözümler</Link>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-gray-900 font-medium">{product.title}</span>
        </nav>

        {/* Ürün Detayları */}
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="grid lg:grid-cols-2 gap-8">
            {/* Ürün Görseli */}
            <div class="p-8">
              <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={product.img} 
                  alt={product.title}
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Ürün Bilgileri */}
            <div class="p-8">
              {/* Kategori Badge */}
              <div class="mb-4">
                <span class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              
              {/* Ürün Başlığı */}
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.title}
              </h1>
              
              {/* Ürün Açıklaması */}
              <p class="text-lg text-gray-600 mb-6 leading-relaxed">
                {product.desc}
              </p>

              {/* Marka Bilgisi */}
              {product.brand && (
                <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-sm font-medium text-gray-500">Marka:</span>
                      <span class="ml-2 text-lg font-semibold text-gray-900">{product.brand}</span>
                    </div>
                    {brand && brand.logo && (
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        class="h-8 w-auto object-contain"
                      />
                    )}
                  </div>
                  {brand && brand.description && (
                    <p class="text-sm text-gray-600 mt-2">{brand.description}</p>
                  )}
                </div>
              )}

              {/* Özellikler */}
              {product.features && product.features.length > 0 && (
                <div class="mb-8">
                  <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Özellikler
                  </h3>
                  <ul class="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} class="flex items-start text-gray-700">
                        <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span class="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* PDF ve Driver butonları - modern ve büyük CTA */}
              {(product.driver || product.pdf) && (
                <div class="flex flex-col sm:flex-row gap-4 mt-6 mb-2">
                  {product.driver && (
                                          <a  href={product.driver} download class="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 text-base gap-2" title="Driver İndir">
                      <BsDownload class="w-5 h-5" />
                      Driver İndir
                    </a>
                  )}
                  {product.pdf && (
                      <a  href={product.pdf} download class="flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 text-base gap-2" title="PDF İndir">
                        <BsFilePdf class="w-5 h-5" />
                        PDF İndir
                      </a>
                  )}
                </div>
              )}

              {/* CTA Butonları */}
              <div class="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/content/iletisim/#content"
                  class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🎯 Fiyat Teklifi Al
                </Link>
                <Link 
                  href="/content/cozumler/#content"
                  class="flex-1 bg-gray-100 text-gray-900 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 border border-gray-300"
                >
                  ← Diğer Çözümler
                </Link>
              </div>

              {/* Ek Bilgi */}
              <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div class="flex items-start">
                  <svg class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold text-blue-900 mb-1">Profesyonel Destek</h4>
                    <p class="text-sm text-blue-700">
                      Ücretsiz keşif, kurulum ve satış sonrası teknik destek hizmetlerimizden yararlanabilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İlgili Ürünler Önerisi */}
        <div class="mt-12">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Benzer Çözümler</h3>
            <p class="text-gray-600">Aynı kategorideki diğer ürünlerimizi keşfedin</p>
          </div>
          
          <div class="flex justify-center">
            <Link 
              href={`/content/cozumler?category=${encodeURIComponent(product.category)}#content`}
              class="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7l2 2-2 2m2-5H9l4 4-4 4"/>
              </svg>
              {product.category} Kategorisini Görüntüle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
