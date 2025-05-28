import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export const AVideo = component$(() => {
    const loc = useLocation();



    const videoSrc = `${loc.url.origin}/yangin.mp4`;
  return (
    <section
      class="relative h-[95vh] flex items-center justify-center overflow-hidden"
    >
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto" 
        class="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
      >
        <source src={videoSrc} type="video/webm" />
      </video>

      {/* Koyu Overlay */}
      <div class="absolute z-[-1]"></div>

      {/* İçerik */}
      <div class="relative z-10  text-white text-center text-shadow-lg select-none px-4">
        <h1 class="text-3xl md:text-5xl font-bold">Ayvera Güvenlik Çözümleri</h1>
        <p class="text-lg md:text-xl mt-2 md:mt-4">Güvenliğiniz için buradayız.</p>
        <p class="text-shadow-xl text-xl text-shadow-black">Yangın Sistemleri</p>
      </div>
    </section>
  );
});
