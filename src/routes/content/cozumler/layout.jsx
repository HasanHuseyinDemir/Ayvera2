import { component$, useSignal, useTask$, Slot, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import SidebarProductList from '~/components/SidebarProductList';

export default component$(() => {
  const nav = useNavigate();
  const selectedCategory = useSignal(null);
  const searchTerm = useSignal('');
  const showMobileFilters = useSignal(false);
  const products = useSignal([]);
  const categories = useSignal([]);

  // Callback fonksiyonları
  const handleCategorySelect = $((categoryName) => {
    selectedCategory.value = categoryName;
  });

  const handleSearchChange = $((searchValue) => {
    searchTerm.value = searchValue;
  });

  // Ürünleri ve kategorileri yükle
  useTask$(async () => {
    try {
      if (typeof window === 'undefined') {
        // SSR: Doğrudan dosyadan oku
        const { readProducts } = await import('~/services/db.js');
        const data = await readProducts();
        products.value = data;
        console.log('Layout SSR: Ürünler yüklendi:', data.length);
      } else {
        // Client: Önce API dene, olmuyorsa fallback yok - direkt error
        try {
          console.log('🔍 Layout Debug: API yerine doğrudan DB\'den okuyorum...');
          // API çalışmıyor, doğrudan service kullan
          const { readProducts } = await import('~/services/db.js');
          const data = await readProducts();
          products.value = data;
          console.log('✅ Layout Client: DB\'den ürünler alındı:', data.length);
        } catch (error) {
          console.error('❌ Layout DB okuma hatası:', error);
          products.value = [];
        }
      }
      
      // Kategorileri dinamik olarak oluştur (sadece isim array'i)
      const uniqueCategories = [...new Set(products.value.map(p => p.category).filter(Boolean))];
      categories.value = uniqueCategories;
    } catch (error) {
      console.error('Layout: Ürün yükleme hatası:', error);
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Mobil Filtre Toggle - Modern Tasarım */}
      <div class="lg:hidden bg-white border-b border-gray-200 px-4 py-4">
        <button
          onClick$={() => (showMobileFilters.value = !showMobileFilters.value)}
          class="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between text-left transition-all duration-200 hover:from-blue-100 hover:to-indigo-100 hover:shadow-md"
        >
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
            </div>
            <div>
              <span class="font-semibold text-gray-900 block">Filtrele & Ara</span>
              <span class="text-xs text-gray-500">{products.value.length} ürün mevcut</span>
            </div>
          </div>
          <svg 
            class={`w-5 h-5 text-blue-600 transform transition-transform duration-200 ${showMobileFilters.value ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        
        {/* Mobil Filtreler - Smooth Animation */}
        <div class={`transition-all duration-300 ease-in-out overflow-hidden ${
          showMobileFilters.value ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
            <SidebarProductList
              categories={categories.value}
              selectedCategory={selectedCategory}
              onSelectCategory$={$((cat) => {
                selectedCategory.value = cat;
                const params = new URLSearchParams();
                if (cat) params.set('category', cat);
                const newURL = params.toString() ? `/content/cozumler?${params.toString()}#content` : '/content/cozumler#content';
                nav(newURL, { scroll: false });
                showMobileFilters.value = false; // Mobilde seçim sonrası kapat
              })}
              searchTerm={searchTerm}
              onSearchChange$={$((search) => {
                searchTerm.value = search;
                const params = new URLSearchParams();
                if (search?.trim()) params.set('search', search.trim());
                const newURL = params.toString() ? `/content/cozumler?${params.toString()}#content` : '/content/cozumler#content';
                nav(newURL, { scroll: false });
              })}
              totalProducts={products.value.length}
            />
          </div>
        </div>
      </div>

      {/* Ana Container - Desktop */}
      <div class="flex">
        {/* Sol Sidebar - Sabit ve Yapışkan */}
        <div class="hidden lg:block w-80 bg-white border-r border-gray-200 min-h-screen">
          <div class="sticky top-0 h-screen overflow-y-auto">
            {/* Sidebar Content */}
            <div class="p-6">
              <SidebarProductList
                categories={categories.value}
                selectedCategory={selectedCategory}
                onSelectCategory$={$((cat) => {
                  selectedCategory.value = cat;
                  const params = new URLSearchParams();
                  if (cat) params.set('category', cat);
                  const newURL = params.toString() ? `/content/cozumler?${params.toString()}#content` : '/content/cozumler#content';
                  nav(newURL, { scroll: false });
                })}
                searchTerm={searchTerm}
                onSearchChange$={$((search) => {
                  searchTerm.value = search;
                  const params = new URLSearchParams();
                  if (search?.trim()) params.set('search', search.trim());
                  const newURL = params.toString() ? `/content/cozumler?${params.toString()}#content` : '/content/cozumler#content';
                  nav(newURL, { scroll: false });
                })}
                totalProducts={products.value.length}
              />
            </div>
          </div>
        </div>
        
        {/* Ana İçerik - Sağ Taraf */}
        <div class="flex-1 lg:pl-0">
          <div id="content" class="max-w-6xl mx-auto">
            <Slot 
              selectedCategory={selectedCategory} 
              searchTerm={searchTerm} 
              products={products}
              onCategorySelect$={handleCategorySelect}
              onSearchChange$={handleSearchChange}
              directCategoryCallback$={$((cat) => {
                const params = new URLSearchParams();
                if (cat) params.set('category', cat);
                const newURL = params.toString() ? `/content/cozumler?${params.toString()}` : '/content/cozumler';
                nav(newURL, { scroll: false });
              })}
              directSearchCallback$={$((search) => {
                const params = new URLSearchParams();
                if (search?.trim()) params.set('search', search.trim());
                const newURL = params.toString() ? `/content/cozumler?${params.toString()}` : '/content/cozumler';
                nav(newURL, { scroll: false });
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
