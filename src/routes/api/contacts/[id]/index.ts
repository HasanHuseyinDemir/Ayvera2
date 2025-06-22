import type { RequestHandler } from '@builder.io/qwik-city';

export const onDelete: RequestHandler = async ({ params, json }) => {
  try {
    const contactId = params.id;
    
    if (!contactId) {
      json(400, { success: false, error: 'Contact ID gerekli' });
      return;
    }
    
    const { deleteContact } = await import('~/services/db.js');
    const result = await deleteContact(contactId);
    
    if (result.success) {
      console.log('✅ API: Contact silindi:', contactId);
      json(200, { success: true, message: result.message });
    } else {
      console.error('❌ API: Contact silme hatası:', result.error);
      json(400, { success: false, error: result.error });
    }
    
  } catch (error) {
    console.error('❌ API: Contact silme endpoint hatası:', error);
    json(500, { success: false, error: 'Sunucu hatası' });
  }
};

export const onPatch: RequestHandler = async ({ params, request, json }) => {
  try {
    const contactId = params.id;
    const { status } = await request.json();
    
    if (!contactId) {
      json(400, { success: false, error: 'Contact ID gerekli' });
      return;
    }
    
    if (!status || !['new', 'read', 'replied'].includes(status)) {
      json(400, { success: false, error: 'Geçerli status gerekli (new, read, replied)' });
      return;
    }
    
    const { updateContactStatus } = await import('~/services/db.js');
    const result = await updateContactStatus(contactId, status);
    
    if (result.success) {
      console.log('✅ API: Contact durumu güncellendi:', contactId, 'status:', status);
      json(200, { success: true, contact: result.contact });
    } else {
      console.error('❌ API: Contact durum güncelleme hatası:', result.error);
      json(400, { success: false, error: result.error });
    }
    
  } catch (error) {
    console.error('❌ API: Contact durum güncelleme endpoint hatası:', error);
    json(500, { success: false, error: 'Sunucu hatası' });
  }
};
