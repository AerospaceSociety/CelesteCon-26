import React from 'react';

const SectionHeader = ({ section, title, jp }) => {
  return (
    <div className="flex items-baseline gap-3 mt-8 mb-6 pb-2 border-b-4 border-bone flex-wrap">
      <h2 className="font-display text-2xl md:text-4xl text-bone uppercase tracking-wide leading-none">{title}</h2>
      {jp && <span className="font-jp font-bold text-xs md:text-sm tracking-widest text-crimson">{jp}</span>}
      <span className="flex-1 min-w-[20px]"></span>
      <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-bone-dim">SEC. {section} // {title.toUpperCase()}</span>
    </div>
  );
};

export default SectionHeader;
