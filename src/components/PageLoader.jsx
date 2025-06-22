import { component$ } from '@builder.io/qwik';

export const PageLoader = component$(() => {
  return (
    <div class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="text-center">
        {/* Ana loading spinner */}
        <div class="relative">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div class="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2" style="animation-duration: 0.8s;"></div>
        </div>
        
        {/* Loading text */}
        <div class="text-gray-600 font-medium">
          <div class="flex items-center justify-center space-x-1">
            <span>Yükleniyor</span>
            <div class="flex space-x-1">
              <span class="animate-bounce" style="animation-delay: 0ms;">.</span>
              <span class="animate-bounce" style="animation-delay: 150ms;">.</span>
              <span class="animate-bounce" style="animation-delay: 300ms;">.</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div class="w-48 h-1 bg-gray-200 rounded-full mt-4 mx-auto overflow-hidden">
          <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
});

export const MiniLoader = component$(() => {
  return (
    <div class="inline-flex items-center text-current">
      <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1 opacity-60"></div>
      <span class="text-xs opacity-75">Yükleniyor</span>
    </div>
  );
});
