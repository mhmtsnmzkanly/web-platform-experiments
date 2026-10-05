import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Search,
  Grid,
  List,
  Info,
  X,
  Code,
  Sparkles,
  Layers,
  Compass,
} from 'lucide-react';
import { EXPERIMENTS, ExperimentEntry } from './experiments/registry';
import { ExperimentCategory } from './experiments/types';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInspector, setShowInspector] = useState(false);

  // Find currently active experiment
  const currentExperiment = useMemo(() => {
    return EXPERIMENTS.find((e) => e.meta.id === selectedId) || null;
  }, [selectedId]);

  // Filtered experiments for gallery view
  const filteredExperiments = useMemo(() => {
    return EXPERIMENTS.filter((e) => {
      const matchesCategory =
        activeCategory === 'All' || e.meta.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        e.meta.title.toLowerCase().includes(q) ||
        e.meta.description.toLowerCase().includes(q) ||
        e.meta.number.includes(q) ||
        e.meta.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.meta.keyTechnologies.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showInspector) {
          setShowInspector(false);
        } else if (selectedId) {
          setSelectedId(null);
        }
      } else if (selectedId) {
        const currentIndex = EXPERIMENTS.findIndex((exp) => exp.meta.id === selectedId);
        if (e.key === 'ArrowRight' && currentIndex < EXPERIMENTS.length - 1) {
          setSelectedId(EXPERIMENTS[currentIndex + 1].meta.id);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
          setSelectedId(EXPERIMENTS[currentIndex - 1].meta.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, showInspector]);

  const handleRandomExperiment = () => {
    const randomIndex = Math.floor(Math.random() * EXPERIMENTS.length);
    setSelectedId(EXPERIMENTS[randomIndex].meta.id);
  };

  const handleNextExperiment = () => {
    if (!selectedId) return;
    const currentIndex = EXPERIMENTS.findIndex((exp) => exp.meta.id === selectedId);
    if (currentIndex < EXPERIMENTS.length - 1) {
      setSelectedId(EXPERIMENTS[currentIndex + 1].meta.id);
    } else {
      setSelectedId(EXPERIMENTS[0].meta.id); // loop to first
    }
  };

  const handlePrevExperiment = () => {
    if (!selectedId) return;
    const currentIndex = EXPERIMENTS.findIndex((exp) => exp.meta.id === selectedId);
    if (currentIndex > 0) {
      setSelectedId(EXPERIMENTS[currentIndex - 1].meta.id);
    } else {
      setSelectedId(EXPERIMENTS[EXPERIMENTS.length - 1].meta.id); // loop to last
    }
  };

  const categories: ('All' | ExperimentCategory)[] = [
    'All',
    'Typography',
    'Simulation',
    'Retro & Optics',
    'Audio & Signals',
    'Physics & Geometry',
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* ========================================================================= */}
      {/* TOP NAVIGATION BAR — Strict 3-zone contract                              */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-6 py-4 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setSelectedId(null)}
          className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors flex items-center gap-2"
        >
          <span className="font-display font-black tracking-widest text-amber-400">HELLO WORLD</span>
          <span className="font-serif italic font-normal text-stone-400">Lab</span>
        </button>

        {/* Zone 2: Navigation categories / Breadcrumb indicator */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider text-stone-400">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                if (selectedId) setSelectedId(null);
              }}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeCategory === cat && !selectedId
                  ? 'text-amber-400 font-bold border-b border-amber-400 pb-0.5'
                  : ''
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRandomExperiment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-stone-900 border border-stone-800 hover:border-amber-400/50 hover:bg-stone-800 text-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <Shuffle size={13} className="text-amber-400" />
            <span>Random Study</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* EXPERIMENT DETAIL VIEWPORT (WHEN A STUDY IS SELECTED)                     */}
      {/* ========================================================================= */}
      {currentExperiment ? (
        <main className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* Experiment Control Utility Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800 text-xs font-mono">
            {/* Left: Back & Specimen Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-800 hover:border-stone-600 rounded-lg text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Gallery [Esc]</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-400 text-sm">
                  STUDY {currentExperiment.meta.number}
                </span>
                <span className="text-stone-500">/</span>
                <span className="font-semibold text-white text-sm">
                  {currentExperiment.meta.title}
                </span>
                <span className="hidden md:inline text-stone-500">·</span>
                <span className="hidden md:inline text-stone-400">
                  {currentExperiment.meta.category}
                </span>
              </div>
            </div>

            {/* Right: Prev / Next / Inspector */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevExperiment}
                title="Previous Study (Arrow Left)"
                className="p-2 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-lg text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                onClick={handleNextExperiment}
                title="Next Study (Arrow Right)"
                className="p-2 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-lg text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => setShowInspector(!showInspector)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  showInspector
                    ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                }`}
              >
                <Info size={13} />
                <span>Inspector</span>
              </button>
            </div>
          </div>

          {/* Inspector Slide-Down Panel */}
          {showInspector && (
            <div className="my-4 p-5 bg-stone-900/90 border border-amber-400/30 rounded-xl backdrop-blur-md shadow-2xl transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Code size={13} /> SPECIMEN ARCHITECTURE & MECHANISM REPORT
                </span>
                <button
                  onClick={() => setShowInspector(false)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs font-mono">
                <div>
                  <h4 className="text-stone-400 uppercase tracking-wider mb-1">Mechanism Signature</h4>
                  <p className="text-stone-200 bg-stone-950/80 p-2.5 rounded border border-stone-800 leading-relaxed">
                    {currentExperiment.meta.mechanismSignature}
                  </p>
                </div>

                <div>
                  <h4 className="text-stone-400 uppercase tracking-wider mb-1">Design Signature</h4>
                  <p className="text-stone-200 bg-stone-950/80 p-2.5 rounded border border-stone-800 leading-relaxed">
                    {currentExperiment.meta.designSignature}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-stone-400 uppercase tracking-wider mb-1">Curatorial Synopsis</h4>
                  <p className="text-stone-300 leading-relaxed">
                    {currentExperiment.meta.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {currentExperiment.meta.keyTechnologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300 text-[11px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Experiment Render Canvas Component */}
          <div className="my-auto py-4">
            <currentExperiment.component />
          </div>

          {/* Quick Jump Bar across 25 Studies at the bottom */}
          <div className="pt-6 border-t border-stone-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-stone-500">INDEX JUMP:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
              {EXPERIMENTS.map((exp) => (
                <button
                  key={exp.meta.id}
                  onClick={() => setSelectedId(exp.meta.id)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-[11px] font-bold transition-all cursor-pointer ${
                    exp.meta.id === currentExperiment.meta.id
                      ? 'bg-amber-400 text-stone-950 shadow-md scale-110'
                      : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-600'
                  }`}
                >
                  {exp.meta.id}
                </button>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* ========================================================================= */
        /* GALLERY / SHOWCASE PORTAL VIEW (DEFAULT VIEW)                             */
        /* ========================================================================= */
        <main className="flex-1 flex flex-col p-6 md:p-12 max-w-7xl mx-auto w-full">
          {/* Curatorial Header Hero */}
          <div className="mb-10 text-center md:text-left border-b border-stone-800 pb-10">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-3">
              <Compass size={13} />
              <span>Computational Specimen Archive · 200 Sequential Studies</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-display mb-4">
              Hello World <span className="font-serif italic font-normal text-stone-400">Laboratory</span>
            </h1>

            <p className="text-stone-400 text-sm md:text-base max-w-3xl leading-relaxed">
              An exploration of native browser capabilities—Web Audio API synthesizers, Verlet physics cloth,
              photonic lasers, CRT scanlines, 3D parametric ribbons, cellular automata, and quantum wavepackets—where
              the phrase <strong className="text-stone-200">Hello World</strong> is the primary visual and conceptual subject.
            </p>
          </div>

          {/* Filtering and Search Ribbon */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mechanism, tech, or title..."
                className="w-full bg-stone-900/90 border border-stone-800 focus:border-amber-400 pl-9 pr-4 py-2 rounded-lg text-xs font-mono text-stone-200 placeholder-stone-500 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Category Segmented Tabs */}
            <div className="flex items-center gap-1 p-1 bg-stone-900/80 border border-stone-800 rounded-lg overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border border-stone-800 rounded-lg p-1 bg-stone-900">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-300'
                }`}
                title="Grid Specimen View"
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-300'
                }`}
                title="Index List View"
              >
                <List size={14} />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SPECIMEN GALLERY (GRID MODE)                                             */}
          {/* ========================================================================= */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiments.map((exp) => (
                <div
                  key={exp.meta.id}
                  onClick={() => setSelectedId(exp.meta.id)}
                  className="group relative bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800 hover:border-amber-400/60 rounded-xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    {/* Top Row: Clean unboxed metadata (no pills!) */}
                    <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-3">
                      <span className="font-bold text-amber-400 tracking-wider">
                        STUDY {exp.meta.number}
                      </span>
                      <span>{exp.meta.category}</span>
                    </div>

                    {/* Primary Title */}
                    <h3 className="text-xl font-bold font-sans text-stone-100 group-hover:text-amber-400 transition-colors mb-2">
                      {exp.meta.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 mb-4">
                      {exp.meta.description}
                    </p>

                    {/* Mechanism Flow Blueprint */}
                    <div className="p-2.5 bg-stone-950/70 border border-stone-800/80 rounded-lg text-[11px] font-mono text-stone-300 mb-4 line-clamp-2 leading-relaxed">
                      <span className="text-amber-400 font-semibold mr-1">FLOW:</span>
                      {exp.meta.mechanismSignature}
                    </div>
                  </div>

                  {/* Bottom Tech Indicators & Open Arrow */}
                  <div className="flex items-center justify-between pt-4 border-t border-stone-800/60 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                      <span>{exp.meta.keyTechnologies[0]}</span>
                      {exp.meta.keyTechnologies[1] && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{exp.meta.keyTechnologies[1]}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span className="font-bold">LAUNCH</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ========================================================================= */
            /* SPECIMEN CATALOG (LIST MODE)                                              */
            /* ========================================================================= */
            <div className="border border-stone-800 rounded-xl overflow-hidden divide-y divide-stone-800 font-mono text-xs">
              <div className="bg-stone-900/80 px-6 py-3 grid grid-cols-12 text-stone-400 font-bold uppercase tracking-wider">
                <span className="col-span-1">No.</span>
                <span className="col-span-4">Study Title</span>
                <span className="col-span-2">Category</span>
                <span className="col-span-4">Mechanism Flow</span>
                <span className="col-span-1 text-right">Action</span>
              </div>

              {filteredExperiments.map((exp) => (
                <div
                  key={exp.meta.id}
                  onClick={() => setSelectedId(exp.meta.id)}
                  className="px-6 py-4 grid grid-cols-12 items-center hover:bg-stone-900/60 transition-colors cursor-pointer group"
                >
                  <span className="col-span-1 font-bold text-amber-400">{exp.meta.number}</span>
                  <span className="col-span-4 font-semibold text-stone-100 group-hover:text-amber-400 transition-colors text-sm">
                    {exp.meta.title}
                  </span>
                  <span className="col-span-2 text-stone-400">{exp.meta.category}</span>
                  <span className="col-span-4 text-stone-400 truncate pr-4">
                    {exp.meta.mechanismSignature}
                  </span>
                  <div className="col-span-1 flex justify-end text-amber-400 group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredExperiments.length === 0 && (
            <div className="text-center py-16 border border-dashed border-stone-800 rounded-xl">
              <p className="text-stone-400 font-mono text-sm">No experimental studies found matching query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-3 px-4 py-1.5 bg-amber-400 text-stone-950 font-mono font-bold text-xs rounded hover:bg-amber-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="border-t border-stone-900 bg-stone-950 px-6 py-6 text-center text-xs font-mono text-stone-500">
        <p>Hello World Laboratory · 200 Native Browser Computational Studies</p>
      </footer>
    </div>
  );
}
