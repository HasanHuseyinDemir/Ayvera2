import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { ProductForm } from './ProductForm';

export const ProductList = component$(() => {
  const products = useSignal([]);
  const categories = useSignal([]);
  const brands = useSignal([]);
  const loading = useSignal(true);
  const error = useSignal('');
  const showDeleteModal = useSignal(false);
  const productToDelete = useSignal(null);
  const showNewForm = useSignal(false);
  const editingProductId = useSignal(null);
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

  const toggleEdit = $(productId => {
    if (editingProductId.value === productId) {
      editingProductId.value = null;
    } else {
      editingProductId.value = productId;
      viewingProductId.value = null;
      showNewForm.value = false;
    }
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
    editingProductId.value = null;
    showNewForm.value = false;
  });

  const toggleNewForm = $(() => {
    showNewForm.value = !showNewForm.value;
    editingProductId.value = null;
    viewingProductId.value = null;
  });

  return (
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Ürün Yönetimi</h1>
          
          {/* Yeni Ürün Butonu */}
          <button
            onClick$={toggleNewForm}
            class={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              showNewForm.value 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {showNewForm.value ? '❌ İptal Et' : '➕ Yeni Ürün Ekle'}
          </button>
        </div>

        {/* Yeni Ürün Formu */}
        {showNewForm.value && (
          <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
            <h2 class="text-xl font-bold text-gray-900 mb-4">🆕 Yeni Ürün Ekle</h2>
            <ProductForm
              product={{}}
              categories={categories.value || []}
              brands={brands.value || []}
              onSuccess$={handleFormSuccess}
              onCancel$={handleFormCancel}
            />
          </div>
        )}

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
                      class={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                        editingProductId.value === product.id
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      }`}
                      onClick$={() => toggleEdit(product.id)}
                    >
                      {editingProductId.value === product.id ? '❌ Kapat' : '✏️ Düzenle'}
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

                {/* Düzenleme Alanı */}
                {editingProductId.value === product.id && (
                  <div class="border-t bg-yellow-50 p-6">
                    <h4 class="text-lg font-bold text-yellow-900 mb-4">✏️ Ürün Düzenle</h4>
                    <ProductForm
                      product={product}
                      categories={categories.value || []}
                      brands={brands.value || []}
                      onSuccess$={handleFormSuccess}
                      onCancel$={handleFormCancel}
                    />
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
      </div>
    </div>
  );
});
