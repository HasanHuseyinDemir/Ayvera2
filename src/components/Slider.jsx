import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { LuChevronLeft, LuChevronRight, LuPlay, LuPause } from '@qwikest/icons/lucide';

export const Slider = component$(({ data }) => {
  const current = useSignal(0);
  const isPlaying = useSignal(true);
  const length = data.length;

  // Otomatik slider geçişi
  useVisibleTask$(({ track }) => {
    track(() => isPlaying.value);
    let interval;
    if (isPlaying.value) {
      interval = setInterval(() => {
        current.value = (current.value + 1) % length;
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  });

  const goNext = $(() => {
    current.value = (current.value + 1) % length;
  });
  
  const goPrev = $(() => {
    current.value = (current.value - 1 + length) % length;
  });

  const togglePlay = $(() => {
    isPlaying.value = !isPlaying.value;
  });

  return (
    <div class="w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px), radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px); background-size: 40px 40px;"></div>
      </div>
      
      <div class="relative max-w-6xl mx-auto px-6 py-16">
        {/* Main slider container */}
        <div class="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-2xl">
          {/* Images */}
          {data.map((item, idx) => (
            <div
              key={item.title}
              class={`absolute inset-0 transition-all duration-1000 ease-out ${
                current.value === idx 
                  ? 'opacity-100 scale-100 z-10' 
                  : idx === (current.value - 1 + length) % length || idx === (current.value + 1) % length
                    ? 'opacity-30 scale-95 z-5'
                    : 'opacity-0 scale-90 z-0'
              }`}
            >
              <img
                src={item.img}
                alt={item.title}
                class="w-full h-full object-contain p-8"
              />
              {/* Subtle overlay for better text readability */}
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
            </div>
          ))}

          {/* Navigation arrows */}
          <button
            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm border border-slate-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-20 group"
            aria-label="Önceki slide"
            onClick$={goPrev}
          >
            <LuChevronLeft class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
          </button>
          
          <button
            class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm border border-slate-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-20 group"
            aria-label="Sonraki slide"
            onClick$={goNext}
          >
            <LuChevronRight class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
          </button>

          {/* Play/Pause button */}
          <button
            class="absolute top-4 right-4 w-10 h-10 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm border border-slate-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-20 group"
            aria-label={isPlaying.value ? "Duraklat" : "Oynat"}
            onClick$={togglePlay}
          >
            {isPlaying.value ? (
              <LuPause class="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
            ) : (
              <LuPlay class="w-4 h-4 text-slate-300 group-hover:text-white transition-colors ml-0.5" />
            )}
          </button>

          {/* Progress indicators */}
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {data.map((_, idx) => (
              <button
                key={idx}
                class={`relative h-1 rounded-full transition-all duration-300 ${
                  current.value === idx 
                    ? 'w-8 bg-blue-400 shadow-lg shadow-blue-400/50' 
                    : 'w-4 bg-slate-500 hover:bg-slate-400'
                }`}
                aria-label={`Slide ${idx + 1}'e git`}
                onClick$={() => (current.value = idx)}
              />
            ))}
          </div>
        </div>

        {/* Content section */}
        <div class="mt-8 text-center max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
            {data[current.value].title}
          </h2>
          <p class="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            {data[current.value].desc}
          </p>
        </div>

        {/* Slide counter */}
        <div class="absolute bottom-4 right-6 text-sm text-slate-400">
          {current.value + 1} / {length}
        </div>
      </div>
    </div>
  );
});