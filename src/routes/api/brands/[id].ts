import type { RequestEvent } from '@builder.io/qwik-city';
import { updateBrand, deleteBrand } from '~/services/db.js';

export const onPut = async ({ request, params }: RequestEvent) => {
  try {
    const id = params.id;
    const updates = await request.json();
    const updated = await updateBrand(id, updates);
    if (!updated) {
      return new Response(JSON.stringify({ error: 'Marka bulunamadı' }), { status: 404 });
    }
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Marka güncellenemedi' }), { status: 500 });
  }
};

export const onDelete = async ({ params }: RequestEvent) => {
  try {
    const id = params.id;
    await deleteBrand(id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Marka silinemedi' }), { status: 500 });
  }
};
