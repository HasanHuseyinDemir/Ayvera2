import { component$, useSignal, useTask$, Slot, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import SidebarProductList from '~/components/SidebarProductList';

export default component$(() => {
  const nav = useNavigate();
  const selectedCategory = useSignal(null);
  const selectedBrand = useSignal(null); // YENİ: Marka filtresi
  const searchTerm = useSignal('');
  const showMobileFilters = useSignal(false);
  const sidebarOpen = useSignal(true); // MASAÜSTÜ sidebar state
  const products = useSignal([]);
  const categories = useSignal([]);
  const brands = useSignal([]); // YENİ: Markalar

  // Callback fonksiyonları
  const handleCategorySelect = $((categoryName) => {
    selectedCategory.value = categoryName;
  });
  const handleBrandSelect = $((brandName) => {
    selectedBrand.value = brandName;
  });
  const handleSearchChange = $((searchValue) => {
    searchTerm.value = searchValue;
  });

  // Ürünleri, kategorileri ve markaları yükle
  useTask$(async () => {
    try {
      if (typeof window === 'undefined') {
        const { readProducts, readBrands } = await import('~/services/db.js');
        const data = await readProducts();
        products.value = data;
        brands.value = await readBrands();
      } else {
        try {
          const { readProducts, readBrands } = await import('~/services/db.js');
          const data = await readProducts();
          products.value = data;
          brands.value = await readBrands();
        } catch (error) {
          products.value = [];
          brands.value = [];
        }
      }
      // Kategorileri dinamik olarak oluştur (sadece isim array'i)
      const uniqueCategories = [...new Set(products.value.map(p => p.category).filter(Boolean))];
      categories.value = uniqueCategories;
    } catch (error) {
    }
  });

  // Sidebar aç/kapa butonu sadece sidebar'ın üstünde, sabit ve sade
  // Mobilde görünmez, sadece masaüstünde sidebar'ın üstünde

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Ana Container - Desktop */}
      <div class="flex">
        {/* Sol Sidebar - Sabit ve Yapışkan, daraltıldığında ince bar olarak görünür */}
        <div class={`hidden lg:flex flex-col bg-white border-r border-gray-200 min-h-screen transition-all duration-300 relative ${sidebarOpen.value ? 'w-80 opacity-100 translate-x-0' : 'w-8 opacity-80 -translate-x-0'}`}
          style={{ willChange: 'width, opacity, transform' }}>
          {/* Sidebar toggle butonu - sadece sidebar'ın üstünde, sade */}
          <button
            class="w-full h-8 flex items-center justify-center bg-blue-50 border-b border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
            onClick$={() => sidebarOpen.value = !sidebarOpen.value}
            aria-label="Sidebar Aç/Kapat"
          >
            <span class="text-base font-bold">{sidebarOpen.value ? '‹ Kapat' : '>'}</span>
          </button>
          <div class={sidebarOpen.value ? "sticky top-0 h-screen overflow-y-auto" : "flex flex-col items-center justify-center h-screen"}>
            {/* Sidebar Content veya dar modda sadece ikonlar */}
            {sidebarOpen.value ? (
              <div class="p-6">
                <SidebarProductList
                  categories={categories.value}
                  brands={brands.value}
                  selectedCategory={selectedCategory}
                  selectedBrand={selectedBrand}
                  onSelectCategory$={$((cat) => {
                    selectedCategory.value = cat;
                    const params = new URLSearchParams();
                    if (cat) params.set('category', cat);
                    if (selectedBrand.value) params.set('brand', selectedBrand.value);
                    const newURL = params.toString() ? `/content/cozumler?${params.toString()}#content` : '/content/cozumler#content';
                    nav(newURL, { scroll: false });
                  })}
                  onSelectBrand$={$((brand) => {
                    selectedBrand.value = brand;
                    const params = new URLSearchParams();
                    if (selectedCategory.value) params.set('category', selectedCategory.value);
                    if (brand) params.set('brand', brand);
                    const newURL = params.toString() ? `/content/cozumler?${params.toString()}#content` : '/content/cozumler#content';
                    nav(newURL, { scroll: false });
                  })}
                  searchTerm={searchTerm}
                  onSearchChange$={$((search) => {
                    searchTerm.value = search;
                    const params = new URLSearchParams();
                    if (selectedCategory.value) params.set('category', selectedCategory.value);
                    if (selectedBrand.value) params.set('brand', selectedBrand.value);
                    if (search?.trim()) params.set('search', search.trim());
                    const newURL = params.toString() ? `/content/cozumler?${params.toString()}#content` : '/content/cozumler#content';
                    nav(newURL, { scroll: false });
                  })}
                  totalProducts={products.value.length}
                />
              </div>
            ) : (
              <div class="flex flex-col items-center gap-4 w-full pt-8">
                {/* Sadece kategori ikonları veya bir ipucu gösterebilirsin */}
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              </div>
            )}
          </div>
        </div>
        {/* Ana İçerik - Sağ Taraf */}
        <div class="flex-1 lg:pl-0 transition-all duration-300">
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
