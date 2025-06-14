import { component$ } from '@builder.io/qwik';

// Adım adım süreç/kurulum stepper
export const StepperProcess = component$(({ steps = [], current = 0 }) => (
  <div class="flex flex-col md:flex-row sm:hidden items-center gap-6">
    {steps.map((step, idx) => (
      <div key={step.title} class="flex items-center gap-2">
        <div class={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-white ${idx <= current ? 'bg-cyan-700' : 'bg-cyan-200'}`}>{idx + 1}</div>
        <div class="text-cyan-900 font-semibold">{step.title}</div>
        {idx < steps.length - 1 && <div class="w-8 h-1 bg-cyan-300 mx-2 rounded" />}
      </div>
    ))}
  </div>
));

export default StepperProcess;
