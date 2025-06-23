import { component$, useSignal } from '@builder.io/qwik';
import SidebarProductList from '~/components/SidebarProductList';
import ProductCard from '~/components/ProductCard';
import { Link } from '@builder.io/qwik-city';

const categories = [
  { name: 'Alarm Sistemleri' },
  { name: 'Kamera Sistemleri' },
  { name: 'Yangın Sistemleri' },
  { name: 'Geçiş Sistemleri' },
  { name: 'Ses Sistemleri' },
  { name: 'Aksesuarlar' },
];

const products = [
  {
    id: 'alarm',
    img: '/stock/evguvenlik.png',
    title: 'Kablosuz Alarm Seti',
    desc: 'Ev ve ofisler için kolay kurulumlu, uzaktan yönetilebilen kablosuz alarm seti.',
    category: 'Alarm Sistemleri',
  },
  {
    id: 'kamera',
    img: '/stock/cam.png',
    title: 'IP Kamera',
    desc: 'Yüksek çözünürlüklü, gece görüşlü, mobil uygulama destekli IP kamera.',
    category: 'Kamera Sistemleri',
  },
  {
    id: 'yangin',
    img: '/stock/yangin.png',
    title: 'Yangın İhbar Paneli',
    desc: 'Akıllı yangın algılama ve erken uyarı sistemi.',
    category: 'Yangın Sistemleri',
  },
  {
    id: 'gecis',
    img: '/stock/gecis.png',
    title: 'Kartlı Geçiş Ünitesi',
    desc: 'Ofis ve bina girişleri için güvenli kartlı geçiş sistemi.',
    category: 'Geçiş Sistemleri',
  },
];

export default component$(() => {
  const selectedCategory = useSignal<string | null>(null);
  const searchTerm = useSignal('');

  const filteredProducts = products.filter((p) => {
    const matchesCategory = !selectedCategory.value || p.category === selectedCategory.value;
    const matchesSearch =
      !searchTerm.value ||
      p.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchTerm.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="hidden lg:block flex-shrink-0">
        <SidebarProductList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory$={(cat) => (selectedCategory.value = cat)}
          searchTerm={searchTerm}
        />
      </div>
      <div class="flex-1">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <Link href={`/content/cozumler/${p.id}/`} key={p.id} class="block">
              <ProductCard {...p} />
            </Link>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div class="text-center text-gray-500 py-10">Ürün bulunamadı.</div>
        )}
      </div>
    </div>
  );
});
