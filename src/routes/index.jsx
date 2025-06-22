import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuSearch, LuUserCheck, LuClipboardList, LuSettings, LuBell, LuWrench } from '@qwikest/icons/lucide';
import { Slider } from '~/components/Slider';
import StatsBar from '~/components/StatsBar';
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
  const brands = useSignal([]);

  // Markaları yükle
  useTask$(async () => {
    try {
      if (typeof window !== 'undefined') {
        const response = await fetch('/api/brands');
        if (response.ok) {
          const data = await response.json();
          brands.value = data;
        }
      } else {
        // SSR için direkt import
        const { readBrands } = await import('~/services/db.js');
        const data = await readBrands();
        brands.value = data;
      }
    } catch (error) {
      console.error('Markalar yüklenemedi:', error);
      // Fallback: boş array
      brands.value = [];
    }
  });

  return (
    <div class="bg-gray-50">
      {/* Hero Section - Profesyonel ve Teknolojik */}
      <section class="relative bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 overflow-hidden">
        {/* Tech Pattern Background */}
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 left-0 w-full h-full" 
               style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 40px 40px;">
          </div>
        </div>
        
        {/* Subtle geometric shapes */}
        <div class="absolute top-20 right-20 w-32 h-32 border border-blue-400/20 rotate-45"></div>
        <div class="absolute bottom-20 left-20 w-24 h-24 border border-blue-400/20 rotate-12"></div>
        
        <div class="relative max-w-7xl mx-auto px-4 py-24 text-white">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div class="inline-flex items-center bg-blue-600/20 border border-blue-400/30 rounded-lg px-4 py-2 mb-8">
                <svg class="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7l2 2-2 2m2-5H9l4 4-4 4"/>
                </svg>
                <span class="text-sm font-medium text-blue-300">Güvenlik Çözümleri Bayii</span>
              </div>
              
              {/* Main Title */}
              <h1 class="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span class="text-white">Neden</span>
                <span class="block text-transparent bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text">
                  Ayvera?
                </span>
              </h1>
              
              {/* Description */}
              <p class="text-xl text-gray-300 leading-relaxed mb-8 max-w-lg">
                Kurumsal güvenlik sistemlerinde <span class="text-white font-semibold">tam entegre çözümler.</span> 
                Keşiften kuruluma, satış sonrası desteğe kadar tüm süreçlerde yanınızdayız.
              </p>
              
              {/* Professional CTA */}
              <div class="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/content/iletisim#content" 
                  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Ücretsiz Keşif Talep Et</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link 
                  href="/content/cozumler" 
                  class="border border-gray-400 text-gray-300 hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Çözümlerimizi İnceleyin</span>
                </Link>
              </div>
            </div>
            
            {/* Tech Visual */}
            <div class="relative">
              <div class="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                {/* Modern Güvenlik İkonları */}
                <div class="grid grid-cols-2 gap-6">
                  <div class="flex flex-col items-center text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <h3 class="text-white font-semibold text-sm">Kamera Sistemleri</h3>
                    <p class="text-gray-300 text-xs mt-1">HD & 4K Çözümler</p>
                  </div>
                  
                  <div class="flex flex-col items-center text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                    </div>
                    <h3 class="text-white font-semibold text-sm">Alarm Sistemleri</h3>
                    <p class="text-gray-300 text-xs mt-1">Akıllı Güvenlik</p>
                  </div>
                  
                  <div class="flex flex-col items-center text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                      </svg>
                    </div>
                    <h3 class="text-white font-semibold text-sm">Yangın Sistemleri</h3>
                    <p class="text-gray-300 text-xs mt-1">Erken Uyarı</p>
                  </div>
                  
                  <div class="flex flex-col items-center text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                      </svg>
                    </div>
                    <h3 class="text-white font-semibold text-sm">Geçiş Kontrolü</h3>
                    <p class="text-gray-300 text-xs mt-1">Kartlı Sistem</p>
                  </div>
                </div>
                
                {/* Alt Kısım - Bayilik Bilgisi */}
                <div class="mt-8 pt-6 border-t border-white/10">
                  <div class="text-center">
                    <p class="text-gray-300 text-sm">
                      <span class="text-blue-300 font-semibold">Güvenilir Markalar</span> ile Çalışıyoruz
                    </p>
                    <div class="flex justify-center items-center mt-3 space-x-4">
                      <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div class="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Çözümler Slider Section */}
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-16">
            <div class="inline-flex items-center bg-gray-100 rounded-full px-4 py-2 mb-6">
              <span class="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              <span class="text-sm font-semibold text-gray-700 uppercase tracking-wider">ÇÖZÜMLERİMİZ</span>
            </div>
            <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Teknolojik Güvenlik
              <span class="block text-blue-600">Sistemleri</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Endüstri standardında güvenlik çözümleri ile kurumunuzun güvenliğini sağlıyoruz
            </p>
          </div>
          <Slider data={sliderData} />
        </div>
      </section>

      {/* Hizmetlerimiz - Kurumsal Tasarım */}
      <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-16">
            <div class="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-6">
              <span class="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              <span class="text-sm font-semibold text-blue-700 uppercase tracking-wider">HİZMETLERİMİZ</span>
            </div>
            <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              End-to-End Güvenlik
              <span class="block text-blue-600">Çözüm Süreci</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesyonel ekibimizle keşiften kuruluma, satış sonrası desteğe kadar tüm süreçleri yönetiyoruz
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blocks.map(({ icon: Icon, title, desc }, index) => (
              <div 
                key={title} 
                class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group"
              >
                {/* Step Number */}
                <div class="flex items-center mb-6">
                  <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <Icon class="w-6 h-6 text-white" />
                  </div>
                  <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-sm font-bold text-gray-600">{index + 1}</span>
                  </div>
                </div>
                
                {/* Content */}
                <h3 class="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  {desc}
                </p>
                
                {/* Bottom Line */}
                <div class="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hizmet Alanlarımız - Service Areas */}
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Hizmet <span class="text-blue-600">Alanlarımız</span>
            </h2>
            <p class="text-lg text-gray-600">Güvenlik çözümleri konusunda sunduğumuz hizmetler</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center p-6 group">
              <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Kamera Sistemleri</h3>
              <p class="text-gray-600 text-sm">HD, 4K IP kameralar</p>
            </div>
            
            <div class="text-center p-6 group">
              <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Alarm Sistemleri</h3>
              <p class="text-gray-600 text-sm">Kablosuz alarm çözümleri</p>
            </div>
            
            <div class="text-center p-6 group">
              <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Yangın Sistemleri</h3>
              <p class="text-gray-600 text-sm">Erken uyarı sistemleri</p>
            </div>
            
            <div class="text-center p-6 group">
              <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Geçiş Kontrolü</h3>
              <p class="text-gray-600 text-sm">Kartlı geçiş sistemleri</p>
            </div>
          </div>
        </div>
      </section>

      {/* Güvenilir İş Ortaklarımız - Dynamic Brand Slider */}
      <section class="py-16 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Güvenilir <span class="text-blue-600">İş Ortaklarımız</span>
            </h2>
            <p class="text-gray-600">Sektörün lider markaları ile stratejik iş birlikleri</p>
          </div>
          
          <div class="bg-white rounded-2xl p-8 shadow-lg overflow-hidden">
            {/* Kayan Marka Slider */}
            <div class="relative">
              <div class="flex animate-scroll space-x-8 items-center">
                {brands.value.length > 0 ? (
                  <>
                    {/* İlk Set */}
                    {brands.value.map((brand) => (
                      <div key={brand.id} class="flex items-center justify-center w-32 h-16 flex-shrink-0">
                        <img 
                          src={brand.logo} 
                          alt={brand.name} 
                          title={brand.description}
                          class="max-h-12 max-w-[100px] w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 bg-white rounded"
                        />
                      </div>
                    ))}
                    
                    {/* İkinci Set - Sonsuz döngü için */}
                    {brands.value.map((brand) => (
                      <div key={`${brand.id}-2`} class="flex items-center justify-center w-32 h-16 flex-shrink-0">
                        <img 
                          src={brand.logo} 
                          alt={brand.name} 
                          title={brand.description}
                          class="max-h-12 max-w-[100px] w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 bg-white rounded"
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  /* Fallback - Static brands */
                  <>
                    <div class="flex items-center justify-center w-32 h-16 flex-shrink-0">
                      <img 
                        src="/brands/imou.jpeg" 
                        alt="Imou" 
                        class="max-h-12 max-w-[100px] w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 bg-white rounded"
                      />
                    </div>
                    <div class="flex items-center justify-center w-32 h-16 flex-shrink-0">
                      <img 
                        src="/brands/teletek.jpeg" 
                        alt="Teletek" 
                        class="max-h-12 max-w-[100px] w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 bg-white rounded"
                      />
                    </div>
                    <div class="flex items-center justify-center w-32 h-16 flex-shrink-0">
                      <img 
                        src="/brands/tiandy.jpeg" 
                        alt="Tiandy" 
                        class="max-h-12 max-w-[100px] w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 bg-white rounded"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Alt bilgi */}
            <div class="text-center mt-6 pt-6 border-t border-gray-200">
              <p class="text-sm text-gray-500">
                <span class="font-semibold text-gray-700">{brands.value.length || 11}+</span> güvenilir marka ile iş birliği
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular - Professional FAQ */}
      <section class="py-20 bg-white">
        <div class="max-w-4xl mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan <span class="text-blue-600">Sorular</span>
            </h2>
            <p class="text-lg text-gray-600">Merak ettiklerinizin yanıtları</p>
          </div>
          
          <div class="space-y-4">
            {[
              {
                q: "Alarm sistemlerinizin garantisi var mı?",
                a: "Tüm ürünlerimiz ve kurulumlarımız 2 yıl garantilidir. Ayrıca isteğe bağlı olarak ek garanti ve bakım paketleri sunuyoruz."
              },
              {
                q: "Kurulumdan sonra teknik destek alabilir miyim?",
                a: "Evet, 7/24 teknik destek hattımız ve uzaktan destek imkanımız mevcuttur."
              },
              {
                q: "Fiyat teklifi almak için ne yapmalıyım?",
                a: "İletişim formumuzu doldurabilir veya doğrudan bizi arayarak ücretsiz keşif ve teklif talebinde bulunabilirsiniz."
              }
            ].map((item, index) => (
              <details key={index} class="group bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
                <summary class="font-semibold text-gray-900 cursor-pointer p-6 flex items-center justify-between">
                  <span>{item.q}</span>
                  <svg class="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <div class="px-6 pb-6 text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Professional CTA */}
      <section class="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div class="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 class="text-3xl lg:text-4xl font-bold mb-6">
            Güvenlik İhtiyaçlarınız İçin
            <span class="block">Hemen İletişime Geçin</span>
          </h2>
          <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz size özel çözümler sunmak için hazır. 
            Ücretsiz keşif ve danışmanlık hizmeti.
          </p>
          
          <Link
            href="/content/iletisim#content" 
            class="inline-flex items-center bg-white text-blue-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span>İletişime Geçin</span>
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      <StatsBar />
      <Cozumler />
    </div>
  );
});