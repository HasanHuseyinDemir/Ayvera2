import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { BrandForm } from './BrandForm';

export const BrandList = component$(() => {
  const brands = useSignal([]);
  const loading = useSignal(true);
  const error = useSignal('');
  const success = useSignal('');
  const selectedBrand = useSignal(null);
  const showDeleteModal = useSignal(false);
  const brandToDelete = useSignal(null);
  const showForm = useSignal(false);
  const editingBrand = useSignal(null);

  // TEST MODAL STATE
  // const showTestModal = useSignal(false);

  const loadBrands = $(async () => {
    try {
      loading.value = true;
      error.value = '';
      console.log('🔍 Brands yükleniyor...');
      
      if (typeof window !== 'undefined') {
        const { readBrands } = await import('~/services/db.js');
        const data = await readBrands();
        console.log('✅ Brands yüklendi:', data?.length || 0, 'adet');
        brands.value = data || [];
      }
    } catch (err) {
      console.error('❌ Brands yükleme hatası:', err);
      brands.value = [];
      error.value = 'Markalar yüklenirken hata oluştu: ' + err.message;
    } finally {
      loading.value = false;
    }
  });

  useVisibleTask$(() => {
    loadBrands();
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
        success.value = 'Marka başarıyla silindi';
        setTimeout(() => success.value = '', 3000);
      } else {
        error.value = 'Marka silinirken bir hata oluştu';
      }
    } catch (err) {
      error.value = 'Marka silinirken bir hata oluştu';
      console.error('Marka silinemedi:', err);
    }
  });

  const confirmDelete = $(brandId => {
    brandToDelete.value = brandId;
    showDeleteModal.value = true;
  });

  const viewBrand = $(brand => {
    selectedBrand.value = brand;
  });

  const addNew = $(() => {
    editingBrand.value = null;
    showForm.value = true;
  });

  const editBrand = $(brand => {
    editingBrand.value = brand;
    showForm.value = true;
  });

  const onFormSuccess = $(() => {
    showForm.value = false;
    editingBrand.value = null;
    loadBrands();
    success.value = editingBrand.value ? 'Marka başarıyla güncellendi' : 'Marka başarıyla eklendi';
    setTimeout(() => success.value = '', 3000);
  });

  const onFormCancel = $(() => {
    showForm.value = false;
    editingBrand.value = null;
  });

  if (loading.value) {
    return (
      <div class="flex items-center justify-center p-8">
        <div class="flex items-center space-x-2">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="text-gray-600">Markalar yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      {/* Başlık ve Ekle Butonu */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Markalar</h1>
          <p class="mt-1 text-sm text-gray-500">Ürün markalarını yönetin</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button
            onClick$={addNew}
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Yeni Marka
          </button>
        </div>
      </div>

      {/* Hata ve Başarı Mesajları */}
      {error.value && (
        <div class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{error.value}</p>
            </div>
            <div class="ml-auto pl-3">
              <button onClick$={() => error.value = ''} class="inline-flex text-red-400 hover:text-red-600">
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {success.value && (
        <div class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">{success.value}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal (Sadeleştirilmiş) */}
      {showForm.value && (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <BrandForm 
              brand={editingBrand.value}
              onSuccess$={onFormSuccess}
              onCancel$={onFormCancel}
            />
          </div>
        </div>
      )}

      {/* Marka Listesi */}
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          {brands.value.length === 0 ? (
            <li class="px-6 py-8 text-center text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Marka bulunamadı</h3>
              <p class="mt-1 text-sm text-gray-500">İlk markayı ekleyerek başlayın.</p>
            </li>
          ) : (
            brands.value.map((brand) => (
              <li key={brand.id} class="hover:bg-gray-50">
                <div class="px-4 py-4 flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      {brand.logo ? (
                        <img class="h-10 w-10 rounded-lg object-cover" src={brand.logo} alt={brand.name} />
                      ) : (
                        <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{brand.name}</div>
                      {brand.description && (
                        <div class="text-sm text-gray-500">{brand.description}</div>
                      )}
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <button
                      onClick$={() => viewBrand(brand)}
                      class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Görüntüle
                    </button>
                    
                    <button
                      onClick$={() => editBrand(brand)}
                      class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Düzenle
                    </button>
                    
                    <button
                      onClick$={() => confirmDelete(brand.id)}
                      class="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Sil
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Marka Detay Modal (Sadeleştirilmiş) */}
      {selectedBrand.value && (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 class="text-xl font-bold mb-4">Marka Detayları</h2>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Marka Adı</label>
                <p class="mt-1 text-sm text-gray-900">{selectedBrand.value.name}</p>
              </div>
              {selectedBrand.value.logo && (
                <div>
                  <label class="block text-sm font-medium text-gray-700">Logo</label>
                  <img class="mt-1 h-16 w-16 rounded-lg object-cover mx-auto" src={selectedBrand.value.logo} alt={selectedBrand.value.name} />
                </div>
              )}
              {selectedBrand.value.description && (
                <div>
                  <label class="block text-sm font-medium text-gray-700">Açıklama</label>
                  <p class="mt-1 text-sm text-gray-900">{selectedBrand.value.description}</p>
                </div>
              )}
              <div>
                <label class="block text-sm font-medium text-gray-700">ID</label>
                <p class="mt-1 text-sm text-gray-500">{selectedBrand.value.id}</p>
              </div>
            </div>
            <button
              onClick$={() => selectedBrand.value = null}
              class="mt-6 px-4 py-2 bg-gray-700 text-white rounded"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı (Sadeleştirilmiş) */}
      {showDeleteModal.value && (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 class="text-xl font-bold mb-4">Markayı Sil</h2>
            <p class="mb-6 text-gray-700">Bu markayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            <div class="flex justify-center gap-4">
              <button
                onClick$={() => handleDelete(brandToDelete.value)}
                class="px-4 py-2 bg-red-600 text-white rounded"
              >
                Sil
              </button>
              <button
                onClick$={() => { showDeleteModal.value = false; brandToDelete.value = null; }}
                class="px-4 py-2 bg-gray-700 text-white rounded"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
