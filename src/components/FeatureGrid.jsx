import { component$ } from '@builder.io/qwik';

// Özellik/avantaj grid'i
export const FeatureGrid = component$(({ features = [] }) => (
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {features.map(({ icon: Icon, title, desc }) => (
      <div key={title} class="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
        {Icon && <Icon class="w-10 h-10 text-cyan-700 mb-2" />}
        <h3 class="font-bold text-cyan-800 mb-1">{title}</h3>
        <p class="text-gray-700 text-sm">{desc}</p>
      </div>
    ))}
  </div>
));

export default FeatureGrid;
