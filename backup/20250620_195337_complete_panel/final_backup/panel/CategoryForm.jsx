import { component$, useSignal, $ } from '@builder.io/qwik';

export const CategoryForm = component$(({ category, onSuccess$, onCancel$ }) => {
  const name = useSignal(category?.name || '');
  const description = useSignal(category?.description || '');
  const loading = useSignal(false);
  const error = useSignal('');

  const handleSubmit = $(async (e) => {
    e.preventDefault();
    
    if (!name.value.trim()) {
      error.value = 'Kategori adı gereklidir';
      return;
    }

    try {
      loading.value = true;
      error.value = '';

      const categoryData = {
        name: name.value.trim(),
        description: description.value.trim()
      };

      const url = category 
        ? `/api/categories/${category.id}`
        : '/api/categories';
      
      const method = category ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
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
          {category ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
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
          <div>
            <label for="category-name" class="block text-sm font-medium text-gray-700">
              Kategori Adı *
            </label>
            <div class="mt-1">
              <input
                id="category-name"
                name="name"
                type="text"
                required
                value={name.value}
                onInput$={(e) => name.value = e.target.value}
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Kategori adını girin"
              />
            </div>
          </div>

          <div>
            <label for="category-description" class="block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <div class="mt-1">
              <textarea
                id="category-description"
                name="description"
                rows={3}
                value={description.value}
                onInput$={(e) => description.value = e.target.value}
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Kategori açıklaması (isteğe bağlı)"
              />
            </div>
            <p class="mt-2 text-sm text-gray-500">
              Kategori hakkında kısa bir açıklama yazın.
            </p>
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
                category ? 'Güncelle' : 'Ekle'
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
