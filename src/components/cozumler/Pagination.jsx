import { component$ } from '@builder.io/qwik';

export const Pagination = component$(({ 
  currentPage, 
  totalPages, 
  filteredCount, 
  itemsPerPage, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div class="px-4">
      <div class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        {/* Sayfa bilgisi */}
        <div class="flex items-center text-gray-600 mb-4 sm:mb-0">
          <span class="text-sm">
            <span class="font-semibold text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span>
            {' - '}
            <span class="font-semibold text-gray-900">
              {Math.min(currentPage * itemsPerPage, filteredCount)}
            </span>
            {' / '}
            <span class="font-semibold text-gray-900">{filteredCount}</span>
            {' ürün gösteriliyor'}
          </span>
        </div>
        
        {/* Pagination butonları */}
        <div class="flex items-center space-x-2">
          <button
            onClick$={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            class={`group flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 hover:bg-blue-600 text-gray-700 hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
            }`}
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Önceki
          </button>

          <div class="flex items-center space-x-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }
              
              return (
                <button
                  key={page}
                  onClick$={() => onPageChange(page)}
                  class={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 transform hover:-translate-y-0.5 ${
                    currentPage === page 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick$={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            class={`group flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              currentPage === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 hover:bg-blue-600 text-gray-700 hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
            }`}
          >
            Sonraki
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});
