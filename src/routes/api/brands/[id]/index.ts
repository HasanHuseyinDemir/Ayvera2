import type { RequestEvent } from '@builder.io/qwik-city';
import { readBrands, updateBrand, deleteBrand } from '~/services/db.js';

export const onGet = async ({ params }: RequestEvent) => {
  try {
    const brands = await readBrands();
    const brand = brands.find((b: any) => String(b.id) === String(params.id));
    
    if (!brand) {
      return new Response(JSON.stringify({ error: 'Marka bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(brand), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('API: Brand GET hatası:', error);
    return new Response(JSON.stringify({ error: 'Marka yüklenemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onPut = async ({ params, request }: RequestEvent) => {
  console.log('🔄 API: PUT /api/brands/' + params.id + ' çağrıldı');
  try {
    const updates = await request.json();
    console.log('📥 Marka güncelleme verisi:', updates);
    
    const updated = await updateBrand(params.id, updates);
    console.log('✅ Marka güncellendi:', updated);
    
    if (!updated) {
      return new Response(JSON.stringify({ error: 'Marka bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Marka güncellenemedi:', error);
    return new Response(JSON.stringify({ error: 'Marka güncellenemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onDelete = async ({ params }: RequestEvent) => {
  console.log('🗑️ API: DELETE /api/brands/' + params.id + ' çağrıldı');
  try {
    await deleteBrand(params.id);
    console.log('✅ Marka silindi, ID:', params.id);
    return new Response(JSON.stringify({ success: true, message: 'Marka silindi' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Marka silinemedi:', error);
    return new Response(JSON.stringify({ error: 'Marka silinemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
