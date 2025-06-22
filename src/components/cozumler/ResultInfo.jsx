import { component$ } from '@builder.io/qwik';

export const ResultInfo = component$(({ 
  filteredCount, 
  totalPages, 
  currentPage, 
  localCategory, 
  localSearch, 
  onClearFilters 
}) => {
  return (
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mx-4 border border-blue-100">
      <div class="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            <span class="text-blue-600">{filteredCount}</span> ürün bulundu
            {totalPages > 1 && (
              <span class="text-gray-500 text-base md:text-lg ml-2">
                • Sayfa {currentPage}/{totalPages}
              </span>
            )}
          </h2>
          {(localCategory || localSearch) && (
            <div class="flex flex-wrap items-center gap-2 mt-3">
              {localCategory && (
                <span class="bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-2">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7l2 2-2 2"/>
                  </svg>
                  <span>{localCategory}</span>
                </span>
              )}
              {localSearch && (
                <span class="bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-2">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <span>"{localSearch}"</span>
                </span>
              )}
              <button
                onClick$={onClearFilters}
                class="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <span>Filtreleri Temizle</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
