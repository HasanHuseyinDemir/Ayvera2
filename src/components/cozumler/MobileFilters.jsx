import { component$, useSignal,$ } from '@builder.io/qwik';
import { MiniLoader } from '../PageLoader';

export const MobileFilters = component$(({ 
  products, 
  localSearch, 
  localCategory, 
  handleSearchChange, 
  handleCategoryChange 
}) => {
  const isSearching = useSignal(false);
  const isFilteringCategory = useSignal(false);

  const handleSearchWithLoading = $((searchTerm) => {
    isSearching.value = true;
    handleSearchChange(searchTerm);
    setTimeout(() => {
      isSearching.value = false;
    }, 500);
  });

  const handleCategoryWithLoading = $((category) => {
    isFilteringCategory.value = true;
    handleCategoryChange(category);
    setTimeout(() => {
      isFilteringCategory.value = false;
    }, 500);
  });

  return (
    <div class="lg:hidden bg-white rounded-lg border p-3 mx-2 md:mx-4">
      <h3 class="font-semibold mb-3 text-sm md:text-base">Hızlı Kategoriler</h3>
      
      {/* Arama Kutusu */}
      <div class="mb-3 md:mb-4 flex items-center">
        <input
          type="text"
          placeholder="Ürün ara..."
          class="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-sm"
          value={localSearch.value || ''}
          onInput$={(e) => localSearch.value = e.target.value}
          onKeyUp$={(e) => {
            if (e.key === 'Enter') {
              handleSearchWithLoading(e.target.value);
            }
          }}
        />
        <button 
          onClick$={() => handleSearchWithLoading(localSearch.value)}
          class="ml-2 bg-blue-600 text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-sm hover:bg-blue-700 min-w-[50px] md:min-w-[60px] flex items-center justify-center"
          disabled={isSearching.value}
        >
          {isSearching.value ? <MiniLoader /> : 'Ara'}
        </button>
      </div>
      
      {/* Kategori Butonları */}
      <div class="flex flex-wrap gap-1 md:gap-2">
        <button
          onClick$={() => handleCategoryWithLoading(null)}
          class={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm transition-colors ${
            !localCategory.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={isFilteringCategory.value}
        >
          {isFilteringCategory.value && !localCategory.value ? (
            <MiniLoader />
          ) : (
            `Tümü (${products.length})`
          )}
        </button>
        {[...new Set(products.map(p => p.category).filter(Boolean))].map(category => (
          <button
            key={category}
            onClick$={() => handleCategoryWithLoading(category)}
            class={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm transition-colors ${
              localCategory.value === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={isFilteringCategory.value}
          >
            {isFilteringCategory.value && localCategory.value === category ? (
              <MiniLoader />
            ) : (
              <span class="truncate max-w-[100px] md:max-w-none inline-block">
                {category} ({products.filter(p => p.category === category).length})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
});
