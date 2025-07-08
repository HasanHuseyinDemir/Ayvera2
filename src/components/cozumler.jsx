import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { CardContainer } from './cardContainer';
import CardBlock from './cardblock';

const categories = [
  "Alarm Sistemleri",
  "Kamera Sistemleri",
  "Ses Sistemleri",
  "Güvenlik Aparatları",
  "Yangın Sistemleri",
  "Kablo Çeşitleri",
  "Geçiş Sistemleri"
];

export const Cozumler = component$(() => {
  const products = useSignal([]);
  const loading = useSignal(true);
  const error = useSignal('');

  useVisibleTask$(async () => {
    try {
      const res = await fetch('http://localhost:3001/api/products');
      if (!res.ok) throw new Error('API hatası');
      const data = await res.json();
      products.value = data;
    } catch (err) {
      error.value = 'Ürünler yüklenemedi';
    } finally {
      loading.value = false;
    }
  });

  if (loading.value) return <div class="text-center py-8">Ürünler yükleniyor...</div>;
  if (error.value) return <div class="text-center text-red-600 py-8">{error.value}</div>;

  return (
    <CardContainer>
      {categories.map(category => (
        <div key={category}>
          <h2 class="text-xl font-bold mb-2 text-blue-900">{category}</h2>
          <div class="flex flex-wrap gap-4">
            {products.value.filter(p => p.category === category).length === 0 ? (
              <div class="text-gray-400 italic">Bu kategoride ürün yok</div>
            ) : (
              products.value.filter(p => p.category === category).map(product => (
                <CardBlock key={product.id} title={product.title} bgImage={product.img}>
                  {product.desc}
                </CardBlock>
              ))
            )}
          </div>
        </div>
      ))}
    </CardContainer>
  );
});