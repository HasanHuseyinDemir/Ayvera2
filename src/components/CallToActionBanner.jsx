import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

// Harekete geçirici banner
export const CallToActionBanner = component$(({ title, desc, buttonText, buttonHref }) => (
  <div class="bg-blue-700 text-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6 my-8">
    <div>
      <h2 class="text-2xl font-bold mb-2">{title}</h2>
      <p class="text-base mb-4">{desc}</p>
    </div>
    <Link href={buttonHref} class="bg-white text-cyan-700 font-bold px-6 py-3 rounded-full shadow hover:bg-cyan-100 transition">{buttonText}</Link>
  </div>
));

export default CallToActionBanner;
