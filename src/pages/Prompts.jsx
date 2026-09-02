import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { hybridPrompts } from '../data/prompts';

const PromptCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-2 border-bone/40 bg-bone/[0.03] p-5 sm:p-7 hover:border-crimson transition-colors">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs sm:text-sm text-crimson font-bold">
            PROMPT // E{item.eventId}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide">
            {item.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] tracking-widest uppercase border border-crimson bg-crimson/20 text-crimson px-2.5 py-0.5 font-bold">
            {item.status}
          </span>
          <span className="font-mono text-[10px] tracking-widest uppercase border border-bone/40 text-bone-dim px-2 py-0.5">
            {item.category}
          </span>
          <span className="font-mono text-[10px] tracking-widest uppercase border border-bone text-bone px-2 py-0.5 font-bold">
            {item.eligibility}
          </span>
        </div>
      </div>

      <p className="font-label text-base text-bone-dim mb-4 leading-relaxed max-w-4xl">
        {item.hook}
      </p>

      {/* Round 1 Main Prompt Brief */}
      <div className="border-l-2 border-crimson pl-4 py-1.5 my-4 bg-crimson/[0.05]">
        <div className="font-mono text-xs tracking-wider uppercase text-crimson font-bold mb-1">
          {item.round1Prompt.title}
        </div>
        {item.round1Prompt.topic && (
          <div className="font-label text-base text-bone font-semibold mb-2">
            {item.round1Prompt.topic}
          </div>
        )}

        {/* Case Studies if present (e.g. Volatus) */}
        {item.round1Prompt.cases && (
          <div className="space-y-3 my-3">
            {item.round1Prompt.cases.map((c, i) => (
              <div key={i} className="border border-bone/30 p-3 bg-ink/60">
                <div className="font-mono text-xs text-crimson font-bold uppercase mb-1">
                  {c.code}: {c.title}
                </div>
                <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tracks if present (e.g. Business Power Pitch) */}
        {item.round1Prompt.tracks && (
          <ul className="list-disc pl-5 my-2 space-y-1 font-label text-xs sm:text-sm text-bone-dim marker:text-crimson">
            {item.round1Prompt.tracks.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}

        {/* Prompts list if present (e.g. Dimension III) */}
        {item.round1Prompt.prompts && (
          <ul className="list-disc pl-5 my-2 space-y-1 font-label text-xs sm:text-sm text-bone-dim marker:text-crimson">
            {item.round1Prompt.prompts.map((p, i) => (
              <li key={i} className="font-semibold text-bone">{p}</li>
            ))}
          </ul>
        )}

        {/* Specific Instructions */}
        {item.round1Prompt.instructions && (
          <ul className="list-disc pl-5 mt-2 space-y-1 font-label text-xs sm:text-sm text-bone-dim marker:text-crimson">
            {item.round1Prompt.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        )}

        {item.round1Prompt.requirements && (
          <ul className="list-disc pl-5 mt-2 space-y-1.5 font-label text-xs sm:text-sm text-bone-dim marker:text-crimson">
            {item.round1Prompt.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        )}

        {item.templateUrl && (
          <div className="mt-3">
            <a
              href={item.templateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider text-bone border border-crimson bg-crimson/20 hover:bg-crimson hover:text-bone transition-colors"
            >
              <span>Download Official Proposal Template</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>

      {/* Accordion for Round 2 & Criteria */}
      <div className="pt-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="font-mono text-xs uppercase tracking-widest text-bone-dim hover:text-crimson transition-colors flex items-center gap-2 mb-3"
        >
          <span>{expanded ? '▲ Hide Round 2 Finals & Rubric' : '▼ View Round 2 Onsite Finals & Evaluation Rubric'}</span>
        </button>

        {expanded && (
          <div className="border-t border-bone/20 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
            <div>
              <h4 className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-2">
                {item.round2Prompt.title}
              </h4>
              <ul className="space-y-1.5 font-label text-xs sm:text-sm text-bone-dim list-disc pl-4 marker:text-crimson">
                {item.round2Prompt.details.map((d, i) => (
                  <li key={i} className="leading-relaxed">{d}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-2">
                Evaluation Rubric
              </h4>
              <ul className="space-y-1.5 font-label text-xs sm:text-sm text-bone-dim list-disc pl-4 marker:text-crimson">
                {item.evaluationCriteria.map((crit, i) => (
                  <li key={i} className="leading-relaxed">{crit}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Deliverable & Action Footer */}
      <div className="mt-4 pt-4 border-t border-bone/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="font-mono text-xs text-bone-dim">
          <span className="text-crimson font-bold uppercase">Required Format: </span>
          <span>{item.deliverables}</span>
        </div>

        <Link
          to={`/submissions?event=${item.id}`}
          className="px-5 py-2 bg-crimson text-bone font-label font-bold text-xs sm:text-sm uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors whitespace-nowrap self-stretch sm:self-auto text-center"
        >
          Submit Entry on Portal →
        </Link>
      </div>
    </div>
  );
};

const Prompts = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const categories = ['ALL', 'Engineering & Architecture', 'Debate & Rhetoric', 'Aerospace Engineering', 'Entrepreneurship & Tech', 'Creative Engineering', '3D CAD & Prototyping', 'STEM & Logic Quiz', 'Theatrical Arts & Comedy'];

  const filtered = hybridPrompts.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      searchFilter === '' ||
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.hook.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl">
      <SectionHeader section="04" title="Prompt Portal" jp="課題一覧" />

      {/* Sub-masthead Banner */}
      <div className="mt-8 mb-10 border-2 border-bone p-6 sm:p-8 bg-bone/[0.04]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs tracking-[0.2em] text-crimson font-bold uppercase mb-2">
              Confidential Release // Round 1 Qualifier Briefs
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide mb-2">
              Official Hybrid Event Prompts
            </h2>
            <p className="font-label text-sm sm:text-base text-bone-dim max-w-2xl leading-relaxed">
              This portal hosts active problem statements, challenge tracks, and submission guidelines for all 8 Hybrid events. Download required templates, inspect case options, and submit your entries before the qualifiers close.
            </p>
          </div>

          <Link
            to="/submissions"
            className="px-6 py-3 bg-bone text-ink font-label font-bold text-sm uppercase tracking-widest border border-bone hover:bg-crimson hover:text-bone hover:border-crimson transition-colors whitespace-nowrap text-center shrink-0"
          >
            Go To Submission Portal →
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'Engineering', 'Debate', 'Pitch', 'CAD'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (tag === 'ALL') setSelectedCategory('ALL');
                else if (tag === 'Engineering') setSelectedCategory('Aerospace Engineering');
                else if (tag === 'Debate') setSelectedCategory('Debate & Rhetoric');
                else if (tag === 'Pitch') setSelectedCategory('Entrepreneurship & Tech');
                else if (tag === 'CAD') setSelectedCategory('3D CAD & Prototyping');
              }}
              className="px-3 py-1 font-mono text-xs uppercase tracking-widest font-bold border border-bone/40 text-bone-dim hover:text-bone hover:border-bone transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter prompts by keyword..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="bg-ink border-2 border-bone/40 px-3 py-1.5 text-sm font-label text-bone placeholder:text-bone-dim/50 focus:border-crimson outline-none w-full md:w-64"
        />
      </div>

      {/* Prompts List */}
      <div className="space-y-6">
        {filtered.map((item) => (
          <PromptCard key={item.id} item={item} />
        ))}
      </div>

      {/* Submission Guidance Note */}
      <div className="mt-14 border-2 border-dashed border-bone/50 p-6 bg-bone/[0.02]">
        <div className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-2">
          Submission Protocol Notice
        </div>
        <p className="font-label text-sm text-bone-dim leading-relaxed">
          All Round 1 submissions must be uploaded via Google Drive links on the official <strong className="text-bone">Submission Portal</strong>. Ensure your Google Drive file/folder permissions are set to <em>"Anyone on the internet with the link can view"</em>. Submissions with restricted access cannot be evaluated by the jury.
        </p>
      </div>
    </div>
  );
};

export default Prompts;
