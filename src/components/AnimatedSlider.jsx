import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

// Animasyonlu, otomatik geçişli slider
export const AnimatedSlider = component$(({ slides = [] }) => {
  const current = useSignal(0);
  useVisibleTask$(() => {
    const interval = setInterval(() => {
      current.value = (current.value + 1) % slides.length;
    }, 3500);
    return () => clearInterval(interval);
  });
  return (
    <div class="relative w-full h-64 overflow-hidden shadow-lg">
      {slides.map((slide, idx) => (
        <img
          key={slide.title}
          src={slide.img}
          alt={slide.title}
          class={`absolute w-full h-full object-cover transition-opacity duration-700 ${current.value === idx ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button key={idx} class={`w-3 h-3 rounded-full ${current.value === idx ? 'bg-blue-600' : 'bg-white'}`}/>
        ))}
      </div>
    </div>
  );
});

export default AnimatedSlider;
