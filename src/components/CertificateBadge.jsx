import { component$ } from '@builder.io/qwik';

// Sertifika/rozet bileşeni
export const CertificateBadge = component$(({ label, icon: Icon }) => (
  <span class="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs font-semibold shadow">
    {Icon && <Icon class="w-4 h-4" />} {label}
  </span>
));

export default CertificateBadge;
