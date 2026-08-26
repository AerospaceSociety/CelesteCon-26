import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { events } from '../data/events';

const EventCard = ({ event, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b-[1.5px] border-bone/40 last:border-b-0 py-4 group">
      <div 
        className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 gap-y-1 items-baseline cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-mono text-sm text-crimson font-bold tracking-[0.05em]">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="font-label font-bold text-xl md:text-2xl text-bone uppercase tracking-wide group-hover:text-crimson transition-colors">{event.name}</h3>
        
        {event.draft && (
          <span className="font-mono text-[9px] tracking-widest uppercase border border-crimson text-crimson px-2 py-0.5 whitespace-nowrap self-center hidden sm:block">
            GUIDELINES IN PROGRESS
          </span>
        )}
        
        <span className={`font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 font-bold whitespace-nowrap self-center ${event.mode === 'Onsite' ? 'bg-bone text-ink border-bone' : 'bg-ink text-bone border-bone'}`}>
          {event.mode}
        </span>
      </div>
      
      <div className="grid grid-cols-[auto_1fr] gap-x-4">
        <div></div>
        <p className="font-label text-sm text-bone-dim mt-1.5 mb-2 leading-relaxed opacity-90 max-w-3xl">
          {event.overview}
        </p>
      </div>

      {expanded && (
        <div className="grid grid-cols-[auto_1fr] gap-x-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div></div>
          <div className="bg-bone/5 border border-bone/20 p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {event.draft ? (
              <div className="col-span-1 md:col-span-2 py-4">
                <div className="font-mono text-[10px] tracking-widest text-crimson uppercase mb-2 font-bold">Status Update</div>
                <p className="font-label text-sm text-bone-dim">This event is currently being finalized. Final guidelines, software restrictions, and evaluation criteria will be released soon.</p>
              </div>
            ) : (
              <>
                <div>
                  <h4 className="font-mono text-[10px] tracking-[0.2em] text-crimson uppercase font-bold mb-3 border-b border-bone/20 pb-1">Structure</h4>
                  <ul className="space-y-3 font-label text-sm text-bone-dim">
                    {event.rounds.map((round, i) => (
                      <li key={i} className="leading-relaxed">
                        <span className="text-bone font-bold block">{round.name}</span>
                        {round.desc}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-mono text-[10px] tracking-[0.2em] text-crimson uppercase font-bold mb-3 border-b border-bone/20 pb-1">Criteria</h4>
                  <ul className="space-y-1.5 font-label text-sm text-bone-dim list-disc pl-4 marker:text-crimson">
                    {event.criteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                  
                  {event.software && (
                    <div className="mt-5">
                      <h4 className="font-mono text-[10px] tracking-[0.2em] text-bone uppercase font-bold mb-2">Approved Software</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.software.map((sw, i) => (
                          <span key={i} className="font-mono text-[9px] tracking-wider uppercase border border-bone/40 text-bone px-1.5 py-0.5">{sw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

const Comps = () => {
  return (
    <div className="max-w-5xl">
      <SectionHeader section="03" title="Field Roster" jp="全九種目" />
      
      <p className="font-label text-base md:text-lg text-bone-dim mb-10 max-w-3xl leading-relaxed">
        The official lineup for CelesteCon VI. Eleven events pushing the boundaries of school-level aerospace, design, and business. Expand each event to view structural guidelines and criteria.
      </p>

      <div className="border-t-[1.5px] border-bone/40">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
      
      {/* Open Arena Callout */}
      <div className="mt-16 border-2 border-bone p-6 bg-bone/5">
        <div className="font-mono text-[10px] tracking-[0.2em] text-crimson font-bold uppercase mb-2">Exhibit // On-Campus Only</div>
        <h3 className="font-display text-2xl text-bone uppercase tracking-wide mb-2">The Open Arena</h3>
        <p className="font-label text-sm text-bone-dim max-w-2xl leading-relaxed">
          Throughout the Round 2 on-campus finale, the central courtyard hosts the Open Arena. Features Aeromodelling flight tests, PlaneRush, SpaceDunk, and branded minigames for all-day engagement.
        </p>
      </div>
    </div>
  );
};

export default Comps;
