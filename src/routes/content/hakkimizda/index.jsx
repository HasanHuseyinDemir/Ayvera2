import { component$ } from '@builder.io/qwik';
import { Content } from '~/components/content';
import { LuStar } from '@qwikest/icons/lucide'; // Eğer lucide-qwik veya heroicons kullanıyorsan
const values = [
    'Kalite',
    'Yenilikçilik',
    'Dürüstlük',
    'Yardımlaşma',
    'Sevgi ve Saygı',
    'Müşteri Memnuniyeti',
    'İletişim',
    'Şeffaflık',
];

export const head = {
  title: 'Hakkımızda | Ayvera Güvenlik',
  meta: [
    { name: 'description', content: 'Ayvera Güvenlik hakkında detaylı bilgi, vizyon, misyon ve değerlerimiz.' },
    { name: 'keywords', content: 'hakkımızda, ayvera, vizyon, misyon, değerler' }
  ]
};

export default component$(() => {
    return (
        <Content title="Hakkımızda">
            <section class="space-y-8">
                <div>

                    <p>
                        Zamanın iş süreçlerindeki kritik öneminin bilinciyle hareket eden <b>Ayvera</b>, müşterilerimizin ihtiyaç, beklenti ve değerli geri bildirimlerini tüm süreçlerimizin merkezine koyarak, onlara özel, kalıcı ve en etkili çözümleri geliştirmeyi temel ilkemiz olarak benimsiyoruz. Faaliyet gösterdiğimiz sektörde standartların sürekli iyileştirilmesine öncülük etmeyi ve sunduğumuz benzersiz hizmet kalitesiyle sarsılmaz bir müşteri sadakati inşa etmeyi amaçlıyoruz.
                    </p>

                </div>
                <div>
                    <h2 class="text-xl font-semibold text-cyan-800 mb-2">Kalite Politikamız</h2>
                    <p class="text-gray-700 leading-relaxed">
                        Müşteri beklentilerini en hızlı, en kaliteli ve en doğru ürünlerle karşılayan;
                        tedarikçilerle ilişkilerini sürekli geliştiren, müşteri memnuniyetini ön planda tutan;
                        çalışanların gelişimine önem veren, topluma ve çevreye duyarlı hareket eden, gelişime ve yeniliklere açık bir firmayız.
                    </p>
                </div>

                <div>
                    <h2 class="text-xl font-semibold text-cyan-800 mb-2">Vizyon</h2>
                    <p class="text-gray-700 leading-relaxed">
                        Kaliteli ürün ve doğru fiyat politikası ile sektöründe en çok beğenilen ve tercih edilen firma olmak.
                    </p>
                </div>

                <div>
                    <h2 class="text-xl font-semibold text-cyan-800 mb-2">Misyon</h2>
                    <p class="text-gray-700 leading-relaxed">
                        Çalıştığı tüm firmalara karşı kalite ve uygun fiyat anlayışını sürekli geliştiren, dinamik, kendini yenileyen ve müşteri odaklı bir kurumsal yapıyı benimsemektir.
                    </p>
                </div>

                <div>
                    <h2 class="text-xl font-semibold text-cyan-800 mb-2">Şikayet Politikamız</h2>
                    <p class="text-gray-700 leading-relaxed">
                        Tüm talep ve şikayetleri, yasa ve şirket kuralları çerçevesinde objektif olarak değerlendiren, iyileştirmeye özen gösteren ve müşteri memnuniyetini sürekli artıran bir kurum olmak.
                    </p>
                </div>

                <div>
                    <h2 class="text-xl font-semibold text-cyan-800 mb-2">Değerlerimiz</h2>
                    <ul class="space-y-2">
                        {values.map((value) => (
                            <li class="flex items-start gap-2 text-gray-700 leading-relaxed" key={value}>
                                <LuStar class="w-5 h-5 text-cyan-600 mt-1 shrink-0" fill="currentColor" />
                                <span>{value}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </section>
        </Content>
    );
});
