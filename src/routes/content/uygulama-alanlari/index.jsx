import { component$ } from '@builder.io/qwik';
import { Content } from '~/components/content';

export const head = {
    title: 'Uygulama Alanları | Ayvera Güvenlik',
    meta: [
        { name: 'description', content: 'Ayvera Güvenlik çözümlerinin uygulandığı sektörler ve alanlar.' },
        { name: 'keywords', content: 'uygulama alanları, sektörler, güvenlik çözümleri, ayvera' }
    ]
};

const uygulamaAlanlari = [
    {
      baslik: 'Ofis ve İş Merkezleri',
      aciklama:
        'IP kameralar ve geçiş kontrol sistemleri ile ofis güvenliğini artırın. Yetkisiz girişleri önleyin.',
      resim: '/images/ofis.jpg',
    },
    {
      baslik: 'Alışveriş Merkezleri',
      aciklama:
        'Geniş alan kapsayan kamera ve anons sistemleri ile müşteri ve çalışan güvenliğini sağlayın.',
      resim: '/images/avm.jpg',
    },
    {
      baslik: 'Konut ve Siteler',
      aciklama:
        'Apartmanlar ve siteler için güvenli giriş, interkom ve yangın alarm çözümleri.',
      resim: '/images/konut.jpg',
    },
    {
      baslik: 'Fabrika ve Depolar',
      aciklama:
        'Üretim tesisleri ve depolarda geniş alanları izleyen güvenlik sistemleri.',
      resim: '/images/fabrika.jpg',
    },
    {
      baslik: 'Okul ve Eğitim Kurumları',
      aciklama:
        'Öğrenci ve personel güvenliği için kamera ve alarm sistemleri entegre çözümler.',
      resim: '/images/okul.jpg',
    },
  ];

export default component$(() => (
    <Content title="Uygulama Alanları">
       <div class="min-h-screen bg-gray-100 py-12 px-6">
      <div class="max-w-7xl mx-auto">

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {uygulamaAlanlari.map((alan) => (
            <div class="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl">
              <img
                src={alan.resim}
                alt={alan.baslik}
                class="w-full h-48 object-cover"
              />
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-2">
                  {alan.baslik}
                </h2>
                <p class="text-gray-600">{alan.aciklama}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </Content>
));
