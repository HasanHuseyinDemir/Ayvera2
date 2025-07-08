import { component$, useSignal, useTask$, $, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { MobileFilters } from '~/components/cozumler/MobileFilters';
import { ResultInfo } from '~/components/cozumler/ResultInfo';
import { ProductGrid } from '~/components/cozumler/ProductGrid';
import { Pagination } from '~/components/cozumler/Pagination';

export default component$((props) => {
  const loc = useLocation();
  const nav = useNavigate();
  
  // URL'den parametreleri al
  const urlCategory = loc.url.searchParams.get('category');
  const urlSearch = loc.url.searchParams.get('search');
  const urlPage = loc.url.searchParams.get('page');
  const urlBrand = loc.url.searchParams.get('brand'); // YENİ
  
  // Layout'tan gelen props'ları kullan ama URL'yi öncelikli tut
  const selectedCategory = props.selectedCategory;
  const searchTerm = props.searchTerm;
  const layoutProducts = props.products;
  const onCategorySelect$ = props.onCategorySelect$;
  const onSearchChange$ = props.onSearchChange$;
  
  const products = useSignal([]);
  const loading = useSignal(true);
  const error = useSignal(null);
  const currentPage = useSignal(parseInt(urlPage) || 1);
  const itemsPerPage = 12;
  
  // Local filter states - URL'den initialize et
  const localCategory = useSignal(urlCategory || null);
  const localSearch = useSignal(urlSearch || '');
  const localBrand = useSignal(urlBrand || null); // YENİ
  
  // Filtrelenmiş ürünler için signal
  const filteredProducts = useSignal([]);
  const paginatedProducts = useSignal([]);
  const totalPages = useSignal(0);

  // URL değişikliklerini takip et
  useTask$(({ track }) => {
    track(() => loc.url.href);
    
    const newCategory = loc.url.searchParams.get('category');
    const newSearch = loc.url.searchParams.get('search');
    const newPage = parseInt(loc.url.searchParams.get('page')) || 1;
    const newBrand = loc.url.searchParams.get('brand'); // YENİ
    
    localCategory.value = newCategory;
    localSearch.value = newSearch || '';
    currentPage.value = newPage;
    localBrand.value = newBrand; // YENİ
    
    // Parent component'i de güncelle
    if (onCategorySelect$ && newCategory !== selectedCategory?.value) {
      onCategorySelect$(newCategory);
    }
    if (onSearchChange$ && newSearch !== searchTerm?.value) {
      onSearchChange$(newSearch || '');
    }
  });

  // Layout'tan ürünleri al
  useTask$(({ track }) => {
    track(() => layoutProducts?.value);
    
    if (layoutProducts?.value && Array.isArray(layoutProducts.value)) {
      products.value = layoutProducts.value;
      loading.value = false;
    }
  });

  // Fallback: Layout'tan gelmezse API'den yükle
  useTask$(async () => {
    if ((!layoutProducts?.value || layoutProducts.value.length === 0) && products.value.length === 0) {
      try {
        const res = await fetch('http://localhost:3001/api/products');
        if (!res.ok) throw new Error('API hatası');
        const data = await res.json();
        products.value = Array.isArray(data.products) ? data.products : data;
      } catch (err) {
        console.error('❌ Index: Fallback ürün yükleme hatası:', err);
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    } else if (products.value.length > 0) {
      loading.value = false;
    }
  });

  // SPA'da geri gelindiğinde ürünler sıfırlanıyorsa tekrar fetch et
  useTask$(async ({ track }) => {
    track(() => loc.url.href);
    if (!products.value || products.value.length === 0) {
      try {
        const res = await fetch('http://localhost:3001/api/products');
        if (!res.ok) throw new Error('API hatası');
        const data = await res.json();
        products.value = Array.isArray(data.products) ? data.products : data;
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    }
  });

  // Reaktif filtreleme ve pagination
  useTask$(({ track }) => {
    track(() => localCategory.value);
    track(() => localBrand.value); // YENİ
    track(() => localSearch.value);
    track(() => products.value);
    track(() => currentPage.value);
    
    if (!products.value || !Array.isArray(products.value)) {
      filteredProducts.value = [];
      paginatedProducts.value = [];
      totalPages.value = 0;
      return;
    }

    // Kategori veya arama değiştiğinde #content'e scroll yap
    if (typeof window !== 'undefined') {
      const contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    
    // Filtreleme
    const filtered = products.value.filter((p) => {
      const matchesCategory = !localCategory.value || p.category === localCategory.value;
      const matchesBrand = !localBrand.value || p.brand === localBrand.value; // YENİ
      const searchValue = localSearch.value?.toLowerCase()?.trim() || '';
      const matchesSearch = !searchValue || 
        p.title?.toLowerCase().includes(searchValue) ||
        p.desc?.toLowerCase().includes(searchValue) ||
        p.brand?.toLowerCase().includes(searchValue) ||
        p.category?.toLowerCase().includes(searchValue);
      
      return matchesCategory && matchesBrand && matchesSearch; // YENİ
    });
    
    filteredProducts.value = filtered;
    
    // Pagination
    const totalPagesCount = Math.ceil(filtered.length / itemsPerPage);
    totalPages.value = totalPagesCount;
    
    if (currentPage.value > totalPagesCount && totalPagesCount > 0) {
      currentPage.value = 1;
    }
    
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    paginatedProducts.value = filtered.slice(startIndex, startIndex + itemsPerPage);
  });

  // Filtre değiştirme fonksiyonları
  const handleCategoryChange = $((category) => {
    console.log('Kategori değişiyor:', category);
    localCategory.value = category;
    currentPage.value = 1;
    
    // #content'e scroll yap
    setTimeout(() => {
      const contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
    
    // URL'yi değiştir
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (localSearch.value?.trim()) params.set('search', localSearch.value.trim());
    
    const newURL = params.toString() 
      ? `/content/cozumler?${params.toString()}`
      : '/content/cozumler';
    
    // window.location.href yerine nav() kullanarak SPA geçişini sağla
    nav(newURL, {
      scroll: false // Scroll pozisyonunu korumak için
    });
  });

  const handleSearchChange = $((search) => {
    console.log('Arama değişiyor:', search);
    localSearch.value = search;
    currentPage.value = 1;
    
    // #content'e scroll yap
    setTimeout(() => {
      const contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
    
    // URL'yi değiştir  
    const params = new URLSearchParams();
    if (localCategory.value) params.set('category', localCategory.value);
    if (search?.trim()) params.set('search', search.trim());
    
    const newURL = params.toString() 
      ? `/content/cozumler?${params.toString()}`
      : '/content/cozumler';
    
    // window.location.href yerine nav() kullanarak SPA geçişini sağla
    nav(newURL, {
      scroll: false // Scroll pozisyonunu korumak için
    });
  });

  const handleBrandChange = $((brand) => {
    localBrand.value = brand;
    currentPage.value = 1;
    setTimeout(() => {
      const contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
    const params = new URLSearchParams();
    if (localCategory.value) params.set('category', localCategory.value);
    if (brand) params.set('brand', brand);
    if (localSearch.value?.trim()) params.set('search', localSearch.value.trim());
    const newURL = params.toString() 
      ? `/content/cozumler?${params.toString()}`
      : '/content/cozumler';
    nav(newURL, {
      scroll: false
    });
  });

  const goToPage = $((page) => {
    // #content'e scroll yap
    setTimeout(() => {
      const contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
    
    const params = new URLSearchParams();
    if (localCategory.value) params.set('category', localCategory.value);
    if (localSearch.value?.trim()) params.set('search', localSearch.value.trim());
    if (page > 1) params.set('page', page.toString());
    
    const newURL = params.toString() 
      ? `/content/cozumler?${params.toString()}`
      : '/content/cozumler';
    
    // window.location.href yerine nav() kullanarak SPA geçişini sağla
    nav(newURL, {
      scroll: false // Scroll pozisyonunu korumak için
    });
  });

  // Scroll pozisyonu kontrolü için
  const lastScrollPosition = useSignal(0);

  // URL değişikliklerinde scroll pozisyonunu korumak için
  useVisibleTask$(({ track }) => {
    track(() => loc.url.href);
    
    // URL değişikliğindeki parametre değişimlerini takip et
    const newCategory = loc.url.searchParams.get('category');
    const newSearch = loc.url.searchParams.get('search');
    const newPage = loc.url.searchParams.get('page');
    
    // Hash ile gelen durumlar (#content) için otomatik scroll
    if (loc.url.hash === '#content') {
      setTimeout(() => {
        const contentElement = document.getElementById('content');
        if (contentElement) {
          contentElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
      return;
    }
    
    // Sayfa ilk yüklendiğinde scrollu en üste getir
    if (document.referrer && !document.referrer.includes('/content/cozumler')) {
      window.scrollTo(0, 0);
      return;
    }
    
    // Kategori/arama/sayfalama değişimlerinde scroll pozisyonunu koru
    if (lastScrollPosition.value > 0) {
      setTimeout(() => {
        window.scrollTo(0, lastScrollPosition.value);
      }, 10);
    }
    
    // Mevcut scroll pozisyonunu kaydet
    lastScrollPosition.value = window.scrollY;
  });

  if (loading.value) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">Ürünler Yükleniyor</h2>
            <p class="text-gray-600">Lütfen bekleyin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error.value) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center">
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-red-600 mb-2">Bir Hata Oluştu</h2>
            <p class="text-gray-600 mb-6">{error.value}</p>
            <button 
              onClick$={() => window.location.reload()}
              class="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div class="space-y-4 md:space-y-8">
          <MobileFilters 
            products={products.value}
            localSearch={localSearch}
            localCategory={localCategory}
            localBrand={localBrand} // YENİ
            handleSearchChange={handleSearchChange}
            handleCategoryChange={handleCategoryChange}
            handleBrandChange={handleBrandChange} // YENİ
          />

          <ResultInfo 
            filteredCount={filteredProducts.value.length}
            totalPages={totalPages.value}
            currentPage={currentPage.value}
            localCategory={localCategory.value}
            localSearch={localSearch.value}
            onClearFilters={$(() => {
              localCategory.value = null;
              localSearch.value = '';
              currentPage.value = 1;
              nav('/content/cozumler/#content', { scroll: false });
            })}
          />

          <ProductGrid 
            products={paginatedProducts.value}
            loading={loading.value}
            onProductClick={$((productId) => {
              console.log('Ürün tıklandı, ID:', productId);
              // Önce hash olmadan navigate et, sonra scroll işlemi ürün detay sayfasında yapılacak
              nav(`/content/cozumler/product/${productId}/#content`, { scroll: false});
            })}
          />

          <Pagination 
            currentPage={currentPage.value}
            totalPages={totalPages.value}
            filteredCount={filteredProducts.value.length}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
          />
        </div>
      </div>
    </div>
  );
});
