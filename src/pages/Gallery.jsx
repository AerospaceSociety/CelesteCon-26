import React from 'react';
import SectionHeader from '../components/SectionHeader';

const Gallery = () => {
  // Placeholder items mapping to slots
  const galleryItems = [
    { id: 1, tag: 'FIG.01', caption: 'VOLATUS UAV TRIAL', colSpan: 'col-span-1 md:col-span-2', aspect: 'aspect-[16/9]' },
    { id: 2, tag: 'FIG.02', caption: 'ON-STAGE DEFENSE', colSpan: 'col-span-1', aspect: 'aspect-square' },
    { id: 3, tag: 'FIG.03', caption: 'HARDWARE BUILD', colSpan: 'col-span-1', aspect: 'aspect-[3/4]' },
    { id: 4, tag: 'FIG.04', caption: 'SETTLEMENT CAD', colSpan: 'col-span-1 md:col-span-2', aspect: 'aspect-[21/9]' },
    { id: 5, tag: 'FIG.05', caption: 'AWARD CEREMONY', colSpan: 'col-span-1 md:col-span-2', aspect: 'aspect-[16/9]' },
    { id: 6, tag: 'FIG.06', caption: 'THE OPEN ARENA', colSpan: 'col-span-1 md:col-span-2 lg:col-span-4', aspect: 'aspect-[21/9]' },
  ];

  return (
    <div className="max-w-6xl">
      <SectionHeader section="06" title="Visual Archive" jp="視覚記録" />
      
      <p className="font-label text-base md:text-lg text-bone-dim mb-8 max-w-2xl leading-relaxed">
        Scenes from past editions of CelesteCon and international deployments. A testament to the scale of the operation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {galleryItems.map((item) => (
          <div 
            key={item.id} 
            className={`${item.colSpan} relative group border-2 border-bone/20 bg-bone/5 hover:border-crimson transition-colors overflow-hidden ${item.aspect}`}
          >
            {/* Image Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
              <span className="font-mono text-xs tracking-widest text-bone-dim">IMG_{String(item.id).padStart(2, '0')}</span>
            </div>
            
            {/* Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ink via-ink/80 to-transparent">
              <div className="flex gap-2 items-baseline">
                <span className="font-mono text-[9px] text-crimson font-bold tracking-widest">{item.tag}</span>
                <span className="font-label text-sm text-bone tracking-wider uppercase font-bold">{item.caption}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
