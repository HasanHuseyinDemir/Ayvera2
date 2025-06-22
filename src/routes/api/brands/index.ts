import type { RequestEvent } from '@builder.io/qwik-city';
import { readBrands, addBrand } from '~/services/db.js';

export const onGet = async (_requestEvent: RequestEvent) => {
  console.log('🏷️ API: GET /api/brands çağrıldı');
  try {
    const brands = await readBrands();
    console.log('✅ Brands bulundu:', brands.length);
    return new Response(JSON.stringify(brands), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Brands GET hatası:', error);
    return new Response(JSON.stringify({ error: 'Markalar yüklenemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onPost = async ({ request }: RequestEvent) => {
  console.log('🚀 API: POST /api/brands çağrıldı');
  try {
    const brand = await request.json();
    console.log('📥 Gelen marka verisi:', brand);
    
    // Validasyon
    if (!brand.name || !brand.logo) {
      return new Response(JSON.stringify({ error: 'Marka adı ve logo gerekli' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const newBrand = await addBrand(brand);
    console.log('✅ Yeni marka eklendi:', newBrand);
    return new Response(JSON.stringify(newBrand), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Brand POST hatası:', error);
    return new Response(JSON.stringify({ error: 'Marka eklenemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
