import { component$, Slot, useVisibleTask$, useStore, useTask$, useSignal } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { AVideo } from '~/components/avideo/avideo';
import { Bottom } from '~/components/bottom/bottom';
import { Navbar } from '~/components/navbar/navbar';
import { PageLoader } from '~/components/PageLoader';

const NAVBAR_HEIGHT = 64; // px, navbar yüksekliği (ör: h-16)

export default component$(() => {
  const location = useLocation();
  const categories = useStore({ list: [] });
  const isNavigating = useSignal(false);
  const previousPath = useSignal('');
  
  // Navigation loading kontrolü
  useTask$(({ track }) => {
    track(() => location.url.pathname);
    
    const currentPath = location.url.pathname;
    
    // İlk yüklemede loading gösterme
    if (previousPath.value === '') {
      previousPath.value = currentPath;
      return;
    }
    
    // Path değişti, yeni sayfa yükleniyor
    if (previousPath.value !== currentPath) {
      console.log('🔄 Sayfa geçişi başladı:', previousPath.value, '->', currentPath);
      isNavigating.value = true;
      
      // Kısa bir süre sonra loading'i kapat (sayfa render olduktan sonra)
      setTimeout(() => {
        isNavigating.value = false;
        console.log('✅ Sayfa geçişi tamamlandı');
      }, 500);
      
      previousPath.value = currentPath;
    }
  });
  
  // Kategorileri yükle
  useTask$(async () => {
    try {
      if (typeof window === 'undefined') {
        // Server-side
        const { readCategories } = await import('~/services/db.js');
        const data = await readCategories();
        categories.list = data;
        console.log('✅ Layout SSR: Kategoriler yüklendi:', data.length);
      }
    } catch (error) {
      console.error('❌ Layout: Kategori yükleme hatası:', error);
    }
  });
  
  // Client-side kategori yükleme
  useVisibleTask$(async () => {
    if (categories.list.length === 0) {
      try {
        console.log('🔄 Layout Client: Kategoriler yükleniyor...');
        const { readCategories } = await import('~/services/db.js');
        const data = await readCategories();
        categories.list = data;
        console.log('✅ Layout Client: Kategoriler yüklendi:', data.length);
      } catch (error) {
        console.error('❌ Layout Client: Kategori yükleme hatası:', error);
      }
    }
  });
  
  useVisibleTask$(() => {
    // Sadece çözümler sayfasında hash scroll çalışsın
    const isCozumlerPage = location.url.pathname.startsWith('/content/cozumler');
    
    if (!isCozumlerPage) {
      console.log('Çözümler sayfası değil, hash scroll devre dışı');
      return;
    }
    
    const scrollToHash = () => {
      if (window.location.hash === '#content') {
        const el = document.getElementById('content');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
          window.scrollTo({ top: y, behavior: 'smooth' });
          console.log('Hash scroll yapıldı: #content');
        }
      }
    };
    
    window.addEventListener('hashchange', scrollToHash);
    // İlk yüklemede de çalışsın
    setTimeout(scrollToHash, 100); // Biraz bekle ki sayfa render olsun
    
    return () => window.removeEventListener('hashchange', scrollToHash);
  });
  return (
    <>
      {/* Page loading overlay */}
      {isNavigating.value && <PageLoader />}
      
      <Navbar categories={categories} />
      <AVideo />
      {/* Sticky boşluk ve #content anchor */}
      <div id="content" style={{ position: 'relative', top: `-${NAVBAR_HEIGHT}px` }}></div>
      <Slot />
      <div class="bg-gray-300 p-1"/>
      <div class="bg-blue-900 p-1"/>
      <Bottom />
    </>
  );
});

export const head={
  title:"Ayvera Güvenlik Hizmetleri"
}