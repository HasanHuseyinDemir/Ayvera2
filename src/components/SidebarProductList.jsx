import { component$, $ } from '@builder.io/qwik';

export const SidebarProductList = component$(({ 
  categories = [], 
  brands = [],
  selectedCategory, 
  selectedBrand,
  onSelectCategory$, 
  onSelectBrand$,
  searchTerm,
  onSearchChange$,
  totalProducts = 0 
}) => {
  return (
  <aside class="space-y-6">
    {/* Arama Bölümü */}
    <div>
      <label class="block text-sm font-semibold text-gray-900 mb-3">Ürün Ara</label>
      <div class="flex gap-2">
        <div class="relative flex-1">
          <input
            type="text"
            placeholder="Ürün, marka veya kategori ara..."
            class="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-colors placeholder-gray-400"
            value={searchTerm?.value || ''}
            onInput$={(e) => searchTerm.value = e.target.value}
            onKeyUp$={(e) => {
              if (e.key === 'Enter' && onSearchChange$) {
                onSearchChange$(e.target.value);
              }
            }}
          />
          <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <button 
          onClick$={() => onSearchChange$ && onSearchChange$(searchTerm?.value || '')}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors h-full flex items-center justify-center"
          aria-label="Ara"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
      </div>
      {searchTerm?.value && (
        <button
          onClick$={() => {
            if (onSearchChange$) {
              searchTerm.value = '';
              onSearchChange$('');
            }
          }}
          class="mt-2 inline-flex items-center text-xs text-red-600 hover:text-red-700 font-medium"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Aramayı Temizle
        </button>
      )}
    </div>

    {/* Marka Filtresi */}
    <div>
      <label class="block text-sm font-semibold text-gray-900 mb-3">Markalar</label>
      <select
        class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
        value={selectedBrand?.value || ''}
        onChange$={e => onSelectBrand$ && onSelectBrand$(e.target.value || null)}
      >
        <option value="">Tüm Markalar</option>
        {brands.map(brand => (
          <option key={brand.name} value={brand.name}>{brand.name}</option>
        ))}
      </select>
    </div>

    {/* Kategoriler */}
    <div>
      <label class="block text-sm font-semibold text-gray-900 mb-3">Kategoriler</label>
      <div class="space-y-1">
        {/* Tüm Kategoriler */}
        <button
          class={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
            !selectedCategory?.value 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-[1.02]' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
          onClick$={() => {
            if (onSelectCategory$) {
              onSelectCategory$(null);
            }
          }}
        >
          <span class="font-medium">Tüm Kategoriler</span>
        </button>
        {/* Dinamik Kategori Listesi */}
        {categories.map(cat => (
          <button
            key={cat}
            class={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
              selectedCategory?.value === cat 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transform scale-[1.02]' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
            onClick$={() => {
              if (onSelectCategory$) {
                onSelectCategory$(cat);
              }
            }}
          >
            <span class="font-medium">{cat}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Aktif Filtreler */}
    {(selectedCategory?.value || searchTerm?.value) && (
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-semibold text-gray-900">Aktif Filtreler</span>
          <button
            onClick$={() => {
              if (onSelectCategory$) onSelectCategory$(null);
              if (onSearchChange$) {
                searchTerm.value = '';
                onSearchChange$('');
              }
              console.log('Sidebar: Tüm filtreler temizlendi');
            }}
            class="inline-flex items-center text-xs text-red-600 hover:text-red-700 font-medium"
          >
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Tümünü Temizle
          </button>
        </div>
        <div class="space-y-2">
          {selectedCategory?.value && (
            <div class="flex items-center justify-between bg-blue-100 px-3 py-2 rounded-lg">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                <span class="text-blue-800 font-medium text-sm">{selectedCategory.value}</span>
              </div>
              <button
                onClick$={() => {
                  if (onSelectCategory$) {
                    onSelectCategory$(null);
                  }
                }}
                class="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          )}
          {searchTerm?.value && (
            <div class="flex items-center justify-between bg-green-100 px-3 py-2 rounded-lg">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span class="text-green-800 font-medium text-sm">"{searchTerm.value}"</span>
              </div>
              <button
                onClick$={() => {
                  if (onSearchChange$) {
                    searchTerm.value = '';
                    onSearchChange$('');
                  }
                }}
                class="text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full p-1 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </aside>
  );
});

export default SidebarProductList;
