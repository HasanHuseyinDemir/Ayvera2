import { component$, $ } from '@builder.io/qwik';

export const PanelLogin = component$(({ password, error, onLogin$ }) => {
  const handleSubmit = $(async (e) => {
    e.preventDefault();
    await onLogin$(password.value);
  });

  const handleKeyDown = $(async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await onLogin$(password.value);
    }
  });

  return (
    <form preventdefault:submit onSubmit$={handleSubmit} class="space-y-6">
      <div>
        <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
          Panel Şifresi
        </label>
        <input
          type="password"
          id="password"
          value={password.value}
          onInput$={(e) => password.value = e.target.value}
          onKeyDown$={handleKeyDown}
          placeholder="Şifrenizi girin..."
          class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          autoComplete="current-password"
          required
        />
      </div>

      {error.value && (
        <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p class="text-red-300 text-sm text-center">{error.value}</p>
        </div>
      )}

      <button
        type="submit"
        class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        <span class="flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
          </svg>
          <span>Giriş Yap</span>
        </span>
      </button>

      <div class="text-center">
        <p class="text-xs text-gray-400">
          🔒 Bu alan yalnızca yetkili kullanıcılar içindir
        </p>
      </div>
    </form>
  );
});
