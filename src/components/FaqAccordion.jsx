import { component$ } from '@builder.io/qwik';

// SSS için akordeon
export const FaqAccordion = component$(({ faqs = [] }) => (
  <div class="space-y-4">
    {faqs.map(({ question, answer }) => (
      <details key={question} class="bg-white rounded shadow p-4">
        <summary class="font-semibold text-cyan-700 cursor-pointer">{question}</summary>
        <div class="mt-2 text-gray-700">{answer}</div>
      </details>
    ))}
  </div>
));

export default FaqAccordion;
