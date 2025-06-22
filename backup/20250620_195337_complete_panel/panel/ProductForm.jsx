import { component$, useSignal, useStore, $, useTask$ } from '@builder.io/qwik';

export const ProductForm = component$(({ product, categories, brands, onSave$, onCancel$ }) => {
  const formData = useStore({
    title: product?.title || '',
    desc: product?.desc || '',
    category: product?.category || '',
    brand: product?.brand || '',
    features: product?.features || [''],
    img: product?.img || ''
  });
  
  const loading = useSignal(false);
  const error = useSignal('');

  const addFeature = $(() => {
    formData.features.push('');
  });

  const removeFeature = $((index) => {
    formData.features.splice(index, 1);
  });

  const updateFeature = $((index, value) => {
    formData.features[index] = value;
  });

  const handleSubmit = $(async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      error.value = 'Ürün adı gerekli';
      return;
    }

    try {
      loading.value = true;
      error.value = '';

      const productData = {
        ...formData,
        features: formData.features.filter(f => f.trim()),
        id: product?.id || Date.now()
      };

      const url = product?.id ? `/api/products/${product.id}` : '/api/products';
      const method = product?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        await onSave$(productData);
      } else {
        error.value = 'Ürün kaydedilirken hata oluştu';
      }
    } catch (err) {
      error.value = 'Ürün kaydedilirken hata oluştu';
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">
            {product?.id ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </h3>
          <button
            onClick$={onCancel$}
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit$={handleSubmit} class="space-y-4">
          {error.value && (
            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-red-800 text-sm">{error.value}</p>
            </div>
          )}

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
              <input
                type="text"
                bind:value={formData.title}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ürün adını girin"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                bind:value={formData.category}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Kategori seçin</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Marka</label>
              <select
                bind:value={formData.brand}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Marka seçin</option>
                {brands.map((brand) => (
                  <option key={brand.name} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
              <input
                type="text"
                bind:value={formData.img}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/stock/product.png"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              bind:value={formData.desc}
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ürün açıklaması"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Özellikler</label>
            <div class="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} class="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onInput$={(e) => updateFeature(index, e.target.value)}
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Özellik girin"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick$={() => removeFeature(index)}
                      class="p-2 text-red-600 hover:text-red-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick$={addFeature}
                class="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>Özellik Ekle</span>
              </button>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick$={onCancel$}
              disabled={loading.value}
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading.value}
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading.value ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
