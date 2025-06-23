import type { RequestEvent } from '@builder.io/qwik-city';
import { readProducts, addProduct } from '~/services/db.js';

// GET: Tüm ürünler
export const onGet = async () => {
  console.log('API: GET /api/products çağrıldı');
  try {
    console.log('API: readProducts fonksiyonu çağrılıyor...');
    const products = await readProducts();
    console.log('API: Ürünler bulundu:', products.length);
    
    // JSON response'u döndür
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('API: Ürünler okunamadı:', error);
    console.error('API: Hata stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Ürünler yüklenemedi', 
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// POST: Yeni ürün ekle
export const onPost = async ({ request }: RequestEvent) => {
  console.log('🚀 API: POST /api/products çağrıldı');
  try {
    const product = await request.json();
    console.log('📥 Gelen ürün verisi:', product);
    
    const newProduct = await addProduct(product);
    console.log('✅ Yeni ürün eklendi:', newProduct);
    
    return new Response(JSON.stringify(newProduct), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('❌ Ürün eklenemedi:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Ürün eklenemedi',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

