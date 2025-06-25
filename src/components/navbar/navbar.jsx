import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { BsTelephoneFill } from "@qwikest/icons/bootstrap";
import { Navigator } from './navigator';

export const Navbar = component$(() => {
  const isScrolled = useSignal(false);
  const isMenuOpen = useSignal(false);

  useVisibleTask$(() => {
    const onScroll = () => {
      isScrolled.value = window.scrollY > 200;
    };
    
    window.addEventListener('scroll', onScroll);
    onScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  });

  return (
    <nav
      class={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 backdrop-blur ${
        isScrolled.value ? 'bg-blue-950/90' :"bg-blue-950/30 "
      }  `}
    >
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between text-white">
        {/* Logo */}
        <Link href="#content">
          <img src="/ayvera.png" class="h-9" alt="Logo" />
        </Link>

        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          class="lg:hidden flex flex-col gap-1"
          onClick$={() => (isMenuOpen.value = !isMenuOpen.value)}
        >
          <span class="w-6 h-0.5 bg-white" />
          <span class="w-6 h-0.5 bg-white" />
          <span class="w-6 h-0.5 bg-white" />
        </button>

        {/* Menü (Masaüstü ve Açık Mobil) */}
        <div
          onClick$={()=>{
            isMenuOpen.value=!isMenuOpen.value
          }}
          class={`${
            isMenuOpen.value ? 'flex' : 'hidden'
          } backdrop-blur ${
            (isScrolled.value && isMenuOpen.value) ? 'bg-blue-900/90' : 'bg-blue-900/20'
          } absolute lg:static top-16 left-0 w-full lg:w-auto bg-black lg:bg-transparent flex-col lg:flex-row items-center gap-4 p-4 lg:p-0 lg:flex`}
        >
          <Navigator url="/content/kurumsal/#content" name="Kurumsal" />
          <Navigator url="/content/cozumler/#content" name="Çözümler" />
          <Navigator url="/content/hakkimizda/#content" name="Hakkımızda" />
          <Navigator url="/content/iletisim/#content" name="İLETİŞİM" />
          
          <div class="flex gap-3 mt-3 lg:mt-0">
            <Link href="tel:0850 441 60 10">
            <button class="bg-white text-black cursor-pointer px-3 py-1 rounded w-full inline-flex items-center space-between gap-2">
              <BsTelephoneFill/>
              <span>Bizi Arayın</span>
            </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
});
