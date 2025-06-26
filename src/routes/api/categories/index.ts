import type { RequestEvent } from '@builder.io/qwik-city';
import { readCategories, addCategory } from '~/services/db.js';

export const onGet = async () => {
  console.log('📁 API: GET /api/categories çağrıldı');
  try {
    const categories = await readCategories();
    console.log('✅ Categories bulundu:', categories.length);
    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Categories GET hatası:', error);
    return new Response(JSON.stringify({ error: 'Kategoriler yüklenemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onPost = async ({ request }: RequestEvent) => {
  console.log('🚀 API: POST /api/categories çağrıldı');
  try {
    const category = await request.json();
    console.log('📥 Gelen kategori verisi:', category);
    
    // Validasyon
    if (!category.name) {
      return new Response(JSON.stringify({ error: 'Kategori adı gerekli' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const newCategory = await addCategory(category);
    console.log('✅ Yeni kategori eklendi:', newCategory);
    return new Response(JSON.stringify(newCategory), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Category POST hatası:', error);
    return new Response(JSON.stringify({ error: 'Kategori eklenemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
