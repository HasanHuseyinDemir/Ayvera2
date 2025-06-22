import { component$ } from '@builder.io/qwik';

export const HeroSection = component$(({ productCount }) => {
  return (
    <div class="text-center max-w-4xl mx-auto py-8">
      <div class="mb-6">
        <h1 class="text-4xl md:text-5xl font-bold mb-2 text-gray-900 leading-tight">
          Güvenlik Çözümlerimiz
        </h1>
        <div class="w-24 h-1 bg-blue-600 rounded-full mx-auto mb-4"></div>
      </div>
      <p class="text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl mx-auto">
        Profesyonel güvenlik sistemleri ile mekanınızı koruyun. 
        En son teknoloji ürünleri ve uzman kurulum hizmeti.
      </p>
      
      {/* Stats */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div class="text-2xl font-bold text-blue-600 mb-1">{productCount}+</div>
          <div class="text-sm text-gray-600">Ürün Çeşidi</div>
        </div>
        <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div class="text-2xl font-bold text-blue-600 mb-1">5+</div>
          <div class="text-sm text-gray-600">Kategori</div>
        </div>
        <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div class="text-2xl font-bold text-green-600 mb-1">%100</div>
          <div class="text-sm text-gray-600">Kalite</div>
        </div>
      </div>
    </div>
  );
});
