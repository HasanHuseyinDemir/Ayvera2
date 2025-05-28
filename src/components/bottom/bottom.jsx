import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import {BsMailbox, BsShop, BsTelephone} from "@qwikest/icons/bootstrap"

export const Bottom= component$(() => {
  return (
    <footer class="bg-cyan-900 text-white py-10">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* İletişim Bilgileri */}
        <div>
          <h3 class="text-lg font-semibold mb-4">İletişim</h3>
          <ul class="space-y-2 text-sm">
            <li class="flex gap-2 items-center"><BsShop/>Hacı İlyas Mh Celal Bayar Cd No 22/A Osmangazi BURSA</li>
            <li class="flex gap-2 items-center">
              <BsTelephone/>
              <a href="tel:0850 441 60 10" class="link">
                0850 441 60 10
              </a>  
            </li>

            <li class="flex gap-2 items-center"><BsMailbox/>
              <a href="mailto:info@ayvera.com.tr" class="link">
                info@ayvera.com.tr
              </a>
            </li>
          </ul>
        </div>

        {/* Sayfa Linkleri */}
        <div>
          <h3 class="text-lg font-semibold mb-4">Sayfalar</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <Link href="/content/hakkimizda#content" class="hover:underline">Hakkımızda</Link>
            </li>
            <li>
              <Link href="/content/hizmetler#content" class="hover:underline">Hizmetler</Link>
            </li>
            <li>
              <Link href="/content/iletisim#content" class="hover:underline">İletişim</Link>
            </li>
          </ul>
        </div>

        {/* Sosyal Medya Linkleri */}
        <div>
          <h3 class="text-lg font-semibold mb-4">Sosyal Medyada Ayvera</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="hover:underline">Twitter'da Bizi Takip Edin</a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="hover:underline">Instagram'da Güncel Kalın</a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="hover:underline">Facebook'ta Topluluğumuza Katılın</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 text-center text-base text-cyan-100 max-w-3xl mx-auto">
        <strong>Ayvera Güvenlik</strong> olarak, bireysel ve kurumsal müşterilerimizin güvenliğini en üst düzeyde sağlamak için yenilikçi çözümler sunuyoruz. Deneyimli ekibimiz ve güçlü teknik altyapımız ile, her zaman yanınızdayız.
      </div>

      {/* Bizi Neden Tercih Etmelisiniz Bölümü */}
      <div class="mt-10 flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-5xl mx-auto">
        <div class="flex-1 bg-cyan-800/80 rounded-lg p-6 text-center shadow-md">
          <h4 class="text-lg font-bold text-cyan-200 mb-2">Uzman Kadro</h4>
          <p class="text-cyan-100 text-sm">Alanında deneyimli ve eğitimli personel ile profesyonel hizmet.</p>
        </div>
        <div class="flex-1 bg-cyan-800/80 rounded-lg p-6 text-center shadow-md">
          <h4 class="text-lg font-bold text-cyan-200 mb-2">7/24 Destek</h4>
          <p class="text-cyan-100 text-sm">Her an ulaşabileceğiniz teknik destek ve hızlı çözüm.</p>
        </div>
        <div class="flex-1 bg-cyan-800/80 rounded-lg p-6 text-center shadow-md">
          <h4 class="text-lg font-bold text-cyan-200 mb-2">Güvenilir Teknoloji</h4>
          <p class="text-cyan-100 text-sm">En güncel ve güvenilir güvenlik sistemleriyle tam koruma.</p>
        </div>
      </div>

      <div class="mt-10 text-center text-xs text-cyan-200">
        © {new Date().getFullYear()} <Link href="https://ayvera.com.tr/">ayvera.com.tr</Link> - Tüm hakları saklıdır.
      </div>
      {/* Ödeme Yöntemleri İkonları */}
      <div class="mt-4 flex justify-center gap-4">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" class="h-8 w-auto object-contain rounded bg-white p-1 shadow" loading="lazy" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" class="h-8 w-auto object-contain rounded bg-white p-1 shadow" loading="lazy" />
      </div>
    </footer>
  );
});
