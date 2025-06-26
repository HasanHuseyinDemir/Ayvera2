import { component$, useSignal, useStore, $, useTask$ } from '@builder.io/qwik';
import { useRef } from 'qwik/jsx-runtime';

function getInitialFeatures(product) {
  return product?.features && Array.isArray(product.features) && product.features.length > 0
    ? [...product.features]
    : [''];
}

export const SimpleProductForm = component$(({ product = null, categories = [], brands = [], onSuccess$, onCancel$ }) => {
  
  console.log('🚀 SimpleProductForm başlatılıyor', {
    product: product,
    isEdit: !!product?.id,
    categoriesLength: categories.length,
    brandsLength: brands.length
  });
  
  // Form değerleri - basit ve sadece veritabanı alanları
  const title = useSignal(product?.title || '');
  const desc = useSignal(product?.desc || '');
  const category = useSignal(product?.category || '');
  const brand = useSignal(product?.brand || '');
  const img = useSignal(product?.img || '');
  const featuresStore = useStore({ list: product?.features && Array.isArray(product.features) ? [...product.features] : [''] });
  // Refs array for uncontrolled inputs
  const featureRefs = useStore({ arr: [] });
  const tempCount = useSignal(featuresStore.list.length);
  const loading = useSignal(false);
  const error = useSignal('');

  // PDF ve driver için state
  const pdf = useSignal(product?.pdf || '');
  const driver = useSignal(product?.driver || '');

  // Galeri için state
  const gallery = useStore({ list: Array.isArray(product?.gallery) ? [...product.gallery] : [''] });
  const galleryRefs = useStore({ arr: [] });
  const galleryCount = useSignal(gallery.list.length || 1);

  // Modal her açıldığında input sayısını güncelle
  useTask$(({ track }) => {
    track(() => product);
    const initial = product?.features && Array.isArray(product.features) && product.features.length > 0
      ? [...product.features]
      : [''];
    featuresStore.list = initial;
    tempCount.value = initial.length;
    featureRefs.arr = [];
  });

  const handleSubmit = $(async () => {
    if (!title.value.trim() || !desc.value.trim()) {
      error.value = 'Başlık ve açıklama gereklidir';
      return;
    }
    try {
      loading.value = true;
      error.value = '';
      // DOM'dan değerleri topla
      const features = featureRefs.arr.map(ref => ref?.value || '').filter(f => f.trim() !== '');
      featuresStore.list = features;
      const galleryImages = galleryRefs.arr.map(ref => ref?.value || '').filter(url => url.trim() !== '');
      const productData = {
        title: title.value.trim(),
        desc: desc.value.trim(),
        category: category.value,
        brand: brand.value,
        img: img.value.trim() || '/stock/camera.png',
        features: featuresStore.list,
        pdf: pdf.value.trim(),
        driver: driver.value.trim(),
        gallery: galleryImages
      };
      const url = product?.id 
        ? `/api/products/${product.id}`
        : '/api/products';
      const method = product?.id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        const result = await response.json();
        await onSuccess$();
      } else {
        const errorData = await response.json();
        error.value = errorData.message || 'İşlem sırasında bir hata oluştu';
      }
    } catch (err) {
      error.value = 'Ağ hatası: ' + err.message;
    } finally {
      loading.value = false;
    }
  });

  // Özellik ekle/sil fonksiyonları sadece input sayısını değiştirir
  const addFeature = $(() => {
    tempCount.value++;
  });

  const removeFeature = $((index) => {
    if (tempCount.value > 1) {
      tempCount.value--;
      featureRefs.arr.splice(index, 1);
    }
  });

  return (
    <div class="space-y-6">
      {error.value && (
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error.value}
        </div>
      )}

      <form
        key={product?.id + '_' + tempCount.value}
        onSubmit$={handleSubmit}
        class="space-y-4"
      >
        {/* Başlık */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ürün Başlığı *
          </label>
          <input
            type="text"
            value={title.value}
            onInput$={(e) => title.value = e.target.value}
            placeholder="Ürün başlığını girin"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Açıklama */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Açıklama *
          </label>
          <textarea
            value={desc.value}
            onInput$={(e) => desc.value = e.target.value}
            placeholder="Ürün açıklamasını girin"
            rows={3}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Kategori */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <input
            type="text"
            value={category.value}
            onInput$={(e) => category.value = e.target.value}
            placeholder="Kategori ismi girin"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Marka */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Marka
          </label>
          <select
            value={brand.value}
            onChange$={(e) => brand.value = e.target.value}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Marka Seçin</option>
            {brands.map((br) => (
              <option key={br.id} value={br.name}>
                {br.name}
              </option>
            ))}
          </select>
        </div>

        {/* Resim URL */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Resim URL (opsiyonel)
          </label>
          <input
            type="text"
            value={img.value}
            onInput$={(e) => img.value = e.target.value}
            placeholder="/stock/camera.png"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Özellikler */}
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Özellikler
            </label>
            <button
              type="button"
              onClick$={addFeature}
              class="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
            >
              + Özellik Ekle
            </button>
          </div>
          <div class="space-y-2">
            {Array.from({ length: tempCount.value }).map((_, index) => (
              <div key={index} class="flex gap-2">
                <input
                  type="text"
                  ref={el => featureRefs.arr[index] = el}
                  defaultValue={featuresStore.list[index] || ''}
                  placeholder="Özellik girin"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick$={() => removeFeature(index)}
                  class="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick$={addFeature}
            class="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Özellik Ekle
          </button>
        </div>

        {/* PDF ve Driver Linki */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">PDF Linki</label>
            <input
              type="url"
              value={pdf.value}
              onInput$={e => pdf.value = e.target.value}
              placeholder="https://site.com/pdf/urun.pdf"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Driver Linki</label>
            <input
              type="url"
              value={driver.value}
              onInput$={e => driver.value = e.target.value}
              placeholder="https://site.com/drivers/urun.zip"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Galeri Görselleri */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Galeri Görselleri (URL)</label>
          <div class="space-y-2">
            {Array.from({ length: galleryCount.value }).map((_, idx) => (
              <div key={idx} class="flex gap-2">
                <input
                  type="url"
                  ref={el => galleryRefs.arr[idx] = el}
                  defaultValue={gallery.list[idx] || ''}
                  placeholder="https://site.com/img1.jpg"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick$={() => { if (galleryCount.value > 1) galleryCount.value--; galleryRefs.arr.splice(idx, 1); }}
                  class="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                >Sil</button>
              </div>
            ))}
            <button
              type="button"
              onClick$={() => galleryCount.value++}
              class="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >+ Görsel Ekle</button>
          </div>
        </div>

        {/* Butonlar */}
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            onClick$={handleSubmit}
            disabled={loading.value}
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading.value ? 'Kaydediliyor...' : (product?.id ? 'Güncelle' : 'Ekle')}
          </button>
          
          <button
            type="button"
            onClick$={onCancel$}
            disabled={loading.value}
            class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
});
