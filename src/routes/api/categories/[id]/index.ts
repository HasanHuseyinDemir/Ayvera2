import type { RequestEvent } from '@builder.io/qwik-city';
import { readCategories, updateCategory, deleteCategory } from '~/services/db.js';

export const onGet = async ({ params }: RequestEvent) => {
  try {
    const categories = await readCategories();
    const category = categories.find((c: any) => String(c.id) === String(params.id));
    
    if (!category) {
      return new Response(JSON.stringify({ error: 'Kategori bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(category), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('API: Category GET hatası:', error);
    return new Response(JSON.stringify({ error: 'Kategori yüklenemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onPut = async ({ params, request }: RequestEvent) => {
  console.log('🔄 API: PUT /api/categories/' + params.id + ' çağrıldı');
  try {
    const updates = await request.json();
    console.log('📥 Kategori güncelleme verisi:', updates);
    
    const updated = await updateCategory(params.id, updates);
    console.log('✅ Kategori güncellendi:', updated);
    
    if (!updated) {
      return new Response(JSON.stringify({ error: 'Kategori bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Kategori güncellenemedi:', error);
    return new Response(JSON.stringify({ error: 'Kategori güncellenemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onDelete = async ({ params }: RequestEvent) => {
  console.log('🗑️ API: DELETE /api/categories/' + params.id + ' çağrıldı');
  try {
    await deleteCategory(params.id);
    console.log('✅ Kategori silindi, ID:', params.id);
    return new Response(JSON.stringify({ success: true, message: 'Kategori silindi' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Kategori silinemedi:', error);
    return new Response(JSON.stringify({ error: 'Kategori silinemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
