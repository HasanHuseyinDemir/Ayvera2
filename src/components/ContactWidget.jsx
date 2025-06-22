import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

// Sabit iletişim widget'ı
export const ContactWidget = component$(() => {
  const open = useSignal(false);
  return (
    <div class="fixed bottom-6 right-6 z-50">
      <button onClick$={() => (open.value = !open.value)} class="bg-cyan-700 text-white rounded-full p-4 shadow-lg hover:bg-cyan-800 transition">
        <span class="font-bold text-lg">?</span>
      </button>
      {open.value && (
        <div class="mt-2 bg-white text-cyan-900 rounded-lg shadow-lg p-4 w-64">
          <h3 class="font-bold mb-2">Bize Ulaşın</h3>
          <p class="text-sm mb-2">Sorunuz mu var? Size yardımcı olalım.</p>
          <Link href="/content/iletisim#content" class="block bg-cyan-700 text-white text-center rounded py-2 font-semibold hover:bg-cyan-800 transition">İletişim Formu</Link>
        </div>
      )}
    </div>
  );
});

export default ContactWidget;
