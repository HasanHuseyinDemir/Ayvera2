import { component$, useSignal, $, useStore, useTask$ } from '@builder.io/qwik';
import { PanelLogin } from '~/components/panel/PanelLogin';
import { PanelLayout } from '~/components/panel/PanelLayout';
import { createPanelSession, clearPanelSession } from '~/services/auth.js';

export const head = {
  title: 'Yönetim Paneli | Ayvera Güvenlik',
  meta: [
    { name: 'description', content: 'Ayvera Güvenlik yönetim paneli - Ürün yönetimi' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
};

export default component$(() => {
  const password = useSignal('');
  const error = useSignal('');
  const state = useStore({ isAuth: true }); // TEST: Otomatik giriş
  const config = useStore({ panelPassword: 'admin123', loaded: true });

  // TEST: Sayfa yüklendiğinde otomatik giriş yap
  useTask$(async () => {
    state.isAuth = true;
    if (typeof window !== 'undefined') {
      createPanelSession(); // Session oluştur
    }
  });

  const handleLogin = $(async (inputPassword) => {
    if (!inputPassword || inputPassword.trim() === '') {
      error.value = 'Şifre girmeniz gerekiyor!';
      return;
    }
    
    if (inputPassword.trim() === config.panelPassword) {
      state.isAuth = true;
      error.value = '';
      
      // Session cookie oluştur
      createPanelSession();
      
    } else {
      error.value = 'Hatalı şifre!';
      password.value = '';
    }
  });

  const handleLogout = $(() => {
    state.isAuth = false;
    password.value = '';
    error.value = '';
    
    // Session cookie'sini sil
    clearPanelSession();
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {!state.isAuth ? (
        // Giriş ekranı
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="w-full max-w-md">
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
              <div class="text-center mb-8">
                <div class="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h1 class="text-2xl font-bold text-white mb-2">Yönetim Paneli</h1>
                <p class="text-gray-300 text-sm">Test şifresi: admin123</p>
              </div>

              <PanelLogin 
                password={password}
                error={error}
                onLogin$={handleLogin}
              />
            </div>
          </div>
        </div>
      ) : (
        // TEST BİLEŞENİ - Signal test için
        <div>
          <hr class="my-8" />
          <PanelLayout onLogout$={handleLogout} />
        </div>
      )}
    </div>
  );
});
