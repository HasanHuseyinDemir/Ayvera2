import { component$, useSignal, useVisibleTask$, $, useStore } from '@builder.io/qwik';
import { ProductForm } from '../../../backup/ProductForm';

export const ProductList = component$(() => {
  const products = useSignal([]);
  const categories = useSignal([]);
  const brands = useSignal([]);
  const loading = useSignal(true);
  const error = useSignal('');
  const selectedProduct = useSignal(null);
  const showDeleteModal = useSignal(false);
  const productToDelete = useSignal(null);
  const showForm = useSignal(false);
  const editingProduct = useSignal(null);
  const searchTerm = useSignal('');
  const selectedCategory = useSignal('');
  const selectedBrand = useSignal('');

  useVisibleTask$(() => {
    loadData();
  });

  const loadData = $(async () => {
    await Promise.all([
      loadProducts(),
      loadCategories(),
      loadBrands()
    ]);
  });

  const loadProducts = $(async () => {
    try {
      loading.value = true;
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        products.value = data;
      } else {
        error.value = 'Ürünler yüklenirken bir hata oluştu';
      }
    } catch (err) {
      error.value = 'Ürünler yüklenirken bir hata oluştu';
    } finally {
      loading.value = false;
    }
  });

  const loadCategories = $(async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        categories.value = data;
      }
    } catch (err) {
      console.error('Kategoriler yüklenemedi:', err);
    }
  });

  const loadBrands = $(async () => {
    try {
      const response = await fetch('/api/brands');
      if (response.ok) {
        const data = await response.json();
        brands.value = data;
      }
    } catch (err) {
      console.error('Markalar yüklenemedi:', err);
    }
  });

  const handleDelete = $(async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        products.value = products.value.filter(product => product.id !== productId);
        showDeleteModal.value = false;
        productToDelete.value = null;
      } else {
        error.value = 'Ürün silinirken bir hata oluştu';
      }
    } catch (err) {
      error.value = 'Ürün silinirken bir hata oluştu';
    }
  });

  const confirmDelete = $(productId => {
    productToDelete.value = productId;
    showDeleteModal.value = true;
  });

  const viewProduct = $(product => {
    selectedProduct.value = product;
  });

  const addNew = $(() => {
    editingProduct.value = null;
    showForm.value = true;
  });

  const editProduct = $(product => {
    editingProduct.value = product;
    showForm.value = true;
  });

  const onFormSuccess = $(() => {
    showForm.value = false;
    editingProduct.value = null;
    loadProducts();
  });

  const onFormCancel = $(() => {
    showForm.value = false;
    editingProduct.value = null;
  });

  // Filtrelenmiş ürünler
  const filteredProducts = products.value.filter(product => {
    const matchesSearch = !searchTerm.value || 
      product.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.value.toLowerCase());
    
    const matchesCategory = !selectedCategory.value || 
      product.category === selectedCategory.value;
    
    const matchesBrand = !selectedBrand.value || 
      product.brand === selectedBrand.value;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  if (loading.value) {
    return (
      <div class="flex items-center justify-center p-8">
        <div class="flex items-center space-x-2">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="text-gray-600">Ürünler yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      {/* Başlık ve Ekle Butonu */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p class="mt-1 text-sm text-gray-500">Ürün envanterini yönetin</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button
            onClick$={addNew}
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Yeni Ürün
          </button>
        </div>
      </div>

      {/* Arama ve Filtreleme */}
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ürün Ara</label>
            <input
              type="text"
              value={searchTerm.value}
              onInput$={(e) => searchTerm.value = e.target.value}
              placeholder="Ürün adı veya açıklama..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={selectedCategory.value}
              onChange$={(e) => selectedCategory.value = e.target.value}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.value.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Marka</label>
            <select
              value={selectedBrand.value}
              onChange$={(e) => selectedBrand.value = e.target.value}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Markalar</option>
              {brands.value.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hata Mesajı */}
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

      {/* Form Modal */}
      {showForm.value && (
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick$={onFormCancel}></div>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <ProductForm 
                product={editingProduct.value}
                categories={categories.value}
                brands={brands.value}
                onSuccess$={onFormSuccess}
                onCancel$={onFormCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Ürün Listesi */}
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredProducts.length === 0 ? (
          <div class="px-6 py-8 text-center text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              {searchTerm.value || selectedCategory.value || selectedBrand.value ? 'Arama kriterlerine uygun ürün bulunamadı' : 'Ürün bulunamadı'}
            </h3>
            <p class="mt-1 text-sm text-gray-500">İlk ürünü ekleyerek başlayın.</p>
          </div>
        ) : (
          <ul class="divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const category = categories.value.find(c => c.id === product.category);
              const brand = brands.value.find(b => b.id === product.brand);
              
              return (
                <li key={product.id} class="hover:bg-gray-50">
                  <div class="px-4 py-4 flex items-center justify-between">
                    <div class="flex items-center min-w-0 flex-1">
                      <div class="flex-shrink-0">
                        {product.image ? (
                          <img class="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                        ) : (
                          <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div class="ml-4 min-w-0 flex-1">
                        <div class="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                        <div class="text-sm text-gray-500 truncate">
                          {category?.name} • {brand?.name}
                        </div>
                        {product.price && (
                          <div class="text-sm font-medium text-green-600">
                            ₺{typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <button
                        onClick$={() => viewProduct(product)}
                        class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Görüntüle
                      </button>
                      
                      <button
                        onClick$={() => editProduct(product)}
                        class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Düzenle
                      </button>
                      
                      <button
                        onClick$={() => confirmDelete(product.id)}
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
              );
            })}
          </ul>
        )}
      </div>

      {/* Ürün Detay Modal */}
      {selectedProduct.value && (
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick$={() => selectedProduct.value = null}></div>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Ürün Detayları
                    </h3>
                    <div class="space-y-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Ürün Adı</label>
                        <p class="mt-1 text-sm text-gray-900">{selectedProduct.value.name}</p>
                      </div>
                      {selectedProduct.value.description && (
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Açıklama</label>
                          <p class="mt-1 text-sm text-gray-900">{selectedProduct.value.description}</p>
                        </div>
                      )}
                      {selectedProduct.value.price && (
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Fiyat</label>
                          <p class="mt-1 text-sm text-gray-900">₺{selectedProduct.value.price}</p>
                        </div>
                      )}
                      <div>
                        <label class="block text-sm font-medium text-gray-700">ID</label>
                        <p class="mt-1 text-sm text-gray-500">{selectedProduct.value.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick$={() => selectedProduct.value = null}
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Silme Onay Modal */}
      {showDeleteModal.value && (
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Ürünü Sil
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick$={() => handleDelete(productToDelete.value)}
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Sil
                </button>
                <button
                  onClick$={() => {
                    showDeleteModal.value = false;
                    productToDelete.value = null;
                  }}
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
