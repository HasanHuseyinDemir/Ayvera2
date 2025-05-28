export const CardBlock = ({
  title,
  bgImage,
  children,
  textColor = 'text-white',
  overlayClass = 'bg-black/40', 
  className = '',
}) => {
  const finalBaseContainerClasses = `
    p-6 rounded-lg shadow-xl 
    min-w-[280px] md:min-w-[300px] 
    overflow-hidden group relative text-center cursor-pointer
    flex-1 
  `;

  const contentWrapperClasses = `
    relative z-20 
    flex flex-col p-6 
    h-full               
    items-center         
    justify-center
    ${textColor}
  `;

  return (
    <div
      class={`${finalBaseContainerClasses} ${className}`.trim().replace(/\s+/g, ' ')}
    >
      <div
        class={`
          absolute inset-0 z-0 
          bg-cover bg-center 
          transition-transform duration-500 ease-in-out
          group-hover:scale-110 
        `}
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
      </div>

      {overlayClass && (
        <div class={`absolute inset-0 z-10 ${overlayClass} rounded-sm `}></div>
      )}

      <div class={contentWrapperClasses}>
        <h2 class="text-2xl font-bold select-none mb-3">
          {title}
        </h2>
        <div class="text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CardBlock;