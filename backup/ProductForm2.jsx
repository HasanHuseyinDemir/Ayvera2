import { component$, useSignal, $ } from '@builder.io/qwik';

export const ProductForm = component$(({ product, categories, brands, onSuccess$, onCancel$ }) => {
  const name = useSignal(product?.name || '');
  const description = useSignal(product?.description || '');
  const price = useSignal(product?.price || '');
  const category = useSignal(product?.category || '');
  const brand = useSignal(product?.brand || '');
  const image = useSignal(product?.image || '');
  const features = useSignal(product?.features || ['']);
  const loading = useSignal(false);
  const error = useSignal('');

  const addFeature = $(() => {
    features.value = [...features.value, ''];
  });

  const removeFeature = $((index) => {
    features.value = features.value.filter((_, i) => i !== index);
  });

  const updateFeature = $((index, value) => {
    const newFeatures = [...features.value];
    newFeatures[index] = value;
    features.value = newFeatures;
  });

  const handleSubmit = $(async (e) => {
    e.preventDefault();
    
    if (!name.value.trim()) {
      error.value = 'Ürün adı gereklidir';
      return;
    }

    if (!category.value) {
      error.value = 'Kategori seçimi gereklidir';
      return;
    }

    if (!brand.value) {
      error.value = 'Marka seçimi gereklidir';
      return;
    }

    try {
      loading.value = true;
      error.value = '';

      const productData = {
        name: name.value.trim(),
        description: description.value.trim(),
        price: price.value.trim(),
        category: category.value,
        brand: brand.value,
        image: image.value.trim(),
        features: features.value.filter(f => f.trim())
      };

      const url = product 
        ? `/api/products/${product.id}`
        : '/api/products';
      
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        onSuccess$();
      } else {
        const errorData = await response.json();
        error.value = errorData.message || 'İşlem sırasında bir hata oluştu';
      }
    } catch (err) {
      error.value = 'Ağ hatası: ' + err.message;
      console.error('Form submission error:', err);
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="bg-white">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
        </h3>

        {error.value && (
          <div class="mb-4 rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{error.value}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit$={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="product-name" class="block text-sm font-medium text-gray-700">
                Ürün Adı *
              </label>
              <div class="mt-1">
                <input
                  id="product-name"
                  name="name"
                  type="text"
                  required
                  value={name.value}
                  onInput$={(e) => name.value = e.target.value}
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Ürün adını girin"
                />
              </div>
            </div>

            <div>
              <label for="product-price" class="block text-sm font-medium text-gray-700">
                Fiyat
              </label>
              <div class="mt-1">
                <input
                  id="product-price"
                  name="price"
                  type="text"
                  value={price.value}
                  onInput$={(e) => price.value = e.target.value}
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Fiyat bilgisi"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="product-category" class="block text-sm font-medium text-gray-700">
                Kategori *
              </label>
              <div class="mt-1">
                <select
                  id="product-category"
                  name="category"
                  required
                  value={category.value}
                  onChange$={(e) => category.value = e.target.value}
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Kategori seçin</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label for="product-brand" class="block text-sm font-medium text-gray-700">
                Marka *
              </label>
              <div class="mt-1">
                <select
                  id="product-brand"
                  name="brand"
                  required
                  value={brand.value}
                  onChange$={(e) => brand.value = e.target.value}
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Marka seçin</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label for="product-image" class="block text-sm font-medium text-gray-700">
              Görsel URL
            </label>
            <div class="mt-1">
              <input
                id="product-image"
                name="image"
                type="text"
                value={image.value}
                onInput$={(e) => image.value = e.target.value}
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="/images/product.jpg"
              />
            </div>
            <p class="mt-2 text-sm text-gray-500">
              Ürün görselinin URL'sini girin.
            </p>
          </div>

          <div>
            <label for="product-description" class="block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <div class="mt-1">
              <textarea
                id="product-description"
                name="description"
                rows={4}
                value={description.value}
                onInput$={(e) => description.value = e.target.value}
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Ürün açıklaması"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Özellikler
            </label>
            <div class="space-y-2">
              {features.value.map((feature, index) => (
                <div key={index} class="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onInput$={(e) => updateFeature(index, e.target.value)}
                    class="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={`Özellik ${index + 1}`}
                  />
                  {features.value.length > 1 && (
                    <button
                      type="button"
                      onClick$={() => removeFeature(index)}
                      class="p-2 text-red-600 hover:text-red-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick$={addFeature}
              class="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Özellik Ekle
            </button>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse -mx-6 -mb-6 mt-6">
            <button
              type="submit"
              disabled={loading.value}
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.value ? (
                <>
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </>
              ) : (
                product ? 'Güncelle' : 'Ekle'
              )}
            </button>
            <button
              type="button"
              onClick$={onCancel$}
              disabled={loading.value}
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
