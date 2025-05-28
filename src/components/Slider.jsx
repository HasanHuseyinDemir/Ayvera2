import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { LuArrowLeftCircle, LuArrowRightCircle } from '@qwikest/icons/lucide';

export const Slider = component$(({ data }) => {
  const current = useSignal(0);
  const length = data.length;

  // Otomatik slider geçişi
  useVisibleTask$(() => {
    const interval = setInterval(() => {
      current.value = (current.value + 1) % length;
    }, 4000);
    return () => clearInterval(interval);
  });

  const goNext = $(() => {
    current.value = (current.value + 1) % length;
  });
  const goPrev = $(() => {
    current.value = (current.value - 1 + length) % length;
  });

  return (
    <div class="w-full bg-cyan-900 py-10">
      <div class="max-w-4xl mx-auto flex flex-col items-center">
        <div class="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden rounded-xl shadow-lg">
          {data.map((item, idx) => (
            <img
              key={item.title}
              src={item.img}
              alt={item.title}
              class={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-700 ${current.value === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{ transition: 'opacity 0.7s' }}
            />
          ))}
          {/* İleri/Geri Butonları */}
          <button
            class="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-20 p-0"
            aria-label="Geri"
            onClick$={goPrev}
          >
            <LuArrowLeftCircle class="w-10 h-10 text-white hover:text-cyan-800 transition-colors"  />
          </button>
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-20 p-0"
            aria-label="İleri"
            onClick$={goNext}
          >
            <LuArrowRightCircle class="w-10 h-10 text-white hover:text-cyan-800 transition-colors" />
          </button>
          {/* Slider başlıkları için alt kısımda noktalar */}
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {data.map((_, idx) => (
              <button
                key={idx}
                class={`w-3 h-3 rounded-full border-2 ${current.value === idx ? 'bg-cyan-600 border-white' : 'bg-white border-cyan-600'} transition-all`}
                aria-label={`Slide ${idx+1}`}
                onClick$={() => (current.value = idx)}
              />
            ))}
          </div>
        </div>
        <h2 class="mt-6 text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{data[current.value].title}</h2>
        <p class="mt-2 text-base md:text-lg text-cyan-100 max-w-2xl text-center drop-shadow">{data[current.value].desc}</p>
      </div>
    </div>
  );
});