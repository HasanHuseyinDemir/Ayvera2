import { component$ } from '@builder.io/qwik';

// Kısa istatistikler için bar
export const StatsBar = component$(({ stats = [] }) => (
  <div class="flex flex-wrap justify-center gap-8 py-6">
    {stats.map(({ icon: Icon, value, label }) => (
      <div key={label} class="flex flex-col items-center">
        {Icon && <Icon class="w-8 h-8 text-cyan-700 mb-1" />}
        <div class="text-2xl font-bold text-cyan-800">{value}</div>
        <div class="text-cyan-900 text-sm">{label}</div>
      </div>
    ))}
  </div>
));

export default StatsBar;
