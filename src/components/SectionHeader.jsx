import React from 'react';

const SectionHeader = ({ section, title, jp }) => {
  return (
    <div className="mt-4 sm:mt-8 mb-6 pb-2 border-b-4 border-bone">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-3">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-bone uppercase tracking-wide leading-none">{title}</h2>
          {jp && <span className="font-jp font-bold text-xs sm:text-sm tracking-widest text-crimson">{jp}</span>}
        </div>
        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.16em] uppercase text-bone-dim font-bold self-start sm:self-auto">
          SEC. {section} // {title.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default SectionHeader;
