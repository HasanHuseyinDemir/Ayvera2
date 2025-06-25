import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { SimpleProductForm } from '../src/components/panel/SimpleProductForm';

export const ProductList = component$(() => {
  const products = useSignal([]);
  const categories = useSignal([]);
  const brands = useSignal([]);
  const loading = useSignal(true);
  const error = useSignal('');
  const showDeleteModal = useSignal(false);
  const productToDelete = useSignal(null);
  const showEditModal = useSignal(false);
  const editingProduct = useSignal(null);
  const viewingProductId = useSignal(null);
  const searchTerm = useSignal('');
  const selectedCategory = useSignal('');
  const selectedBrand = useSignal('');
  const filteredProducts = useSignal([]);

  const loadProducts = $(async () => {
    try {
      loading.value = true;
      if (typeof window !== 'undefined') {
        const { readProducts } = await import('~/services/db.js');
        const data = await readProducts();
        products.value = data || [];
        console.log('✅ Products yüklendi:', products.value.length, 'adet');
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
        categories.value = data || [];
        console.log('✅ Categories yüklendi:', categories.value.length, 'adet');
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
        brands.value = data || [];
        console.log('✅ Brands yüklendi:', brands.value.length, 'adet');
      }
    } catch (err) {
      console.error('❌ Markalar yüklenemedi:', err);
    }
  });

  const loadData = $(async () => {
    await Promise.all([loadProducts(), loadCategories(), loadBrands()]);
  });

  // Ürün filtreleme
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

  const toggleView = $(productId => {
    if (viewingProductId.value === productId) {
      viewingProductId.value = null;
    } else {
      viewingProductId.value = productId;
      editingProductId.value = null;
      showNewForm.value = false;
    }
  });

  const handleFormSuccess = $(async () => {
    editingProductId.value = null;
    showNewForm.value = false;
    await loadProducts();
  });

  const handleFormCancel = $(() => {
    showNewForm.value = false;
  });

  const handleAddProduct = $(() => {
    editingProduct.value = null; // Yeni ürün için null
    showEditModal.value = true;
  });

  const toggleNewForm = $(() => {
    showNewForm.value = !showNewForm.value;
    viewingProductId.value = null;
  });

  const handleEditProduct = $((product) => {
    console.log('🔧 Edit modal açılıyor, product:', product);
    editingProduct.value = product;
    showEditModal.value = true;
    console.log('🔧 Modal durumu:', { 
      showEditModal: showEditModal.value, 
      editingProduct: editingProduct.value 
    });
  });

  const handleEditModalClose = $(() => {
    editingProduct.value = null;
    showEditModal.value = false;
  });

  const handleEditSuccess = $(async () => {
    await loadProducts();
    await loadCategories();
    await loadBrands();
    handleEditModalClose();
  });

  return (
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Ürün Yönetimi</h1>
          
          {/* Test Modal Butonu */}
          <button
            onClick$={() => {
              const testProduct = { id: 999, title: 'Test Ürün', desc: 'Test açıklama' };
              handleEditProduct(testProduct);
            }}
            class="px-4 py-2 bg-purple-600 text-white rounded mr-4"
          >
            🧪 Test Modal
          </button>
          
          {/* Yeni Ürün Butonu */}
          <button
            onClick$={handleAddProduct}
            class="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
          >
            ➕ Yeni Ürün Ekle
          </button>
        </div>

        {/* Arama ve Filtreleme */}
        <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="🔍 Ürün ara..."
              value={searchTerm.value}
              onInput$={(e) => searchTerm.value = e.target.value}
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={selectedCategory.value}
              onChange$={(e) => selectedCategory.value = e.target.value}
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">📁 Tüm Kategoriler</option>
              {[...new Set(products.value.map(p => p.category).filter(Boolean))].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedBrand.value}
              onChange$={(e) => selectedBrand.value = e.target.value}
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">🏷️ Tüm Markalar</option>
              {[...new Set(products.value.map(p => p.brand).filter(Boolean))].map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading.value ? (
          <div class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-500">Ürünler yükleniyor...</p>
          </div>
        ) : error.value ? (
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            ❌ {error.value}
          </div>
        ) : filteredProducts.value.length === 0 ? (
          <div class="text-center py-12 bg-white rounded-xl shadow-sm">
            <p class="text-gray-500 text-lg">
              {searchTerm.value || selectedCategory.value || selectedBrand.value 
                ? '🔍 Filtreye uygun ürün bulunamadı.' 
                : '📦 Henüz ürün bulunmuyor.'}
            </p>
          </div>
        ) : (
          /* Ürün Listesi */
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.value.map((product) => (
              <div key={product.id} class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200">
                {/* Ürün Kartı */}
                <div class="p-6">
                  {/* Ürün Resmi */}
                  <div class="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    {product.img ? (
                      <img 
                        src={product.img} 
                        alt={product.title}
                        class="w-full h-full object-cover"
                        onError$={(e) => {
                          e.target.src = '/stock/camera.png'; // Fallback image
                        }}
                      />
                    ) : (
                      <div class="w-full h-full flex items-center justify-center text-gray-400">
                        📷 Resim Yok
                      </div>
                    )}
                  </div>

                  {/* Ürün Bilgileri */}
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                  <p class="text-gray-600 text-sm mb-3 line-clamp-2">{product.desc?.substring(0, 100)}...</p>
                  
                  <div class="flex justify-between items-center mb-4">
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      📁 {product.category}
                    </span>
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      🏷️ {product.brand}
                    </span>
                  </div>

                  {/* Butonlar */}
                  <div class="flex gap-2">
                    <button 
                      class="flex-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                      onClick$={() => toggleView(product.id)}
                    >
                      {viewingProductId.value === product.id ? '❌ Kapat' : '👁️ Görüntüle'}
                    </button>
                    <button 
                      class="flex-1 px-4 py-2 rounded-lg transition-colors bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      onClick$={() => handleEditProduct(product)}
                    >
                      ✏️ Düzenle
                    </button>
                    <button 
                      class="bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                      onClick$={() => confirmDelete(product.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Görüntüleme Alanı */}
                {viewingProductId.value === product.id && (
                  <div class="border-t bg-blue-50 p-6">
                    <h4 class="text-lg font-bold text-blue-900 mb-4">👁️ Ürün Detayları</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Ürün Adı</label>
                        <p class="text-gray-900">{product.title}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Açıklama</label>
                        <p class="text-gray-900">{product.desc}</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Kategori</label>
                          <p class="text-gray-900">{product.category}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Marka</label>
                          <p class="text-gray-900">{product.brand}</p>
                        </div>
                      </div>
                      {product.features && product.features.length > 0 && (
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Özellikler</label>
                          <ul class="list-disc list-inside text-gray-900 space-y-1">
                            {product.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Silme Onay Modal'ı */}
        {showDeleteModal.value && (
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 class="text-lg font-bold mb-4">🗑️ Ürünü Sil</h3>
              <p class="text-gray-600 mb-6">
                Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div class="flex gap-3">
                <button 
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick$={() => {
                    showDeleteModal.value = false;
                    productToDelete.value = null;
                  }}
                >
                  İptal
                </button>
                <button 
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick$={() => handleDelete(productToDelete.value)}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal.value && (
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" style="z-index: 9999;">
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-900">
                  {editingProduct.value?.id ? '✏️ Ürün Düzenle' : '➕ Yeni Ürün Ekle'}
                </h2>
                <button 
                  class="text-gray-400 hover:text-gray-600 text-3xl font-bold w-8 h-8 flex items-center justify-center"
                  onClick$={handleEditModalClose}
                >
                  ×
                </button>
              </div>
              <div class="p-6">
                <SimpleProductForm 
                  product={editingProduct.value}
                  categories={categories.value}
                  brands={brands.value}
                  onSuccess$={handleEditSuccess}
                  onCancel$={handleEditModalClose}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
