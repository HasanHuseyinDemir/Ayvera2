import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Content } from '~/components/content';

export default component$((props) => {
  const products = useSignal([]);
  const loading = useSignal(true);
  const error = useSignal(null);
  
  const selectedCategory = props.selectedCategory;
  const searchTerm = props.searchTerm;

  useTask$(async () => {
    try {
      console.log('Fetching products...');
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('API hatası');
      const data = await response.json();
      console.log('Products loaded:', data);
      products.value = data;
      loading.value = false;
    } catch (err) {
      console.error('Error loading products:', err);
      error.value = err.message;
      loading.value = false;
    }
  });

  return (
    <Content title="ÇÖZÜMLERİMİZ">
      <div class="space-y-8">
        {/* Başlık ve Açıklama */}
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Güvenlik Çözümlerimiz</h1>
          <p class="text-lg text-gray-600 leading-relaxed">
            Modern teknoloji ile donatılmış güvenlik sistemleri ile ev, ofis ve işletmenizi koruyun. 
            Uzman ekibimiz tarafından özenle seçilmiş ürünlerle tam güvenlik çözümleri sunuyoruz.
          </p>
        </div>

        {loading.value && (
          <div class="text-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Ürünler yükleniyor...</p>
          </div>
        )}

        {error.value && (
          <div class="text-center py-16">
            <div class="max-w-md mx-auto">
              <h3 class="text-xl font-semibold text-red-700 mb-2">Hata Oluştu</h3>
              <p class="text-red-600 mb-6">{error.value}</p>
              <button 
                onClick$={() => window.location.reload()}
                class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Yeniden Dene
              </button>
            </div>
          </div>
        )}

        {!loading.value && !error.value && (
          <div>
            <h2 class="text-2xl font-semibold mb-4">Toplam Ürün: {products.value.length}</h2>
            
            {products.value.length === 0 ? (
              <div class="text-center py-16">
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Ürün Bulunamadı</h3>
                <p class="text-gray-500">Henüz ürün eklenmemiş.</p>
              </div>
            ) : (
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.value.map((product) => (
                  <div key={product.id} class="bg-white rounded-lg shadow-md p-6 border">
                    <img 
                      src={product.img || '/stock/default.png'} 
                      alt={product.title}
                      class="w-full h-48 object-contain mb-4"
                    />
                    <h3 class="font-semibold text-lg mb-2">{product.title}</h3>
                    <p class="text-gray-600 text-sm mb-2">{product.desc}</p>
                    <div class="flex justify-between items-center">
                      <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <span class="text-sm text-gray-500">{product.brand}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Content>
  );
});
