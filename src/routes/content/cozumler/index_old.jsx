import { component$, useResource$, Resource } from '@builder.io/qwik';
import ProductCard from '~/components/ProductCard';
import { Link } from '@builder.io/qwik-city';
import { Content } from '~/components/content';

export default component$((props) => {
  // Layout'tan gelen kategori ve arama props'unu kullan
  const selectedCategory = props.selectedCategory;
  const searchTerm = props.searchTerm;

  // SSR'da lowdb ile ürünleri oku
  const productsResource = useResource$(async () => {
    try {
      if (typeof window === 'undefined') {
        // SSR: dosyadan oku
        console.log('SSR: Ürünler dosyadan okunuyor...');
        const { readProducts } = await import('~/services/db');
        const products = await readProducts();
        console.log('SSR: Okunan ürün sayısı:', products.length);
        return products;
      } else {
        // Client: API'den oku
        console.log('Client: API\'den ürünler çekiliyor...');
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('API hatası');
        const products = await response.json();
        console.log('Client: API\'den gelen ürün sayısı:', products.length);
        return products;
      }
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
      return [];
    }
  });

  return (
    <Content title="ÇÖZÜMLERİMİZ">
      <div class="space-y-8">
        {/* Başlık ve Açıklama */}
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Güvenlik Çözümlerimiz</h1>
          <p class="text-lg text-gray-600 leading-relaxed">
            Modern teknoloji ile donatılmış güvenlik sistemleri ile ev, ofis ve işletmenizi koruyun. 
            Uzman ekibimiz tarafından özenle seçilmiş ürünlerle tam güvenlik çözümleri sunuyoruz.
          </p>
        </div>

        {/* Filtreleme ve Arama Bilgisi */}
        {(selectedCategory || searchTerm) && (
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 text-blue-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                <span class="font-medium">
                  {selectedCategory && `Kategori: ${selectedCategory}`}
                  {selectedCategory && searchTerm && ' - '}
                  {searchTerm && `Arama: "${searchTerm}"`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Ürün Listesi */}
        <Resource
          value={productsResource}
          onPending={() => (
            <div class="text-center py-16">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Ürünler yükleniyor...</p>
            </div>
          )}
          onRejected={(error) => (
            <div class="text-center py-16">
              <div class="max-w-md mx-auto">
                <svg class="w-20 h-20 text-red-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3 class="text-xl font-semibold text-red-700 mb-2">Ürünler Yüklenemedi</h3>
                <p class="text-red-600 mb-6">Hata: {error?.message || 'Bilinmeyen hata'}</p>
                <button 
                  onClick$={() => window.location.reload()}
                  class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Yeniden Dene
                </button>
              </div>
            </div>
          )}
        >
          {(products) => {
            console.log('Resource resolved with products:', products);
            console.log('Products type:', typeof products);
            console.log('Is products array?', Array.isArray(products));
            console.log('Selected category:', selectedCategory);
            console.log('Search term:', searchTerm);
            
            // Eğer products array değilse, boş array döndür
            if (!Array.isArray(products)) {
              console.warn('Products is not an array, returning empty array');
              return (
                <div class="text-center py-16">
                  <p class="text-red-600">Veri formatı hatalı: {typeof products}</p>
                </div>
              );
            }
            
            // Filtrele
            const filteredProducts = products.filter((p) => {
              const matchesCategory = !selectedCategory || p.category === selectedCategory;
              const matchesSearch =
                !searchTerm ||
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchTerm.toLowerCase());
              return matchesCategory && matchesSearch;
            });
            
            console.log('Filtered products count:', filteredProducts.length);

            if (filteredProducts.length === 0) {
              return (
                <div class="text-center py-16">
                  <div class="max-w-md mx-auto">
                    <svg class="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Ürün Bulunamadı</h3>
                    <p class="text-gray-500 mb-6">
                      {selectedCategory || searchTerm 
                        ? 'Aradığınız kriterlere uygun ürün bulunamadı. Lütfen farklı kriterler deneyin.'
                        : 'Henüz ürün eklenmemiş. Yakında yeni ürünler eklenecek.'
                      }
                    </p>
                    {(selectedCategory || searchTerm) && (
                      <button 
                        onClick$={() => window.location.reload()}
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Tüm Ürünleri Göster
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div class="space-y-8">
                {/* Ürün Sayısı */}
                <div class="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div class="flex items-center space-x-2">
                    <h2 class="text-2xl font-semibold text-gray-900">Ürünlerimiz</h2>
                    <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {filteredProducts.length} ürün
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>Garantili</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75c0-1.856-.5-3.598-1.372-5.09L12 2.25z"/>
                      </svg>
                      <span>7/24 Destek</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      <span>Hızlı Kurulum</span>
                    </div>
                  </div>
                </div>

                {/* Ürün Grid */}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Link 
                      href={`/content/cozumler/${product.id}/`} 
                      key={product.id} 
                      class="group block transition-transform hover:scale-[1.02]"
                    >
                      <div class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                        {/* Ürün Resmi */}
                        <div class="relative aspect-square bg-gray-50 p-6">
                          <img 
                            src={product.img || '/stock/default.png'} 
                            alt={product.title}
                            class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.category && (
                            <div class="absolute top-3 left-3">
                              <span class="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                                {product.category}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Ürün Bilgileri */}
                        <div class="p-6">
                          <div class="flex items-start justify-between mb-3">
                            <h3 class="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                              {product.title}
                            </h3>
                            {product.brand && (
                              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2 whitespace-nowrap">
                                {product.brand}
                              </span>
                            )}
                          </div>
                          
                          <p class="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {product.desc}
                          </p>
                          
                          {/* Özellikler */}
                          {product.features && product.features.length > 0 && (
                            <div class="mb-4">
                              <div class="flex flex-wrap gap-1">
                                {product.features.slice(0, 3).map((feature, index) => (
                                  <span 
                                    key={index}
                                    class="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {product.features.length > 3 && (
                                  <span class="text-xs text-gray-400 px-2 py-1">
                                    +{product.features.length - 3} daha
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Detay Butonu */}
                          <div class="flex items-center justify-between">
                            <span class="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                              Detayları Görüntüle
                            </span>
                            <svg class="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Alt Bilgi */}
                <div class="text-center py-8 border-t border-gray-200">
                  <p class="text-gray-600 mb-4">
                    Aradığınız ürünü bulamadınız mı? Size özel çözümler için bizimle iletişime geçin.
                  </p>
                  <Link 
                    href="/content/iletisim"
                    class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span>İletişime Geçin</span>
                  </Link>
                </div>
              </div>
            );
          }}
        </Resource>
      </div>
    </Content>
  );
});