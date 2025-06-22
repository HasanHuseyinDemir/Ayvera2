import { component$, useStore, $, useSignal } from '@builder.io/qwik';

export const BrandForm = component$(({ brand, onSave$, onCancel$ }) => {
  const formData = useStore({
    name: brand?.name || '',
    logo: brand?.logo || '',
    description: brand?.description || ''
  });
  
  const loading = useSignal(false);
  const error = useSignal('');

  const handleSubmit = $(async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      error.value = 'Marka adı gerekli';
      return;
    }

    try {
      loading.value = true;
      error.value = '';

      const brandData = {
        ...formData,
        id: brand?.id || Date.now()
      };

      const url = brand?.id ? `/api/brands/${brand.id}` : '/api/brands';
      const method = brand?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData)
      });

      if (response.ok) {
        await onSave$(brandData);
      } else {
        error.value = 'Marka kaydedilirken hata oluştu';
      }
    } catch (err) {
      error.value = 'Marka kaydedilirken hata oluştu';
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">
            {brand?.id ? 'Marka Düzenle' : 'Yeni Marka Ekle'}
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Marka Adı *</label>
            <input
              type="text"
              bind:value={formData.name}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Marka adını girin"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="text"
              bind:value={formData.logo}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/brands/logo.png"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              bind:value={formData.description}
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Marka açıklaması"
            />
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
