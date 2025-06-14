import { component$ } from '@builder.io/qwik';
import SidebarProductList from '~/components/SidebarProductList';
import ProductCard from '~/components/ProductCard';
import AnimatedSlider from '~/components/AnimatedSlider';
import FeatureGrid from '~/components/FeatureGrid';
import TestimonialCarousel from '~/components/TestimonialCarousel';
import FaqAccordion from '~/components/FaqAccordion';
import CallToActionBanner from '~/components/CallToActionBanner';
import StatsBar from '~/components/StatsBar';
import BrandLogoCloud from '~/components/BrandLogoCloud';
import StepperProcess from '~/components/StepperProcess';

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
    img: '/stock/evguvenlik.png',
    title: 'Kablosuz Alarm Seti',
    desc: 'Ev ve ofisler için kolay kurulumlu, uzaktan yönetilebilen kablosuz alarm seti.',
    buttonText: 'Detaylı Bilgi',
  },
  {
    img: '/stock/cam.png',
    title: 'IP Kamera',
    desc: 'Yüksek çözünürlüklü, gece görüşlü, mobil uygulama destekli IP kamera.',
    buttonText: 'Detaylı Bilgi',
  },
  {
    img: '/stock/yangin.png',
    title: 'Yangın İhbar Paneli',
    desc: 'Akıllı yangın algılama ve erken uyarı sistemi.',
    buttonText: 'Detaylı Bilgi',
  },
  {
    img: '/stock/gecis.png',
    title: 'Kartlı Geçiş Ünitesi',
    desc: 'Ofis ve bina girişleri için güvenli kartlı geçiş sistemi.',
    buttonText: 'Detaylı Bilgi',
  },
];

const sliderItems = [
  { title: 'Alarm Sistemleri', img: '/stock/evguvenlik.png' },
  { title: 'Kamera Sistemleri', img: '/stock/cam.png' },
  { title: 'Yangın Sistemleri', img: '/stock/yangin.png' },
  { title: 'Geçiş Sistemleri', img: '/stock/gecis.png' },
];

const features = [
  { title: 'Uzaktan İzleme', desc: 'Tüm sistemler mobil uygulama ile uzaktan izlenebilir.', icon: undefined },
  { title: 'Kolay Kurulum', desc: 'Hızlı ve pratik montaj, minimum kablolama.', icon: undefined },
  { title: '7/24 Destek', desc: 'Her an ulaşabileceğiniz teknik destek ekibi.', icon: undefined },
];

const testimonials = [
  { text: 'Ayvera ile çalışmak büyük bir güven verdi. Kurulumdan sonra da her zaman destek aldık.', author: 'M. Yılmaz' },
  { text: 'Kamera sistemleri çok kaliteli ve uygulama çok pratik.', author: 'A. Demir' },
  { text: 'Yangın alarmı sayesinde iş yerimizde riskleri minimuma indirdik.', author: 'S. Kaya' },
];

const faqs = [
  { question: 'Ürünlerinizin garantisi var mı?', answer: 'Tüm ürünlerimiz 2 yıl garantilidir.' },
  { question: 'Kurulum hizmeti veriyor musunuz?', answer: 'Evet, Türkiye genelinde kurulum hizmetimiz mevcuttur.' },
  { question: 'Teklif almak için ne yapmalıyım?', answer: 'İletişim formunu doldurabilir veya bizi arayabilirsiniz.' },
];

const stats = [
  { value: '500+', label: 'Başarılı Proje', icon: undefined },
  { value: '%100', label: 'Müşteri Memnuniyeti', icon: undefined },
  { value: '7/24', label: 'Teknik Destek', icon: undefined },
];

const logos = [
  { src: '/brands/brand1.png', alt: 'Marka 1' },
  { src: '/brands/brand2.png', alt: 'Marka 2' },
  { src: '/brands/brand3.png', alt: 'Marka 3' },
  { src: '/brands/brand4.png', alt: 'Marka 4' },
];

const steps = [
  { title: 'Keşif ve Analiz' },
  { title: 'Projelendirme' },
  { title: 'Kurulum' },
  { title: 'Eğitim ve Teslim' },
  { title: 'Destek' },
];

export default component$(() => {
  return (
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="hidden lg:block flex-shrink-0">
        <SidebarProductList categories={categories} />
      </div>
      <div class="flex-1 space-y-10">
        <AnimatedSlider slides={sliderItems} />
        <FeatureGrid features={features} />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.title} {...p} />
          ))}
        </div>
        <FaqAccordion faqs={faqs} />
        <BrandLogoCloud logos={logos} />
        <CallToActionBanner title="Hemen Teklif Alın" desc="İhtiyacınıza en uygun güvenlik çözümü için bizimle iletişime geçin." buttonText="Teklif Al" buttonHref="/content/iletisim#content" />
      </div>
    </div>
  );
});