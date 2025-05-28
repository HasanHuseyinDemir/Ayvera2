// src/components/info-block/info-block.tsx
import { Slot, component$ } from '@builder.io/qwik';

export const InfoBlock = component$(({
  title,
  bgColor,
  bgImage,
  textColor = 'text-white', // Varsayılan metin rengi
  overlayColor,
  className,
}) => {
  const baseClasses = "p-6 rounded-md shadow-lg text-center flex-1 min-w-[280px] md:min-w-[300px] flex flex-col justify-between";
  const dynamicBgClass = !bgImage && bgColor ? bgColor : ''; // Eğer resim yoksa ve renk varsa, rengi uygula

  // Arka plan resmi için stil objesi
  const bgImageStyle = bgImage
    ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <div
      class={`${baseClasses} ${dynamicBgClass} ${className || ''} relative`} // `relative` pozisyonu overlay için gerekli
      style={bgImageStyle}
    >
      {/* Arka plan resmi için overlay (opsiyonel) */}
      {bgImage && overlayColor && (
        <div class={`absolute inset-0 ${overlayColor} rounded-sm z-0`}></div>
      )}

      {/* İçerik (overlay'in üzerinde olmalı) */}
      <div class={`relative z-10 flex flex-col h-full ${textColor}`}>
        <h2 class="text-2xl font-bold mb-3">
          {title}
        </h2>
        <div class="text-sm leading-relaxed flex-grow">
          <Slot /> {/* Metin içeriği buraya gelecek */}
        </div>
        {/* <button class="mt-4 bg-white text-teal-700 px-4 py-2 rounded hover:bg-opacity-90">
          Daha Fazla Bilgi
        </button> */}
      </div>
    </div>
  );
});