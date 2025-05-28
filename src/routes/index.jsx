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
    img: '/evguvenlik.png',
    desc: 'Alarm sistemlerimiz ile ev ve iş yerlerinizde maksimum güvenlik sağlıyoruz. Hızlı müdahale ve akıllı bildirimlerle huzurunuz garanti altında.'
  },
  {
    title: 'Kamera Sistemleri',
    img: '/cam.png',
    desc: 'Yüksek çözünürlüklü kamera sistemlerimiz ile 7/24 izleme ve kayıt imkanı. Her anı kontrol altında tutun.'
  },
  {
    title: 'Ses Sistemleri',
    img: '/ses.png',
    desc: 'Profesyonel ses sistemleri ile anons, uyarı ve acil durumlarda etkili iletişim.'
  },
  {
    title: 'Güvenlik Aparatları',
    img: '/aparat.png',
    desc: 'Kapı, pencere ve geçiş noktaları için tamamlayıcı güvenlik aparatları ile tam koruma.'
  },
  {
    title: 'Yangın Sistemleri',
    img: '/yangin.png',
    desc: 'Yangın algılama ve alarm sistemlerimiz ile erken uyarı ve hızlı tahliye imkanı.'
  },
  {
    title: 'Kablo Çeşitleri',
    img: '/kablo.png',
    desc: 'Güvenlik sistemleriniz için yüksek kaliteli ve dayanıklı kablo çözümleri.'
  },
  {
    title: 'Geçiş Güvenlik Sistemleri',
    img: '/gecis.png',
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
          Ayvera Güvenlik, her müşterisinin ihtiyacına uygun en güncel ve güvenilir teknolojileri kullanarak, güvenliğinizi en üst düzeye taşır. Her projede ihtiyaca özel çözümler sunar, kurulumdan bakıma kadar tüm süreçte yanınızda olur. Güvenliğiniz için doğru adres: Ayvera.
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

        <Cozumler/>
    </>
  );
});