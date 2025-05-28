import { component$ } from '@builder.io/qwik';
import { Content } from '~/components/content';

export default component$(() => {
  return (
    <Content title="İLETİŞİM">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sol: İletişim Bilgileri ve Bayilik */}
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-bold mb-2 text-cyan-800">İletişim Bilgilerimiz</h2>
            <ul class="space-y-2 text-base text-gray-800">
              <li><strong>Firma Ünvanı:</strong> Ayvera Güvenlik Hizmetleri</li>
              <li><strong>Adres:</strong> Hacı İlyas Mh Celal Bayar Cd No 22/A Osmangazi BURSA</li>
              <li><strong>Telefon:</strong> <a href="tel:08504416010" class="text-cyan-700 hover:underline">0850 441 60 10</a></li>
              <li><strong>E-Posta:</strong> <a href="mailto:info@ayvera.com.tr" class="text-cyan-700 hover:underline">info@ayvera.com.tr</a></li>
            </ul>
          </div>
          <div class="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded shadow text-cyan-900">
            <strong>Bayilik Başvurusu:</strong> Ayvera ailesine katılmak ve bayilik fırsatlarımızdan yararlanmak için bizimle iletişime geçebilirsiniz. Güvenliğinizi birlikte büyütelim!
          </div>
        </div>
        {/* Sağ: İletişim Formu */}
        <form class="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border-t-4 border-cyan-500">
          <div>
            <label class="block text-sm font-semibold text-cyan-800 mb-1">Firma Ünvanı</label>
            <input type="text" name="company" class="w-full border border-cyan-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="Firma Ünvanı" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-cyan-800 mb-1">Adınız</label>
            <input type="text" name="name" class="w-full border border-cyan-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="Adınız" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-cyan-800 mb-1">E-Posta</label>
            <input type="email" name="email" class="w-full border border-cyan-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="E-Posta" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-cyan-800 mb-1">Telefon</label>
            <input type="tel" name="phone" class="w-full border border-cyan-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="Telefon" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-cyan-800 mb-1">Konu</label>
            <input type="text" name="subject" class="w-full border border-cyan-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="Konu" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-cyan-800 mb-1">Mesajınız</label>
            <textarea name="message" rows={4} class="w-full border border-cyan-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="Mesajınız"></textarea>
          </div>
          <button type="submit" class="mt-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-6 rounded shadow transition">Gönder</button>
        </form>
      </div>
    </Content>
  );
});