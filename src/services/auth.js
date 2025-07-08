// Panel Authentication Utilities

/**
 * Client-side session kontrolü
 */
export function checkPanelSession() {
  if (typeof window === 'undefined') return false;
  
  const sessionCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('panel-session='));
  
  if (!sessionCookie) return false;
  
  const sessionValue = sessionCookie.split('=')[1];
  return sessionValue && sessionValue.startsWith('panel-authenticated-');
}

/**
 * Panel session'ını temizle
 */
export function clearPanelSession() {
  if (typeof window === 'undefined') return;
  
  document.cookie = 'panel-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  console.log('🔒 Panel session temizlendi');
}

/**
 * Panel session oluştur
 */
export function createPanelSession() {
  if (typeof window === 'undefined') return;
  
  const sessionId = `panel-authenticated-${Date.now()}`;
  const expires = new Date();
  expires.setHours(expires.getHours() + 24); // 24 saat geçerli
  
  document.cookie = `panel-session=${sessionId}; expires=${expires.toUTCString()}; path=/;`;
  console.log('✅ Panel session oluşturuldu');
  
  return sessionId;
}

/**
 * Panel route koruması - Client-side redirect
 */
export function protectPanelRoute() {
  if (typeof window === 'undefined') return true; // Server-side'da middleware halledecek
  
  if (!checkPanelSession()) {
    console.log('🔒 Panel erişim reddedildi - Client session yok');
    window.location.href = '/panel';
    return false;
  }
  
  return true;
}
