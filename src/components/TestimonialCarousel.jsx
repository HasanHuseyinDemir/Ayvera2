import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

// Müşteri yorumları için carousel
export const TestimonialCarousel = component$(({ testimonials = [] }) => {
  const current = useSignal(0);
  useVisibleTask$(() => {
    const interval = setInterval(() => {
      current.value = (current.value + 1) % testimonials.length;
    }, 5000);
    return () => clearInterval(interval);
  });
  return (
    <div class="relative w-full max-w-2xl mx-auto bg-cyan-50 rounded-xl shadow p-8 text-center">
      <blockquote class="text-lg italic text-cyan-900">{testimonials[current.value]?.text}</blockquote>
      <div class="mt-4 font-bold text-cyan-700">{testimonials[current.value]?.author}</div>
    </div>
  );
});

export default TestimonialCarousel;
