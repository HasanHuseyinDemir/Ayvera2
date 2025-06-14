import { component$, useSignal, useTask$, $, useStyles$ } from '@builder.io/qwik';


const videos = [
  { name: "YANGIN GÜVENLİK SİSTEMLERİ", src: "/video/yangin.mp4" }, // Videolarınızı public/videos/ altına koyduğunuzu varsayıyorum
  { name: "KAMERA GÜVENLİK SİSTEMLERİ", src: "/video/compress/ayvera.mp4" },
  { name: "KAMERA GÜVENLİK SİSTEMLERİ", src: "/video/compress/ayvera22.mp4" },
  { name: "CCTV", src: "/video/compress/cctv.mp4" },
  { name: 1, src: "/video/compress/bg1.mp4" },
];

export const typewriterStyles = `
  .typewriter-cursor {
    display: inline-block;
    animation: blink 1s step-end infinite;
  }
  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }
`;

export const AVideo = component$(() => {
  useStyles$(typewriterStyles); // Stilleri component'e dahil et

  const currentIndex = useSignal(0); // Mevcut videonun index'i
  const displayedTitle = useSignal(''); // Daktilo efekti için gösterilen başlık
  const videoRef = useSignal(); // Video elementine referans

  const currentVideoData = videos[currentIndex.value];

  // Daktilo efekti için useTask$
  // currentIndex değiştiğinde bu task yeniden çalışır.
  useTask$(({ track, cleanup }) => {
    track(() => currentIndex.value); // currentIndex.value değişimlerini izle

    displayedTitle.value = ''; // Yeni videoya geçerken başlığı sıfırla
    const targetTitle = videos[currentIndex.value].name;
    let charIndex = 0;
    const typingSpeed = 10; // Milisaniye cinsinden yazma hızı

    const intervalId = setInterval(() => {
      if (charIndex < targetTitle.length) {
        displayedTitle.value += targetTitle.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, typingSpeed);

    // Component kaldırıldığında veya task yeniden çalıştığında interval'ı temizle
    cleanup(() => clearInterval(intervalId));
  });

  const handleVideoEnded = $(() => {
    currentIndex.value = (currentIndex.value + 1) % videos.length;
  });

  return (
    <section class="relative h-[95vh] shadow-2xl shadow-black/20 flex items-center justify-center overflow-hidden">
      {/* Sol altta silüet logo overlay */}
      <img
        src="/ico.svg"
        alt="Ayvera Silüet Logo"
        class="absolute right-[-250px] w-[400px] h-[400px] opacity-10 z-0 select-none pointer-events-none"
        style={{ filter: ' drop-shadow(0 0 20px #0002)' }}
      />
      <video
        ref={videoRef}
        key={currentVideoData.src}
        autoPlay
        muted
        playsInline
        preload="auto"
        class="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
        onEnded$={handleVideoEnded}
      >
        <source src={currentVideoData.src} type="video/mp4" />
        Tarayıcınız video etiketini desteklemiyor.
      </video>

      {/* Koyu Overlay */}
      <div class="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-[-1]"></div>
      <div class="relative z-10 text-white text-center text-shadow-lg select-none px-4 flex flex-col justify-between h-full py-16 md:py-24">
        <div class="flex-grow flex flex-col items-center justify-center">
          <h1 class="text-3xl md:text-3xl font-bold">Ayvera Güvenlik Çözümleri</h1>
          <p class="text-lg md:text-xl mt-2 md:mt-4">Güvenliğiniz için buradayız.</p>
        </div>
      </div>
    </section>
  );
});