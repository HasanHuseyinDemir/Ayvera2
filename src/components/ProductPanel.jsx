import { component$ } from '@builder.io/qwik';

export const ProductPanel = component$(({ products, brands }) => {
  return (
    <div class="flex flex-col space-y-4">
      {/* Başlık */}
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold text-blue-800">Ürün Listesi</h2>
        <div class="text-sm text-gray-600">{products.length} ürün</div>
      </div>

      {/* Tek Sütun Liste */}
      <div class="space-y-2">
        {products.map((product) => (
          <div key={product.id} class="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-start gap-3">
              <img 
                src={product.img} 
                alt={product.title}
                class="w-16 h-16 object-contain rounded bg-gray-50"
              />
              <div class="flex-1 min-w-0 flex flex-col gap-1">
                <h3 class="font-semibold text-blue-800">{product.title}</h3>
                <div class="text-sm text-blue-600">{product.brand}</div>
                <p class="text-gray-600 text-sm">{product.desc}</p>
                <div class="flex gap-2 mt-2">
                  <button class="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200">
                    Düzenle
                  </button>
                  <button class="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200">
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Boş Durum */}
      {products.length === 0 && (
        <div class="text-center py-6">
          <p class="text-gray-500 text-sm">Henüz ürün eklenmemiş</p>
        </div>
      )}
    </div>
  );
});

export default ProductPanel;
