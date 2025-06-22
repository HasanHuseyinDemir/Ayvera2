import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { MiniLoader } from '../PageLoader';

export const Navigator = component$((props) => {
  const isLoading = useSignal(false);
  
  // Çözümler sayfası için #content hash'i ekle, diğerleri için normal URL
  const href = props.url === '/content/cozumler/' ? 
    props.url + '#content' : 
    props.url;
    
  return (
    <Link 
      href={href}
      onClick$={() => {
        isLoading.value = true;
        // Loading durumunu kısa süre sonra kapat
        setTimeout(() => {
          isLoading.value = false;
        }, 1000);
      }}
    >
      <div class="flex items-center space-x-2">
        {isLoading.value ? (
          <MiniLoader />
        ) : (
          <span class="hover:text-gray-300 font-semibold transition-colors duration-500 cursor-pointer">
            {props.name.toUpperCase()}
          </span>
        )}
      </div>
    </Link>
  );
});