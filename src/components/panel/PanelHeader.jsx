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
              <h1 class="text-xl font-bold text-gray-900">Ayvera Panel</h1>
            </div>
          </div>
          {/* Sağ Taraf - Sadece Çıkış Butonu */}
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
    </header>
  );
});
