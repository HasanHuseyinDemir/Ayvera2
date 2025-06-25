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
  const filteredProducts = useSignal([]);

  const loadProducts = $(async () => {
    try {
      loading.value = true;
      console.log('🔍 Products yükleniyor...');
      
      if (typeof window !== 'undefined') {
        const { readProducts } = await import('~/services/db.js');
        const data = await readProducts();
        console.log('✅ Products yüklendi:', data?.length || 0, 'adet');
        products.value = data || [];
      }
    } catch (err) {
      console.error('❌ Products yükleme hatası:', err);
      error.value = 'Ürünler yüklenirken bir hata oluştu';
    } finally {
      loading.value = false;
    }
  });

  const loadCategories = $(async () => {
    try {
      if (typeof window !== 'undefined') {
        const { readCategories } = await import('~/services/db.js');
        const data = await readCategories();
        console.log('✅ Categories yüklendi:', data?.length || 0, 'adet');
        categories.value = data || [];
      }
    } catch (err) {
      console.error('❌ Kategoriler yüklenemedi:', err);
    }
  });

  const loadBrands = $(async () => {
    try {
      if (typeof window !== 'undefined') {
        const { readBrands } = await import('~/services/db.js');
        const data = await readBrands();
        console.log('✅ Brands yüklendi:', data?.length || 0, 'adet');
        brands.value = data || [];
      }
    } catch (err) {
      console.error('❌ Markalar yüklenemedi:', err);
    }
  });

  const loadData = $(async () => {
    await Promise.all([
      loadProducts(),
      loadCategories(),
      loadBrands()
    ]);
  });

  // Ürün filtreleme fonksiyonu
  const filterProducts = $(() => {
    let filtered = products.value;

    if (searchTerm.value.trim()) {
      const search = searchTerm.value.toLowerCase();
      filtered = filtered.filter(product => 
        product.title?.toLowerCase().includes(search) ||
        product.desc?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search) ||
        product.brand?.toLowerCase().includes(search)
      );
    }

    if (selectedCategory.value) {
      filtered = filtered.filter(product => product.category === selectedCategory.value);
    }

    if (selectedBrand.value) {
      filtered = filtered.filter(product => product.brand === selectedBrand.value);
    }

    filteredProducts.value = filtered;
  });

  // Ürünler değiştiğinde filtrelemeyi güncelle
  useVisibleTask$(({ track }) => {
    track(() => products.value);
    track(() => searchTerm.value);
    track(() => selectedCategory.value);
    track(() => selectedBrand.value);
    
    filterProducts();
  });

  useVisibleTask$(() => {
    loadData();
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

  const handleEdit = $((product) => {
    console.log('✏️ Ürün düzenleniyor:', product);
    editingProduct.value = {...product};
    showForm.value = true;
    selectedProduct.value = null; // Detay görünümünü kapat
  });

  const handleFormSuccess = $(async () => {
    console.log('✅ Form başarılı, panel kapatılıyor ve ürünler yeniden yükleniyor...');
    showForm.value = false;
    editingProduct.value = null;
    await loadProducts();
    console.log('🔄 Ürünler yeniden yüklendi, toplam:', products.value.length);
  });

  const handleFormCancel = $(() => {
    console.log('❌ Form iptal edildi');
    showForm.value = false;
    editingProduct.value = null;
  });

  const viewProduct = $(product => {
    selectedProduct.value = product;
    showForm.value = false; // Form panelini kapat
  });

  return (
    <div class="p-6">
      <div class="flex gap-6">
        {/* Sol Taraf - Ürün Listesi */}
        <div class="flex-1">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-4">Ürün Yönetimi</h1>
            
            {/* Yeni Ürün Ekle Butonu */}
            <button
              onClick$={() => {
                editingProduct.value = null;
                showForm.value = true;
                selectedProduct.value = null;
              }}
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
            >
              + Yeni Ürün Ekle
            </button>

            {/* Arama ve Filtreleme */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm.value}
                onInput$={(e) => searchTerm.value = e.target.value}
                class="px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={selectedCategory.value}
                onChange$={(e) => selectedCategory.value = e.target.value}
                class="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Tüm Kategoriler</option>
                {[...new Set(products.value.map(p => p.category).filter(Boolean))].map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedBrand.value}
                onChange$={(e) => selectedBrand.value = e.target.value}
                class="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Tüm Markalar</option>
                {[...new Set(products.value.map(p => p.brand).filter(Boolean))].map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          {loading.value ? (
            <div class="text-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-500">Ürünler yükleniyor...</p>
            </div>
          ) : error.value ? (
            <div class="text-center py-12">
              <p class="text-red-500">{error.value}</p>
            </div>
          ) : filteredProducts.value.length === 0 ? (
            <div class="text-center py-12">
              <p class="text-gray-500">
                {searchTerm.value || selectedCategory.value || selectedBrand.value 
                  ? 'Filtreye uygun ürün bulunamadı.' 
                  : 'Henüz ürün bulunmuyor.'}
              </p>
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
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {filteredProducts.value.map((product) => (
                    <tr key={product.id} class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{product.title}</div>
                            <div class="text-sm text-gray-500">{product.desc?.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.brand}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          class="text-blue-600 hover:text-blue-900"
                          onClick$={() => viewProduct(product)}
                        >
                          Görüntüle
                        </button>
                        <button 
                          class="text-yellow-600 hover:text-yellow-900"
                          onClick$={() => handleEdit(product)}
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
        </div>

        {/* Sağ Taraf - Düzenleme/Görüntüleme Paneli */}
        {(showForm.value || selectedProduct.value) && (
          <div class="w-1/2 bg-white shadow-lg rounded-lg p-6">
            {showForm.value ? (
              <>
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-bold text-gray-900">
                    {editingProduct.value ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                  </h2>
                  <button 
                    class="text-gray-500 hover:text-gray-700 text-xl"
                    onClick$={handleFormCancel}
                  >
                    ✕
                  </button>
                </div>
                
                <ProductForm
                  product={editingProduct.value || {}}
                  categories={categories.value || []}
                  brands={brands.value || []}
                  onSuccess$={handleFormSuccess}
                  onCancel$={handleFormCancel}
                />
              </>
            ) : selectedProduct.value ? (
              <>
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-bold text-gray-900">Ürün Detayları</h2>
                  <button 
                    class="text-gray-500 hover:text-gray-700 text-xl"
                    onClick$={() => selectedProduct.value = null}
                  >
                    ✕
                  </button>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Ürün Adı</label>
                    <p class="text-sm text-gray-900">{selectedProduct.value.title}</p>
                  </div>
                  
                  {selectedProduct.value.desc && (
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Açıklama</label>
                      <p class="text-sm text-gray-900">{selectedProduct.value.desc}</p>
                    </div>
                  )}
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Kategori</label>
                      <p class="text-sm text-gray-900">{selectedProduct.value.category}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Marka</label>
                      <p class="text-sm text-gray-900">{selectedProduct.value.brand}</p>
                    </div>
                  </div>
                  
                  {selectedProduct.value.features && selectedProduct.value.features.length > 0 && (
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Özellikler</label>
                      <ul class="text-sm text-gray-900 list-disc list-inside">
                        {selectedProduct.value.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Düzenle Butonu */}
                  <div class="pt-4 border-t">
                    <button 
                      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      onClick$={() => handleEdit(selectedProduct.value)}
                    >
                      Bu Ürünü Düzenle
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Silme Onay Modal'ı - Sadece bu modal kalır */}
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
