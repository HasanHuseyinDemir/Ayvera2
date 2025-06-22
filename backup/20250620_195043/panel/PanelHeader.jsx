import { component$, $ } from '@builder.io/qwik';

export const PanelHeader = component$(({ onLogout$, onToggleSidebar$, sidebarOpen }) => {
  const handleLogout = $(async () => {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      await onLogout$();
    }
  });

  return (
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          {/* Sol Taraf - Logo ve Menü */}
          <div class="flex items-center space-x-4">
            <button
              onClick$={onToggleSidebar$}
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Menüyü aç/kapat"
            >
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <div class="flex items-center space-x-3">
              <img src="/ayvera.svg" alt="Ayvera" class="w-8 h-8" />
              <div>
                <h1 class="text-xl font-bold text-gray-900">Ayvera Panel</h1>
                <p class="text-sm text-gray-500 hidden sm:block">Yönetim Sistemi</p>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Kullanıcı Menüsü */}
          <div class="flex items-center space-x-4">
            {/* Bildirimler */}
            <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profil Menüsü */}
            <div class="relative">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div class="hidden sm:block">
                  <p class="text-sm font-medium text-gray-900">Yönetici</p>
                  <p class="text-xs text-gray-500">admin@ayvera.com</p>
                </div>
              </div>
            </div>

            {/* Çıkış Butonu */}
            <button
              onClick$={handleLogout}
              class="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-gray-600"
              title="Çıkış Yap"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});
