import { component$ } from '@builder.io/qwik';
import { Content } from '~/components/content';

export const head = {
  title: 'Projeler | Ayvera Güvenlik',
  meta: [
    { name: 'description', content: 'Ayvera Güvenlik tarafından gerçekleştirilen projeler ve referanslar.' },
    { name: 'keywords', content: 'projeler, referanslar, güvenlik projeleri, ayvera' }
  ]
};

export default component$(() => (
  <Content title="Projelerimiz">
    <p class="mb-4">Gerçekleştirdiğimiz projeler ve referanslarımız hakkında bilgi almak için bu sayfayı inceleyebilirsiniz.</p>
    {/* Proje listesi veya referanslar buraya eklenebilir */}
  </Content>
));
