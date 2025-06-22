import type { RequestEvent } from '@builder.io/qwik-city';
import { readProducts, deleteProduct, updateProduct } from '~/services/db.js';

// GET: id ile ürün
export const onGet = async ({ params }: RequestEvent) => {
  try {
    const products = await readProducts();
    const product = products.find((p: any) => String(p.id) === String(params.id));
    if (!product) {
      return new Response(JSON.stringify({ error: 'Ürün bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Ürün bulunamadı:', error);
    return new Response(JSON.stringify({ error: 'Ürün yüklenemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT: Ürün güncelle
export const onPut = async ({ params, request }: RequestEvent) => {
  console.log('🔄 API: PUT /api/products/' + params.id + ' çağrıldı');
  try {
    const updates = await request.json();
    console.log('📥 Güncelleme verisi:', updates);
    
    const updatedProduct = await updateProduct(params.id, updates);
    console.log('✅ Ürün güncellendi:', updatedProduct);
    
    if (!updatedProduct) {
      return new Response(JSON.stringify({ error: 'Ürün bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(updatedProduct), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Ürün güncellenemedi:', error);
    return new Response(JSON.stringify({ 
      error: 'Ürün güncellenemedi',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE: Ürün sil
export const onDelete = async ({ params }: RequestEvent) => {
  console.log('🗑️ API: DELETE /api/products/' + params.id + ' çağrıldı');
  try {
    await deleteProduct(params.id);
    console.log('✅ Ürün silindi, ID:', params.id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Ürün silinemedi:', error);
    return new Response(JSON.stringify({ error: 'Ürün silinemedi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
