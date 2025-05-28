import { component$ } from '@builder.io/qwik';
import { LuSearch, LuUserCheck, LuClipboardList, LuSettings, LuBell, LuWrench } from '@qwikest/icons/lucide';
import { Slider } from '~/components/Slider';
import { Cozumler } from '~/components/cozumler';

const blocks = [
  {
    icon: LuSearch,
    title: 'Ücretsiz Keşif',
    desc: 'Ayvera Güvenlik, her müşterisinin ihtiyacına özel çözümler sunmak için ilk adımda ücretsiz keşif hizmeti sağlar. Uzman ekibimiz, mekanınızı yerinde analiz ederek en uygun güvenlik stratejisini belirler.'
  },
  {
    icon: LuUserCheck,
    title: 'Danışmanlık',
    desc: 'Güvenlik sistemlerinde doğru tercihler yapmak kritik öneme sahiptir. Ayvera, deneyimli kadrosıyla risk analizi yapar ve size en uygun teknolojik çözümler konusunda tarafsız danışmanlık sunar.'
  },
  {
    icon: LuClipboardList,
    title: 'Projelendirme',
    desc: 'Her kurumun güvenlik ihtiyacı farklıdır. Ayvera, yangın alarmı gibi hassas alanlar dahil olmak üzere tüm projeleri titizlikle planlar ve ihtiyaca özel projelendirme hizmeti verir.'
  },
  {
    icon: LuSettings,
    title: 'Anahtar Teslim Sistem Kurulumu ve Eğitim',
    desc: 'Sadece sistem kurmakla kalmaz, tüm süreci baştan sona yönetiriz. Kurulum sonrası kullanıcı eğitimiyle, sistemlerinizi güvenle ve verimli şekilde kullanmanızı sağlarız.'
  },
  {
    icon: LuBell,
    title: 'Alarm İzleme',
    desc: 'Kurulan sistemlerin sürekli ve etkin çalışması için alarm izleme ve periyodik bakım hizmetleri sunarız. Böylece güvenliğiniz her zaman kontrol altında olur.'
  },
  {
    icon: LuWrench,
    title: 'Satış Sonrası Servis ve Periyodik Bakım',
    desc: 'Ayvera, kurulum sonrası da yanınızda. Hızlı teknik destek ve düzenli bakım ile sistemlerinizin her zaman en iyi şekilde çalışmasını garanti ederiz.'
  },
];

const sliderData = [
  {
    title: 'Alarm Sistemleri',
    img: '/stock/evguvenlik.png',
    desc: 'Alarm sistemlerimiz ile ev ve iş yerlerinizde maksimum güvenlik sağlıyoruz. Hızlı müdahale ve akıllı bildirimlerle huzurunuz garanti altında.'
  },
  {
    title: 'Kamera Sistemleri',
    img: '/stock/cam.png',
    desc: 'Yüksek çözünürlüklü kamera sistemlerimiz ile 7/24 izleme ve kayıt imkanı. Her anı kontrol altında tutun.'
  },
  {
    title: 'Ses Sistemleri',
    img: '/stock/ses.png',
    desc: 'Profesyonel ses sistemleri ile anons, uyarı ve acil durumlarda etkili iletişim.'
  },
  {
    title: 'Güvenlik Aparatları',
    img: '/stock/aparat.png',
    desc: 'Kapı, pencere ve geçiş noktaları için tamamlayıcı güvenlik aparatları ile tam koruma.'
  },
  {
    title: 'Yangın Sistemleri',
    img: '/stock/yangin.png',
    desc: 'Yangın algılama ve alarm sistemlerimiz ile erken uyarı ve hızlı tahliye imkanı.'
  },
  {
    title: 'Kablo Çeşitleri',
    img: '/stock/kablo.png',
    desc: 'Güvenlik sistemleriniz için yüksek kaliteli ve dayanıklı kablo çözümleri.'
  },
  {
    title: 'Geçiş Güvenlik Sistemleri',
    img: '/stock/gecis.png',
    desc: 'Kartlı, şifreli ve biyometrik geçiş sistemleriyle yetkisiz erişimi önleyin.'
  },
];

export const head = {
  title: 'Ayvera Güvenlik | Elektronik Güvenlik Sistemleri',
  meta: [
    { name: 'description', content: 'Ayvera Güvenlik, elektronik güvenlik sistemleri, alarm, kamera, yangın ve geçiş sistemlerinde profesyonel çözümler sunar.' },
    { name: 'keywords', content: 'güvenlik, alarm, kamera, yangın, geçiş sistemleri, elektronik güvenlik, ayvera' }
  ]
};

export default component$(() => {
  return (
    <>
      {/* Slider Alanı */}
      <Slider data={sliderData} />

      {/* Neden Ayvera Blok */}
      <div class="w-full bg-cyan-600 text-white text-center py-8 text-2xl font-bold tracking-wide shadow-md mb-10">
        Neden Ayvera?
        <div class="max-w-3xl mx-auto mt-4 text-base font-normal">
          Ayvera Güvenlik, müşterilerinin güvenliğini en üst düzeyde sağlamak amacıyla, ulusal ve uluslararası standartlara uygun, yenilikçi ve sürdürülebilir çözümler sunar. Her projede; keşif, danışmanlık, projelendirme, kurulum, eğitim ve satış sonrası destek süreçlerini titizlikle yönetir. Güvenlik teknolojilerindeki güncel gelişmeleri yakından takip ederek, kurumların ve bireylerin ihtiyaçlarına özel, uzun ömürlü ve entegre sistemler geliştirir. Güvenliğiniz için doğru adres: Ayvera.
        </div>
      </div>

      {/* Kurumsal Hizmetler Blokları */}
      <section class="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blocks.map(({ icon: Icon, title, desc }) => (
          <div key={title} class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-cyan-500 hover:shadow-2xl transition-shadow">
            <Icon class="w-12 h-12 text-cyan-600 mb-4" />
            <h3 class="text-lg font-bold text-cyan-800 mb-2">{title}</h3>
            <p class="text-gray-700 text-sm">{desc}</p>
          </div>
        ))}
      </section>

      {/* Referanslar/İş Ortakları Alanı */}
      <section class="max-w-6xl mx-auto py-8 px-4">
        <h2 class="text-xl md:text-2xl font-bold text-cyan-800 text-center mb-6">Bize Güvenen İş Ortaklarımız</h2>
        <div class="flex flex-wrap justify-center items-center gap-8">
          <img src="/stock/cam.png" alt="Referans 1" class="h-12 w-auto grayscale hover:grayscale-0 transition" />
          <img src="/stock/evguvenlik.png" alt="Referans 2" class="h-12 w-auto grayscale hover:grayscale-0 transition" />
          <img src="/stock/kablo.png" alt="Referans 3" class="h-12 w-auto grayscale hover:grayscale-0 transition" />
          <img src="/stock/gecis.png" alt="Referans 4" class="h-12 w-auto grayscale hover:grayscale-0 transition" />
        </div>
      </section>

      {/* Kısa İstatistikler */}
      <section class="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div class="bg-cyan-50 rounded-lg shadow p-6">
          <div class="text-3xl font-bold text-cyan-700 mb-2">500+</div>
          <div class="text-cyan-900 font-semibold">Başarılı Proje</div>
        </div>
        <div class="bg-cyan-50 rounded-lg shadow p-6">
          <div class="text-3xl font-bold text-cyan-700 mb-2">%100</div>
          <div class="text-cyan-900 font-semibold">Müşteri Memnuniyeti</div>
        </div>
        <div class="bg-cyan-50 rounded-lg shadow p-6">
          <div class="text-3xl font-bold text-cyan-700 mb-2">7/24</div>
          <div class="text-cyan-900 font-semibold">Teknik Destek</div>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular (SSS) */}
      <section class="max-w-4xl mx-auto py-10 px-4">
        <h2 class="text-xl md:text-2xl font-bold text-cyan-800 text-center mb-6">Sıkça Sorulan Sorular</h2>
        <div class="space-y-4">
          <details class="bg-white rounded shadow p-4">
            <summary class="font-semibold text-cyan-700 cursor-pointer">Alarm sistemlerinizin garantisi var mı?</summary>
            <div class="mt-2 text-gray-700">Tüm ürünlerimiz ve kurulumlarımız 2 yıl garantilidir. Ayrıca isteğe bağlı olarak ek garanti ve bakım paketleri sunuyoruz.</div>
          </details>
          <details class="bg-white rounded shadow p-4">
            <summary class="font-semibold text-cyan-700 cursor-pointer">Kurulumdan sonra teknik destek alabilir miyim?</summary>
            <div class="mt-2 text-gray-700">Evet, 7/24 teknik destek hattımız ve uzaktan destek imkanımız mevcuttur.</div>
          </details>
          <details class="bg-white rounded shadow p-4">
            <summary class="font-semibold text-cyan-700 cursor-pointer">Fiyat teklifi almak için ne yapmalıyım?</summary>
            <div class="mt-2 text-gray-700">İletişim formumuzu doldurabilir veya doğrudan bizi arayarak ücretsiz keşif ve teklif talebinde bulunabilirsiniz.</div>
          </details>
        </div>
      </section>

      {/* Hızlı Teklif Al Butonu */}
      <div class="flex justify-center my-10">
        <a href="/content/iletisim#content" class="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-4 px-10 rounded-full shadow-lg text-xl transition">Hızlı Teklif Al</a>
      </div>

        <Cozumler/>
    </>
  );
});