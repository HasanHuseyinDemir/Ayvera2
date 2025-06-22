import { component$, Slot } from '@builder.io/qwik';

export const Content = component$(({ title }) => {
  return (
    <section class="max-w-4xl mx-auto py-4 md:py-8">
      <h1 class="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-6 md:mb-8 border-b-2 border-blue-500 pb-2">
        {title.toUpperCase()}
      </h1>
      <div class="text-base md:text-lg text-gray-800 leading-relaxed px-4 md:px-0">
        <Slot />
      </div>
    </section>
  );
});
