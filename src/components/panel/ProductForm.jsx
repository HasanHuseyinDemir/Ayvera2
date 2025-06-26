import { component$, useSignal, $, useTask$, useVisibleTask$ } from '@builder.io/qwik';

export const ProductForm = component$(({ product = {}, categories = [], brands = [], onSuccess$, onCancel$ }) => {
  
  // Signal'ları direkt product ile başlat - field mapping ile
  const name = useSignal(product?.title || product?.name || '');
  const description = useSignal(product?.desc || product?.description || '');
  const category = useSignal('');
  const brand = useSignal('');
  const image = useSignal(product?.img || product?.image || '');
  const features = useSignal(product?.features && Array.isArray(product.features) ? [...product.features] : ['']);
  const loading = useSignal(false);
  const error = useSignal('');

  // Dosya yükleme için state
  const driverFile = useSignal(null);
  const pdfFile = useSignal(null);

  // Kategori ismine göre ID tahmin etme fonksiyonu (fallback)
  const getFallbackCategoryId = (categoryName) => {
    const categoryMap = {
      'Alarm Sistemleri': '1',
      'Kamera Sistemleri': '2', 
      'Ses Sistemleri': '3',
      'Güvenlik Aparatları': '4',
      'Yangın Sistemleri': '5',
      'Kablo Çeşitleri': '6',
      'Geçiş Sistemleri': '7'
    };
    return categoryMap[categoryName] || null;
  };

  // Marka ismine göre ID tahmin etme fonksiyonu (fallback) - QRL ile sarıldı
  const getFallbackBrandId = $((brandName) => {
    const brandMap = {
      'Cambox': '1',
      'Everday': '2', 
      'Fonri': '3',
      'Idex': '4',
      'Imou': '5',
      'Kodicom': '6',
      'Radem': '7',
      'Rubezh': '8',
      'Teletek': '9',
      'Tiandy': '10',
      'ZKT': '11'
    };
    return brandMap[brandName] || null;
  });

  // Kategori ve marka değerlerini ayarlayan fonksiyon
  const updateCategoryAndBrand = $(async () => {
    // Kategori ayarla
    if (product?.category) {
      let categoryId = null;
      
      // Önce categories dizisinden bul
      if (categories.length > 0) {
        const categoryObj = categories.find(c => c.name === product.category);
        if (categoryObj) {
          categoryId = categoryObj.id.toString();
        }
      }
      
      // Bulunamazsa fallback kullan
      if (!categoryId) {
        categoryId = getFallbackCategoryId(product.category);
        if (categoryId) {
        } else {
          console.warn('⚠️ Kategori hiçbir yerde bulunamadı:', product.category);
        }
      }
      
      // Değeri ayarla
      if (categoryId && category.value !== categoryId) {
        category.value = categoryId;
      }
    }
    
    // Marka ayarla (aynı mantık)
    if (product?.brand) {
      let brandId = null;
      
      // Önce brands dizisinden bul
      if (brands.length > 0) {
        const brandObj = brands.find(b => b.name === product.brand);
        if (brandObj) {
          brandId = brandObj.id.toString();
        }
      }
      
      // Bulunamazsa fallback kullan
      if (!brandId) {
        brandId = await getFallbackBrandId(product.brand);
        if (brandId) {
        } else {
          console.warn('⚠️ Marka hiçbir yerde bulunamadı:', product.brand);
        }
      }
      
      // Değeri ayarla
      if (brandId && brand.value !== brandId) {
        brand.value = brandId;
      }
    }
  });

  // Multiple tracking with immediate execution  
  useVisibleTask$(async ({ track }) => {
    track(() => categories);
    track(() => brands);
    track(() => product);
    
    // Her değişiklikte update fonksiyonunu çağır
    await updateCategoryAndBrand();
  });

  // Component mount'ta da çalıştır (timing garantisi için)
  useVisibleTask$(async () => {
    // Kısa bir gecikme ile çalıştır
    setTimeout(async () => {
      await updateCategoryAndBrand();
    }, 100);
  });
  
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
    loading.value = true;
    error.value = '';

    let driverUrl = '';
    let pdfUrl = '';

    // Driver dosyası yükle
    if (driverFile.value) {
      const formData = new FormData();
      formData.append('file', driverFile.value);
      try {
        const res = await fetch('/api/upload-file', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) driverUrl = data.url;
        else throw new Error(data.error || 'Driver yüklenemedi');
      } catch (err) {
        error.value = 'Driver yüklenemedi: ' + err.message;
        loading.value = false;
        return;
      }
    }
    // PDF dosyası yükle
    if (pdfFile.value) {
      const formData = new FormData();
      formData.append('file', pdfFile.value);
      try {
        const res = await fetch('/api/upload-file', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) pdfUrl = data.url;
        else throw new Error(data.error || 'PDF yüklenemedi');
      } catch (err) {
        error.value = 'PDF yüklenemedi: ' + err.message;
        loading.value = false;
        return;
      }
    }

    // Ürün verisini hazırla
    const productData = {
      title: name.value,
      desc: description.value,
      category: category.value,
      brand: brand.value,
      img: image.value,
      features: features.value,
      driver: driverUrl,
      pdf: pdfUrl
    };

    try {
      loading.value = true;
      error.value = '';

      // Kategori ve marka ID'lerinden isimlerini bul
      const selectedCategory = categories.find(c => c.id.toString() === category.value);
      const selectedBrand = brands.find(b => b.id.toString() === brand.value);

      const response = await fetch(product?.id 
        ? `/api/products/${product.id}`
        : '/api/products', {
        method: product?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Success callback'i çağır (ProductList verileri yeniden yükleyecek)
        await onSuccess$();
        
        // Form submission'ı tamamen durdur
        return false;
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        error.value = errorData.message || 'İşlem sırasında bir hata oluştu';
        console.error('❌ API hatası:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
      }
    } catch (err) {
      error.value = 'Ağ hatası: ' + err.message;
      console.error('❌ Form submission error:', err);
    } finally {
      loading.value = false;
    }
    
    return false; // Sayfa yenilenmesini kesinlikle engelle
  });

  return (
    <div class="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 class="text-xl font-semibold text-white flex items-center">
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {product?.id ? (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            ) : (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
          {product?.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
        </h3>
      </div>

      {/* Content */}
      <div class="p-6">
        {error.value && (
          <div class="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
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

        {/* Debug Panel - Sadece development'te göster */}
        {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
          <div class="mb-6 p-4 bg-gray-100 border border-gray-200 rounded-xl">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">🐛 Debug Bilgileri</h4>
            <div class="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong>Form Değerleri:</strong>
                <ul class="mt-1 space-y-1">
                  <li>Kategori ID: <code class="bg-gray-200 px-1 rounded">{category.value || 'boş'}</code></li>
                  <li>Marka ID: <code class="bg-gray-200 px-1 rounded">{brand.value || 'boş'}</code></li>
                  <li>Ürün Adı: <code class="bg-gray-200 px-1 rounded">{name.value || 'boş'}</code></li>
                </ul>
              </div>
              <div>
                <strong>Product Prop:</strong>
                <ul class="mt-1 space-y-1">
                  <li>ID: <code class="bg-gray-200 px-1 rounded">{product?.id || 'yeni'}</code></li>
                  <li>Kategori: <code class="bg-gray-200 px-1 rounded">{product?.category || 'boş'}</code></li>
                  <li>Marka: <code class="bg-gray-200 px-1 rounded">{product?.brand || 'boş'}</code></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit$={handleSubmit} onSubmitCapture$={$((e) => e.preventDefault())} preventdefault:submit class="space-y-8">
          {/* Kategori ve Marka - Üst Satır */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="product-category" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Kategori * 
                {category.value && (
                  <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    ID: {category.value}
                  </span>
                )}
              </label>
              <select
                id="product-category"
                name="category"
                required
                value={category.value}
                onChange$={(e) => {
                  category.value = e.target.value;
                }}
                class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium"
              >
                <option value="" class="text-gray-500">Kategori seçin...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id.toString()} class="text-gray-800">
                    [{cat.id}] {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div class="space-y-2">
              <label for="product-brand" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Marka *
                {brand.value && (
                  <span class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    ID: {brand.value}
                  </span>
                )}
              </label>
              <select
                id="product-brand"
                name="brand"
                required
                value={brand.value}
                onChange$={(e) => {
                  brand.value = e.target.value;
                }}
                class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium"
              >
                <option value="" class="text-gray-500">Marka seçin...</option>
                {brands.map(brandItem => (
                  <option key={brandItem.id} value={brandItem.id.toString()} class="text-gray-800">
                    [{brandItem.id}] {brandItem.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ürün Adı */}
          <div class="space-y-2">
            <label for="product-name" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Ürün Adı *
            </label>
            <input
              id="product-name"
              name="name"
              type="text"
              required
              value={name.value}
              onInput$={(e) => name.value = e.target.value}
              class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium placeholder-gray-400"
              placeholder="Örn: Profesyonel Güvenlik Kamerası"
            />
          </div>

          {/* Görsel URL ve Önizleme */}
          <div class="space-y-3">
            <label for="product-image" class="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ürün Görseli
            </label>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* URL Input */}
              <div class="lg:col-span-2">
                <input
                  id="product-image"
                  name="image"
                  type="text"
                  value={image.value}
                  onInput$={(e) => image.value = e.target.value}
                  class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium placeholder-gray-400"
                  placeholder="/images/product.jpg veya http://example.com/image.jpg"
                />
                <p class="mt-2 text-xs text-gray-500 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Görsel URL'sini girin. Resim otomatik olarak önizlenecektir.
                </p>
              </div>
              
              {/* Image Preview */}
              <div class="lg:col-span-1">
                <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 h-32 flex items-center justify-center">
                  {image.value ? (
                    <img 
                      src={image.value} 
                      alt="Ürün önizlemesi" 
                      class="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                      onError$={(e) => {
                        // Resim yüklenemezse placeholder göster
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                      onLoad$={(e) => {
                        // Resim yüklenirse error mesajını gizle
                        e.target.style.display = 'block';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'none';
                        }
                      }}
                    />
                  ) : null}
                  <div class={`flex flex-col items-center text-gray-400 text-center ${image.value ? 'hidden' : 'flex'}`}>
                    <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs">Önizleme</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Açıklama */}
          <div class="space-y-2">
            <label for="product-description" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ürün Açıklaması
            </label>
            <textarea
              id="product-description"
              name="description"
              rows={4}
              value={description.value}
              onInput$={(e) => description.value = e.target.value}
              class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium placeholder-gray-400 resize-none"
              placeholder="Ürünün detaylı açıklamasını yazın..."
            />
          </div>

          {/* Özellikler */}
          <div class="space-y-4">
            <label class="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Ürün Özellikleri
            </label>
            
            <div class="bg-gray-50 rounded-xl p-4 space-y-3">
              {features.value.map((feature, index) => (
                <div key={index} class="flex items-center space-x-3 group">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={feature}
                    onInput$={(e) => updateFeature(index, e.target.value)}
                    class="flex-1 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    placeholder={`Özellik ${index + 1} (örn: Yüksek çözünürlük)`}
                  />
                  {features.value.length > 1 && (
                    <button
                      type="button"
                      onClick$={() => removeFeature(index)}
                      class="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-70"
                      title="Özelliği sil"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick$={addFeature}
                class="w-full mt-4 inline-flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Yeni Özellik Ekle
              </button>
            </div>
          </div>

          {/* Dosya Yükleme Alanı - Modern */}
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver Dosyası (exe, zip, rar)</label>
            <div class="flex items-center gap-2">
              <input
                type="file"
                accept=".exe,.zip,.rar,.7z,.tar,.gz,.msi"
                id="driver-upload"
                onChange$={e => driverFile.value = e.target.files[0]}
                class="hidden"
              />
              <label for="driver-upload" class="inline-flex items-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 text-blue-700 font-medium text-xs gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                {driverFile.value ? driverFile.value.name : 'Driver Seç'}
              </label>
              {driverFile.value && (
                <span class="text-xs text-gray-500">{driverFile.value.name}</span>
              )}
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">PDF Dosyası</label>
            <div class="flex items-center gap-2">
              <input
                type="file"
                accept=".pdf"
                id="pdf-upload"
                onChange$={e => pdfFile.value = e.target.files[0]}
                class="hidden"
              />
              <label for="pdf-upload" class="inline-flex items-center px-3 py-2 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 text-red-700 font-medium text-xs gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                {pdfFile.value ? pdfFile.value.name : 'PDF Seç'}
              </label>
              {pdfFile.value && (
                <span class="text-xs text-gray-500">{pdfFile.value.name}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading.value}
              class="flex-1 inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading.value ? (
                <>
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </>
              ) : (
                <>
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {product?.id ? (
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    ) : (
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    )}
                  </svg>
                  {product?.id ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick$={onCancel$}
              disabled={loading.value}
              class="flex-1 inline-flex justify-center items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
