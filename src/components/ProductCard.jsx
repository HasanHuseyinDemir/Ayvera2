import { component$ } from '@builder.io/qwik';

// Ürün/hizmet kartı
export const ProductCard = component$(({ img, title, desc, buttonText, onButtonClick }) => (
  <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-cyan-500 hover:shadow-2xl transition">
    <img src={img} alt={title} class="w-24 h-24 object-contain mb-4" />
    <h3 class="text-lg font-bold text-cyan-800 mb-2">{title}</h3>
    <p class="text-gray-700 text-sm mb-4">{desc}</p>
    <button onClick$={onButtonClick} class="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800 transition">{buttonText}</button>
  </div>
));

export default ProductCard;
