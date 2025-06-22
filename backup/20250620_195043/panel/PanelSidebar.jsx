import { component$, $ } from '@builder.io/qwik';

export const PanelSidebar = component$(({ activeTab, tabs, isOpen, onClose$ }) => {
  const getIcon = (iconName) => {
    const icons = {
      home: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      ),
      mail: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
      box: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      ),
      tag: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
      ),
      grid: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      ),
      settings: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      )
    };
    return icons[iconName] || icons.home;
  };

  const handleTabClick = $((tabId) => {
    activeTab.value = tabId;
    if (onClose$) {
      onClose$();
    }
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          class="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick$={onClose$}
        />
      )}

      {/* Sidebar */}
      <aside class={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isOpen ? 'lg:w-64' : 'lg:w-16'}
      `}>
        <div class="flex flex-col h-full">
          {/* Logo Area */}
          <div class="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
            {isOpen ? (
              <div class="flex items-center space-x-2">
                <img src="/ayvera.svg" alt="Ayvera" class="w-8 h-8" />
                <span class="text-lg font-bold text-white">Panel</span>
              </div>
            ) : (
              <img src="/ayvera.svg" alt="Ayvera" class="w-8 h-8" />
            )}
          </div>

          {/* Navigation */}
          <nav class="flex-1 px-2 py-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick$={() => handleTabClick(tab.id)}
                class={`
                  w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors
                  ${activeTab.value === tab.id
                    ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${isOpen ? 'justify-start space-x-3' : 'justify-center'}
                `}
                title={!isOpen ? tab.name : undefined}
              >
                {getIcon(tab.icon)}
                {isOpen && <span>{tab.name}</span>}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div class="p-4 border-t border-gray-200">
            <div class={`text-xs text-gray-500 ${isOpen ? 'text-center' : 'hidden'}`}>
              <p>Ayvera Güvenlik</p>
              <p>Yönetim Paneli v1.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});
