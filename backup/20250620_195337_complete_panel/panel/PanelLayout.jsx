import { component$, useSignal, useStore } from '@builder.io/qwik';
import { PanelHeader } from './PanelHeader';
import { PanelSidebar } from './PanelSidebar';
import { ContactList } from './ContactList';
import { ProductList } from './ProductList';
import { BrandList } from './BrandList';

export const PanelLayout = component$(({ onLogout$ }) => {
  const activeTab = useSignal('dashboard');
  const sidebarOpen = useSignal(false);

  const tabs = [
    { id: 'dashboard', name: 'Panel', icon: 'home' },
    { id: 'contacts', name: 'İletişim', icon: 'mail' },
    { id: 'products', name: 'Ürünler', icon: 'box' },
    { id: 'brands', name: 'Markalar', icon: 'tag' },
    { id: 'categories', name: 'Kategoriler', icon: 'grid' },
    { id: 'settings', name: 'Ayarlar', icon: 'settings' }
  ];

  const renderTabContent = () => {
    switch (activeTab.value) {
      case 'dashboard':
        return <DashboardContent />;
      case 'contacts':
        return <ContactList />;
      case 'products':
        return <ProductList />;
      case 'brands':
        return <BrandList />;
      case 'categories':
        return <CategoriesContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <PanelHeader 
        onLogout$={onLogout$}
        onToggleSidebar$={() => sidebarOpen.value = !sidebarOpen.value}
        sidebarOpen={sidebarOpen.value}
      />

      <div class="flex">
        {/* Sidebar */}
        <PanelSidebar 
          activeTab={activeTab}
          tabs={tabs}
          isOpen={sidebarOpen.value}
          onClose$={() => sidebarOpen.value = false}
        />

        {/* Main Content */}
        <main class={`flex-1 transition-all duration-300 ${sidebarOpen.value ? 'lg:ml-64' : 'lg:ml-16'}`}>
          <div class="p-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
});

// Dashboard İçeriği
const DashboardContent = component$(() => {
  const stats = useStore({
    totalContacts: 0,
    totalProducts: 0,
    totalBrands: 0,
    loaded: false
  });

  return (
    <div class="space-y-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
        <p class="text-gray-600 mt-2">Ayvera Güvenlik yönetim sistemi</p>
      </div>

      {/* İstatistik Kartları */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Toplam İletişim</p>
              <p class="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Toplam Ürün</p>
              <p class="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Toplam Marka</p>
              <p class="text-2xl font-bold text-gray-900">{stats.totalBrands}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Sistem Durumu</p>
              <p class="text-2xl font-bold text-green-600">Aktif</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hızlı Aksiyonlar */}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Yeni Ürün Ekle</p>
                <p class="text-sm text-gray-500">Kataloga ürün ekleyin</p>
              </div>
            </div>
          </button>

          <button class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Yeni Marka Ekle</p>
                <p class="text-sm text-gray-500">Marka katalogu genişletin</p>
              </div>
            </div>
          </button>

          <button class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Mesajları Kontrol Et</p>
                <p class="text-sm text-gray-500">Gelen iletişim formları</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
});

// Kategoriler İçeriği (Placeholder)
const CategoriesContent = component$(() => {
  return (
    <div class="space-y-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Kategori Yönetimi</h1>
        <p class="text-gray-600 mt-2">Ürün kategorilerini yönetin</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Kategori Yönetimi</h3>
        <p class="text-gray-500 mb-4">Bu bölüm yakında kullanıma açılacak</p>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Kategori Ekle
        </button>
      </div>
    </div>
  );
});

// Ayarlar İçeriği (Placeholder)
const SettingsContent = component$(() => {
  return (
    <div class="space-y-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
        <p class="text-gray-600 mt-2">Panel ve sistem ayarlarını yönetin</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Sistem Ayarları</h3>
        <p class="text-gray-500 mb-4">Panel şifresi, mail ayarları ve sistem konfigürasyonu</p>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Ayarları Düzenle
        </button>
      </div>
    </div>
  );
});
