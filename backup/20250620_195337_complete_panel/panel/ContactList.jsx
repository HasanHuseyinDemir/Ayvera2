import { component$, useStore, useTask$, $, useSignal } from '@builder.io/qwik';

export const ContactList = component$(() => {
  const contacts = useStore({ data: [], loaded: false, error: null });
  const selectedContact = useSignal(null);
  const deleteModal = useSignal({ show: false, contactId: null });
  const loading = useSignal(false);

  // İletişim mesajlarını yükle
  useTask$(async () => {
    try {
      if (typeof window !== 'undefined') {
        const { readContacts } = await import('~/services/db.js');
        const data = await readContacts();
        contacts.data = data || [];
        contacts.loaded = true;
        console.log('✅ İletişim mesajları yüklendi:', contacts.data.length);
      }
    } catch (error) {
      console.error('❌ İletişim mesajları yükleme hatası:', error);
      contacts.error = 'Mesajlar yüklenirken hata oluştu.';
      contacts.loaded = true;
    }
  });

  // Mesaj detayını göster
  const showDetails = $((contact) => {
    selectedContact.value = contact;
  });

  // Detay modalını kapat
  const closeDetails = $(() => {
    selectedContact.value = null;
  });

  // Silme modalını aç
  const confirmDelete = $((contactId) => {
    deleteModal.value = { show: true, contactId };
  });

  // Silme modalını kapat
  const cancelDelete = $(() => {
    deleteModal.value = { show: false, contactId: null };
  });

  // Mesaj sil
  const deleteContact = $(async () => {
    if (!deleteModal.value.contactId) return;
    
    try {
      loading.value = true;
      const response = await fetch(`/api/contacts/${deleteModal.value.contactId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        contacts.data = contacts.data.filter(c => c.id !== deleteModal.value.contactId);
        deleteModal.value = { show: false, contactId: null };
        console.log('✅ Mesaj silindi');
      } else {
        alert('Mesaj silinirken hata oluştu.');
      }
    } catch (error) {
      console.error('❌ Mesaj silme hatası:', error);
      alert('Mesaj silinirken hata oluştu.');
    } finally {
      loading.value = false;
    }
  });

  // Mesaj durumunu güncelle
  const updateStatus = $(async (contactId, newStatus) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const contactIndex = contacts.data.findIndex(c => c.id === contactId);
        if (contactIndex !== -1) {
          contacts.data[contactIndex].status = newStatus;
        }
        console.log('✅ Mesaj durumu güncellendi');
      } else {
        alert('Durum güncellenirken hata oluştu.');
      }
    } catch (error) {
      console.error('❌ Durum güncelleme hatası:', error);
      alert('Durum güncellenirken hata oluştu.');
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'replied': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'Yeni';
      case 'read': return 'Okundu';
      case 'replied': return 'Cevaplandı';
      default: return 'Bilinmiyor';
    }
  };

  if (!contacts.loaded) {
    return (
      <div class="p-6">
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div class="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} class="bg-white p-4 rounded-lg shadow">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">İletişim Mesajları</h1>
          <p class="text-gray-600 mt-2">Gelen iletişim formlarını yönetin</p>
        </div>
        <div class="text-sm text-gray-500">
          Toplam: {contacts.data.length} mesaj
        </div>
      </div>

      {contacts.error && (
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800">{contacts.error}</p>
        </div>
      )}

      {contacts.data.length === 0 ? (
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Henüz mesaj yok</h3>
          <p class="text-gray-500">İletişim formu üzerinden gelen mesajlar burada görüntülenecek.</p>
        </div>
      ) : (
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konu
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {contacts.data.map((contact) => (
                  <tr key={contact.id} class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div class="text-sm text-gray-500">{contact.email}</div>
                        <div class="text-sm text-gray-500">{contact.phone}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900 max-w-xs truncate">{contact.subject}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <select
                        value={contact.status}
                        onChange$={(e) => updateStatus(contact.id, e.target.value)}
                        class={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(contact.status)}`}
                      >
                        <option value="new">Yeni</option>
                        <option value="read">Okundu</option>
                        <option value="replied">Cevaplandı</option>
                      </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick$={() => showDetails(contact)}
                        class="text-blue-600 hover:text-blue-900"
                      >
                        Detay
                      </button>
                      <button
                        onClick$={() => confirmDelete(contact.id)}
                        class="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detay Modal */}
      {selectedContact.value && (
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-900">Mesaj Detayı</h3>
              <button
                onClick$={closeDetails}
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <p class="mt-1 text-sm text-gray-900">{selectedContact.value.name}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">E-posta</label>
                  <p class="mt-1 text-sm text-gray-900">{selectedContact.value.email}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Telefon</label>
                  <p class="mt-1 text-sm text-gray-900">{selectedContact.value.phone}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Tarih</label>
                  <p class="mt-1 text-sm text-gray-900">{formatDate(selectedContact.value.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Konu</label>
                <p class="mt-1 text-sm text-gray-900">{selectedContact.value.subject}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Mesaj</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.value.message}</p>
                </div>
              </div>

              {selectedContact.value.ip && (
                <div>
                  <label class="block text-sm font-medium text-gray-700">IP Adresi</label>
                  <p class="mt-1 text-sm text-gray-500">{selectedContact.value.ip}</p>
                </div>
              )}
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button
                onClick$={closeDetails}
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Kapat
              </button>
              <a
                href={`mailto:${selectedContact.value.email}?subject=Re: ${selectedContact.value.subject}`}
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                E-posta Gönder
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Silme Onay Modal */}
      {deleteModal.value.show && (
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3 text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 class="text-lg leading-6 font-medium text-gray-900 mt-2">Mesajı Sil</h3>
              <div class="mt-2 px-7 py-3">
                <p class="text-sm text-gray-500">
                  Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
              </div>
              <div class="flex justify-center space-x-3 mt-4">
                <button
                  onClick$={cancelDelete}
                  disabled={loading.value}
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  onClick$={deleteContact}
                  disabled={loading.value}
                  class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading.value ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
