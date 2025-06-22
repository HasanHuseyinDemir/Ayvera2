import { component$ } from '@builder.io/qwik';
import { PanelLayout } from '~/components/panel/PanelLayout';
import { ContactList } from '~/components/panel/ContactList';

export const head = {
  title: 'İletişim Mesajları | Ayvera Panel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
};

export default component$(() => {
  return (
    <PanelLayout>
      <ContactList />
    </PanelLayout>
  );
});
