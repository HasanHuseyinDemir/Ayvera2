import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';
import { AVideo } from '~/components/avideo/avideo';
import { Bottom } from '~/components/bottom/bottom';
import { Navbar } from '~/components/navbar/navbar';

const NAVBAR_HEIGHT = 64; // px, navbar yüksekliği (ör: h-16)

export default component$(() => {
  useVisibleTask$(() => {
    const scrollToHash = () => {
      if (window.location.hash === '#content') {
        const el = document.getElementById('content');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('hashchange', scrollToHash);
    // İlk yüklemede de çalışsın
    scrollToHash();
    return () => window.removeEventListener('hashchange', scrollToHash);
  });
  return (
    <>
      <Navbar />
      <AVideo />
      {/* Sticky boşluk ve #content anchor */}
      <div id="content" style={{ position: 'relative', top: `-${NAVBAR_HEIGHT}px` }}></div>
      <Slot />
      <div class="bg-gray-300 p-1"/>
      <div class="bg-cyan-900 p-1"/>
      <Bottom />
    </>
  );
});

export const head={
  title:"Ayvera Güvenlik Hizmetleri"
}