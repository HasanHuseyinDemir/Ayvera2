import { component$ } from '@builder.io/qwik';

// Sidebar: Kategoriler ve ürünler için
export const SidebarProductList = component$(({ categories = [] }) => (
  <aside class="w-64 bg-cyan-900 text-white h-full p-4">
    <h2 class="text-xl font-bold mb-4">Ürün Kategorileri</h2>
    <ul class="space-y-2">
      {categories.map(cat => (
        <li key={cat.name} class="hover:bg-cyan-700 rounded px-2 py-1 cursor-pointer transition">
          {cat.name}
        </li>
      ))}
    </ul>
  </aside>
));

export default SidebarProductList;
