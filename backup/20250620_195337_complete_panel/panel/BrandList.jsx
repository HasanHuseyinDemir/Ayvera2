import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';

export const BrandList = component$(() => {
  const brands = useSignal([]);
  const loading = useSignal(true);
  const error = useSignal('');
  const selectedBrand = useSignal(null);
  const showDeleteModal = useSignal(false);
  const brandToDelete = useSignal(null);

  useVisibleTask$(() => {
    loadBrands();
  });

  const loadBrands = $(async () => {
    try {
      loading.value = true;
      const response = await fetch('/api/brands');
      if (response.ok) {
        const data = await response.json();
        brands.value = data;
      } else {
        error.value = 'Markalar yüklenirken bir hata oluştu';
      }
    } catch (err) {
      error.value = 'Markalar yüklenirken bir hata oluştu';
    } finally {
      loading.value = false;
    }
  });

  const handleDelete = $(async (brandId) => {
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        brands.value = brands.value.filter(brand => brand.id !== brandId);
        showDeleteModal.value = false;
        brandToDelete.value = null;
      } else {
        error.value = 'Marka silinirken bir hata oluştu';
      }
    } catch (err) {
      error.value = 'Marka silinirken bir hata oluştu';
    }
  });

  const confirmDelete = $(brandId => {
    brandToDelete.value = brandId;
    showDeleteModal.value = true;
  });

  const viewBrand = $(brand => {
    selectedBrand.value = brand;
  });

  if (loading.value) {
    return (
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error.value) {
    return (
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error.value}
      </div>
    );
  }

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Marka Yönetimi</h2>
        <button 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick$={() => window.location.href = '/panel/brands/add'}
        >
          Yeni Marka Ekle
        </button>
      </div>

      {brands.value.length === 0 ? (
        <div class="text-center py-12">
          <p class="text-gray-500">Henüz marka bulunmuyor.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.value.map((brand) => (
            <div key={brand.id} class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                {brand.logo ? (
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    class="w-full h-32 object-contain p-4"
                  />
                ) : (
                  <div class="flex items-center justify-center h-32 bg-gray-200">
                    <span class="text-gray-400 text-2xl font-bold">
                      {brand.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{brand.name}</h3>
                
                {brand.description && (
                  <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                    {brand.description}
                  </p>
                )}
                
                <div class="flex items-center justify-between mb-3">
                  <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    brand.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {brand.status === 'active' ? 'Aktif' : 'Pasif'}
                  </span>
                  
                  {brand.productCount && (
                    <span class="text-xs text-gray-500">
                      {brand.productCount} ürün
                    </span>
                  )}
                </div>
                
                <div class="flex justify-between space-x-2">
                  <button 
                    class="flex-1 text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100"
                    onClick$={() => viewBrand(brand)}
                  >
                    Detay
                  </button>
                  <button 
                    class="flex-1 text-xs bg-yellow-50 text-yellow-600 px-3 py-2 rounded hover:bg-yellow-100"
                    onClick$={() => window.location.href = `/panel/brands/edit/${brand.id}`}
                  >
                    Düzenle
                  </button>
                  <button 
                    class="flex-1 text-xs bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100"
                    onClick$={() => confirmDelete(brand.id)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Marka Detayları Modal */}
      {selectedBrand.value && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold">Marka Detayları</h3>
              <button 
                class="text-gray-500 hover:text-gray-700"
                onClick$={() => selectedBrand.value = null}
              >
                ✕
              </button>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                {selectedBrand.value.logo ? (
                  <img 
                    src={selectedBrand.value.logo} 
                    alt={selectedBrand.value.name}
                    class="w-16 h-16 object-contain rounded-lg border"
                  />
                ) : (
                  <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span class="text-gray-400 text-xl font-bold">
                      {selectedBrand.value.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 class="text-lg font-semibold">{selectedBrand.value.name}</h4>
                  <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedBrand.value.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedBrand.value.status === 'active' ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
              
              {selectedBrand.value.description && (
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <p class="text-sm text-gray-900">{selectedBrand.value.description}</p>
                </div>
              )}
              
              {selectedBrand.value.website && (
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <a 
                    href={selectedBrand.value.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedBrand.value.website}
                  </a>
                </div>
              )}
              
              {selectedBrand.value.country && (
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ülke</label>
                  <p class="text-sm text-gray-900">{selectedBrand.value.country}</p>
                </div>
              )}
              
              {selectedBrand.value.founded && (
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kuruluş Yılı</label>
                  <p class="text-sm text-gray-900">{selectedBrand.value.founded}</p>
                </div>
              )}
              
              {selectedBrand.value.productCount && (
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ürün Sayısı</label>
                  <p class="text-sm text-gray-900">{selectedBrand.value.productCount}</p>
                </div>
              )}
              
              {selectedBrand.value.createdAt && (
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Oluşturulma Tarihi</label>
                  <p class="text-sm text-gray-900">
                    {new Date(selectedBrand.value.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Silme Onay Modal */}
      {showDeleteModal.value && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-bold mb-4">Markayı Sil</h3>
            <p class="text-gray-600 mb-6">
              Bu markayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve bu markaya ait tüm ürünler etkilenebilir.
            </p>
            <div class="flex justify-end space-x-3">
              <button 
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick$={() => {
                  showDeleteModal.value = false;
                  brandToDelete.value = null;
                }}
              >
                İptal
              </button>
              <button 
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick$={() => handleDelete(brandToDelete.value)}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
