import { component$, Slot } from '@builder.io/qwik';

export const CardContainer = component$(() => {
  return       <div class="
        grid
        grid-cols-1    
        md:grid-cols-2  
        lg:grid-cols-3 
        gap-6             
        p-4                
        max-w-7xl          
        mx-auto            
        my-8
      ">
        <Slot/>
      </div>
});