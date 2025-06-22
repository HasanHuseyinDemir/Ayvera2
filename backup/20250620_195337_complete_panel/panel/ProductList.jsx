import { component$, useSignal, useVisibleTask$, $, useStore } from '@builder.io/qwik';
import { ProductForm } from './ProductForm';

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
        <h2 class="text-2xl font-bold text-gray-900">Ürün Yönetimi</h2>
        <button 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick$={() => window.location.href = '/panel/products/add'}
        >
          Yeni Ürün Ekle
        </button>
      </div>

      {products.value.length === 0 ? (
        <div class="text-center py-12">
          <p class="text-gray-500">Henüz ürün bulunmuyor.</p>
        </div>
      ) : (
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marka
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {products.value.map((product) => (
                <tr key={product.id} class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      {product.image && (
                        <img 
                          class="h-10 w-10 rounded-full object-cover mr-4" 
                          src={product.image} 
                          alt={product.name} 
                        />
                      )}
                      <div>
                        <div class="text-sm font-medium text-gray-900">{product.name}</div>
                        <div class="text-sm text-gray-500">{product.model}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.brand}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price ? `${product.price} TL` : 'Fiyat belirtilmemiş'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button 
                      class="text-blue-600 hover:text-blue-900"
                      onClick$={() => viewProduct(product)}
                    >
                      Görüntüle
                    </button>
                    <button 
                      class="text-yellow-600 hover:text-yellow-900"
                      onClick$={() => window.location.href = `/panel/products/edit/${product.id}`}
                    >
                      Düzenle
                    </button>
                    <button 
                      class="text-red-600 hover:text-red-900"
                      onClick$={() => confirmDelete(product.id)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ürün Detayları Modal */}
      {selectedProduct.value && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold">Ürün Detayları</h3>
              <button 
                class="text-gray-500 hover:text-gray-700"
                onClick$={() => selectedProduct.value = null}
              >
                ✕
              </button>
            </div>
            
            <div class="space-y-4">
              {selectedProduct.value.image && (
                <img 
                  src={selectedProduct.value.image} 
                  alt={selectedProduct.value.name}
                  class="w-full h-48 object-cover rounded-lg"
                />
              )}
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Ürün Adı</label>
                  <p class="text-sm text-gray-900">{selectedProduct.value.name}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Model</label>
                  <p class="text-sm text-gray-900">{selectedProduct.value.model}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Kategori</label>
                  <p class="text-sm text-gray-900">{selectedProduct.value.category}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Marka</label>
                  <p class="text-sm text-gray-900">{selectedProduct.value.brand}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Fiyat</label>
                  <p class="text-sm text-gray-900">{selectedProduct.value.price ? `${selectedProduct.value.price} TL` : 'Belirtilmemiş'}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Durum</label>
                  <p class="text-sm text-gray-900">{selectedProduct.value.status === 'active' ? 'Aktif' : 'Pasif'}</p>
                </div>
              </div>
              
              {selectedProduct.value.description && (
                <div>
                  <label class="block text-sm font-medium text-gray-700">Açıklama</label>
                  <p class="text-sm text-gray-900">{selectedProduct.value.description}</p>
                </div>
              )}
              
              {selectedProduct.value.specifications && (
                <div>
                  <label class="block text-sm font-medium text-gray-700">Teknik Özellikler</label>
                  <p class="text-sm text-gray-900 whitespace-pre-line">{selectedProduct.value.specifications}</p>
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
            <h3 class="text-lg font-bold mb-4">Ürünü Sil</h3>
            <p class="text-gray-600 mb-6">
              Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div class="flex justify-end space-x-3">
              <button 
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick$={() => {
                  showDeleteModal.value = false;
                  productToDelete.value = null;
                }}
              >
                İptal
              </button>
              <button 
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick$={() => handleDelete(productToDelete.value)}
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
