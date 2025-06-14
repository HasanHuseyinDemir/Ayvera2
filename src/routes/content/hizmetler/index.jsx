import { component$ } from '@builder.io/qwik';
import FeatureGrid from '~/components/FeatureGrid';
import TestimonialCarousel from '~/components/TestimonialCarousel';
import FaqAccordion from '~/components/FaqAccordion';
import CallToActionBanner from '~/components/CallToActionBanner';

const hizmetFeatures = [
  { title: 'Alarm Sistemleri', desc: 'Ev ve iş yerleri için akıllı alarm çözümleri.' },
  { title: 'Kamera Sistemleri', desc: 'Yüksek çözünürlüklü, uzaktan izlenebilir kamera sistemleri.' },
  { title: 'Yangın Sistemleri', desc: 'Erken uyarı ve otomatik müdahale sağlayan yangın sistemleri.' },
  { title: 'Geçiş Kontrol', desc: 'Kartlı, şifreli ve biyometrik geçiş sistemleri.' },
];

const hizmetTestimonials = [
  { text: 'Alarm sistemi sayesinde evimiz artık çok daha güvenli.', author: 'N. Şahin' },
  { text: 'Kamera sistemleri çok kaliteli ve kullanışlı.', author: 'F. Güler' },
];

const hizmetFaqs = [
  { question: 'Hangi hizmetleri sunuyorsunuz?', answer: 'Alarm, kamera, yangın, geçiş sistemleri ve daha fazlası.' },
  { question: 'Kurulum süresi ne kadar?', answer: 'Çoğu kurulum 1-2 gün içinde tamamlanır.' },
];

export default component$(() => (
  <div class="space-y-10">
    <FeatureGrid features={hizmetFeatures} />
    <TestimonialCarousel testimonials={hizmetTestimonials} />
    <FaqAccordion faqs={hizmetFaqs} />
    <CallToActionBanner title="Hizmetlerimizle Tanışın" desc="Size en uygun güvenlik çözümü için hemen iletişime geçin." buttonText="Teklif Al" buttonHref="/content/iletisim#content" />
  </div>
));

export const head = {
  title: 'Hizmetler | Ayvera Güvenlik',
  meta: [
    { name: 'description', content: 'Ayvera Güvenlik hizmetleri: alarm, kamera, yangın, geçiş sistemleri ve daha fazlası.' },
    { name: 'keywords', content: 'hizmetler, alarm, kamera, yangın, geçiş sistemleri, ayvera' }
  ]
};
