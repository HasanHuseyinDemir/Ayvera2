import { component$ } from '@builder.io/qwik';

// Referans marka logoları bulutu
export const BrandLogoCloud = component$(({ logos = [] }) => (
  <div class="flex flex-wrap justify-center items-center gap-8 py-6">
    {logos.map((logo, idx) => (
      <img key={idx} src={logo.src} alt={logo.alt} class="h-10 w-auto grayscale hover:grayscale-0 transition" />
    ))}
  </div>
));

export default BrandLogoCloud;
