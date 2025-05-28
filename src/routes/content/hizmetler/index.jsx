import { component$ } from '@builder.io/qwik';
import { Content } from '~/components/content';

export default component$(() => (
  <Content title="Hizmetlerimiz">
    <p class="mb-4">Ayvera olarak sunduğumuz güvenlik çözümleriyle ilgili detaylı bilgiye buradan ulaşabilirsiniz.</p>
    {/* Hizmet kartları veya detaylar buraya eklenebilir */}
  </Content>
));

export const head = {
  title: 'Hizmetler | Ayvera Güvenlik',
  meta: [
    { name: 'description', content: 'Ayvera Güvenlik hizmetleri: alarm, kamera, yangın, geçiş sistemleri ve daha fazlası.' },
    { name: 'keywords', content: 'hizmetler, alarm, kamera, yangın, geçiş sistemleri, ayvera' }
  ]
};
