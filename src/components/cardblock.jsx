import { Link } from '@builder.io/qwik-city';

export const CardBlock = ({
  title,
  bgImage,
  children,
  textColor = 'text-white',
  overlayClass = 'bg-gradient-to-br from-black/80 via-black/70 to-black/50', 
  className = '',
}) => {
  const finalBaseContainerClasses = `
    relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl
    min-w-[280px] md:min-w-[320px] h-[240px]
    transition-all duration-500 ease-in-out
    group cursor-pointer transform hover:scale-[1.01] hover:-translate-y-1
    border border-white/10 backdrop-blur-sm
    flex-1 
  `;

  const contentWrapperClasses = `
    absolute inset-0 z-30 
    flex flex-col justify-center items-center
    p-8 text-center
    ${textColor}
  `;

  return (
    <Link 
      href={`/content/cozumler?category=${encodeURIComponent(title)}#content`}
      class={`${finalBaseContainerClasses} ${className}`.trim().replace(/\s+/g, ' ')}
    >
      {/* Background Image with Parallax Effect */}
      <div
        class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />
      
      {/* Professional Gradient Overlay */}
      <div class={`absolute inset-0 z-10 ${overlayClass}`} />
      
      {/* Subtle Pattern Overlay */}
      <div class="absolute inset-0 z-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
           style={{
             backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`
           }} />
      
      {/* Content */}
      <div class={contentWrapperClasses}>
        {/* Title */}
        <h2 class="text-2xl md:text-3xl font-bold mb-3 leading-tight drop-shadow-lg group-hover:text-blue-100 transition-colors duration-300">
          {title}
        </h2>
        
        {/* Subtitle/Description */}
        <div class="text-sm md:text-base text-blue-100/90 font-medium leading-relaxed drop-shadow-sm">
          {children ? children : 'Profesyonel çözümler için tıklayın'}
        </div>
        
        {/* Call to Action Arrow */}
        <div class="mt-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            <span class="text-sm font-semibold">Keşfet</span>
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Premium Border Effect */}
      <div class="absolute inset-0 z-40 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Link>
  );
};

export default CardBlock;