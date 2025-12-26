
import React, { useState, useRef, useMemo } from 'react';
import { MemoryPhoto, AppState } from './types';
import { generateAlbumTitle } from './services/geminiService';

const ALBUM_INSPIRATIONS = [
  { title: "NEON ECHOES", subtitle: "RESONATING THROUGH THE URBAN NIGHT" },
  { title: "AMBER MOMENTS", subtitle: "STILL FRAMES OF A GOLDEN ERA" },
  { title: "CINEMATIC DRIFT", subtitle: "A JOURNEY THROUGH UNWRITTEN SCENES" },
  { title: "SILENT RESONANCE", subtitle: "THE SOUND OF UNSPOKEN WORDS" },
  { title: "PRIVATE GALAXY", subtitle: "EXPLORING THE INNER COSMOS" },
  { title: "MIDNIGHT MONOLOGUE", subtitle: "WHISPERS TO THE MOON" },
  { title: "FLOATING FRAMES", subtitle: "SUSPENDED IN THE RIVER OF TIME" },
  { title: "A MOVEABLE FEAST", subtitle: "MEMORIES THAT TRAVEL WITH US" },
  { title: "THE LAST CHAPTER", subtitle: "WHERE EVERY ENDING IS A PRELUDE" },
  { title: "BLUE SOUL ARCHIVE", subtitle: "DEEP DIVES INTO MELANCHOLY" },
  { title: "VELVET SOLITUDE", subtitle: "THE SOFT TEXTURE OF LONELY DAYS" },
  { title: "URBAN ARTIFACTS", subtitle: "COLLECTING PIECES OF THE STREET" },
  { title: "ETHEREAL GLOW", subtitle: "FINDING LIGHT IN THE FADING DUSK" },
  { title: "VINTAGE REVERIE", subtitle: "DREAMING IN ANALOG GRADIENTS" },
  { title: "ORGANIC RHYTHM", subtitle: "PULSING WITH THE HEART OF NATURE" }
];

const App: React.FC = () => {
  const [photos, setPhotos] = useState<(MemoryPhoto | null)[]>(Array(12).fill(null));
  const [userName, setUserName] = useState<string>('LUNAMORE');
  const [albumInfo, setAlbumInfo] = useState({ title: 'VINTAGE REVERIE', subtitle: 'A COLLECTION OF MOMENTS' });
  const [status, setStatus] = useState<AppState>(AppState.LANDING);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [isScattered, setIsScattered] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  // Generate deterministic random offsets for the scatter effect including 3D depth
  const scatterOffsets = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 180,
      y: (Math.random() - 0.5) * 180,
      z: 50 + Math.random() * 150, // Depth
      rx: (Math.random() - 0.5) * 40, // Rotation X
      ry: (Math.random() - 0.5) * 40, // Rotation Y
      rz: (Math.random() - 0.5) * 80, // Rotation Z
      s: 0.9 + Math.random() * 0.4,
      delay: i * 0.2 // Animation delay for floating
    }));
  }, []);

  const handleSingleUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.readAsDataURL(file);
    });
    
    const newPhotos = [...photos];
    newPhotos[index] = {
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      base64: base64,
      x: 0,
      y: 0,
      rotation: 0,
      month: index + 1
    };
    setPhotos(newPhotos);
    setRevealedCount(0);
    setIsScattered(false);
  };

  const handleRandomTitle = () => {
    const randomIdx = Math.floor(Math.random() * ALBUM_INSPIRATIONS.length);
    setAlbumInfo(ALBUM_INSPIRATIONS[randomIdx]);
  };

  const handleGenerateFull = async () => {
    setStatus(AppState.GENERATING);
    setRevealedCount(0);
    setIsScattered(false);

    try {
      const uploadedPhotos = photos.filter((p): p is MemoryPhoto => p !== null);
      
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setRevealedCount(count);
        if (count >= 12) {
          clearInterval(interval);
          // Sequential reveal finished, now trigger scatter effect after a short delay
          setTimeout(() => {
            setIsScattered(true);
            setStatus(AppState.REVEALED);
          }, 800);
        }
      }, 450);

      if (uploadedPhotos.length > 0) {
        const result = await generateAlbumTitle(uploadedPhotos, userName);
        setAlbumInfo(result);
      }
    } catch (error) {
      console.error("Generation error:", error);
      setStatus(AppState.REVEALED);
      setIsScattered(true);
    }
  };

  const handleExport = async () => {
    if (!captureRef.current) return;
    setIsExporting(true);
    
    try {
      // @ts-ignore
      const canvas = await window.html2canvas(captureRef.current, {
        useCORS: true,
        scale: 4, 
        backgroundColor: '#0d0404',
        logging: false,
        allowTaint: true,
        imageTimeout: 0
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `Album_${albumInfo.title.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const getPlayTime = () => {
    if (status === AppState.IDLE) return "00:00 / 12:00";
    const minutes = Math.floor(revealedCount).toString().padStart(2, '0');
    return `${minutes}:00 / 12:00`;
  };

  if (status === AppState.LANDING) {
    return (
      <div 
        className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0d0404] cursor-pointer overflow-hidden group"
        onClick={() => setStatus(AppState.IDLE)}
      >
        <div className="absolute inset-0 light-leak-red opacity-40" />
        
        {/* Vintage Phonograph / Gramophone 3D Container */}
        <div className="relative vinyl-player-3d transition-all duration-1000 scale-125 hover:scale-150 active:scale-110">
           
           {/* Wooden Base */}
           <div className="w-[200px] h-[140px] bg-[#3a1a08] border-b-[10px] border-[#200e04] border-r-[4px] rounded-sm shadow-[0_50px_100px_rgba(0,0,0,0.9)] relative flex items-center justify-center">
              <div className="absolute inset-2 border border-white/5 opacity-20" />
              
              {/* Spinning Record on Platter */}
              <div className="absolute top-[-10px] w-40 h-40 bg-black rounded-full border-[2px] border-[#111] shadow-xl spinning relative flex items-center justify-center">
                  <div className="absolute inset-1 border border-white/5 rounded-full" />
                  <div className="absolute inset-4 border border-white/5 rounded-full" />
                  <div className="absolute inset-10 border border-white/5 rounded-full" />
                  <div className="w-12 h-12 rounded-full bg-[#501010] border-2 border-black flex items-center justify-center">
                    <div className="w-1 h-1 bg-white/40 rounded-full" />
                  </div>
              </div>

              {/* Tonearm (Old fashioned) */}
              <div className="absolute top-4 right-2 w-1.5 h-32 bg-zinc-600 rounded-full origin-top rotate-[20deg] shadow-lg">
                 <div className="absolute bottom-0 -left-1 w-4 h-6 bg-zinc-400 rounded-sm" />
              </div>
           </div>

           {/* Large Brass Horn */}
           <div className="absolute -top-48 -left-20 w-48 h-48 pointer-events-none">
              <div 
                className="w-full h-full bg-gradient-to-br from-[#d4af37] via-[#a67c00] to-[#6b4c00] rounded-full relative shadow-2xl"
                style={{ 
                   transform: 'rotateX(-45deg) rotateY(15deg) scaleX(1.4)',
                   boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.4)'
                }}
              >
                 {/* Inner Horn Depth */}
                 <div className="absolute inset-8 rounded-full bg-black/80 blur-[2px]" />
                 <div className="absolute inset-12 rounded-full border border-white/10 opacity-30" />
              </div>
              {/* Horn Stem */}
              <div 
                className="absolute bottom-[-60px] left-1/2 w-4 h-40 bg-gradient-to-t from-[#a67c00] to-[#d4af37]"
                style={{ transform: 'translateX(-50%) rotate(-20deg)', borderRadius: '20px' }}
              />
           </div>
        </div>

        {/* Interaction Hint (Optional visual-only indicator) */}
        <div className="mt-40 w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center animate-bounce opacity-20 group-hover:opacity-60 transition-opacity">
           <div className="w-2 h-2 bg-white rounded-full" />
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-white/10" />
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-white/10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      {/* Control Panel */}
      <div className="mb-8 flex flex-wrap justify-center gap-4 z-50">
        <div className="text-[10px] text-white/30 tracking-widest uppercase flex items-center px-4 font-mono">
          Chronicle 2025 • Volume Anthology
        </div>

        <button 
          onClick={handleRandomTitle}
          className="px-4 py-2 border border-white/10 text-white/60 text-[10px] tracking-[0.2em] uppercase rounded-sm font-bold transition-all hover:border-white/30 hover:text-white"
        >
          Shuffle Title
        </button>
        
        <button 
          onClick={handleGenerateFull}
          disabled={status === AppState.GENERATING}
          className="px-6 py-2 bg-[#b22222] text-white text-[10px] tracking-[0.2em] uppercase rounded-sm font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 hover:bg-red-800"
        >
          {status === AppState.GENERATING ? 'REVEALING...' : 'REVEAL MEMORIES'}
        </button>

        <button 
          onClick={handleExport}
          className="px-6 py-2 bg-white text-black text-[10px] tracking-[0.2em] uppercase rounded-sm font-bold shadow-lg transition-all active:scale-95"
        >
          {isExporting ? 'CAPTURING...' : 'SAVE POSTER'}
        </button>
      </div>

      {/* Poster Container (3:4 Ratio) */}
      <div 
        ref={captureRef}
        className="relative w-[450px] h-[600px] retro-red-bg overflow-hidden flex flex-col items-center px-8 py-10 shadow-[0_60px_120px_rgba(0,0,0,1)] border border-white/5"
      >
        {/* Layered Overlays */}
        <div className="absolute inset-0 light-leak-red z-10" />
        <div className="absolute inset-0 film-burn-soft z-15" />
        <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] z-20" />

        {/* Small Year 2025 Label in Top-Left */}
        <div className="absolute top-6 left-6 z-40">
           <div 
             className="text-white/20 text-xl font-black tracking-[0.15em] mix-blend-screen opacity-90 drop-shadow-xl"
             style={{ fontFamily: "'Share Tech Mono', monospace" }}
           >
             2025
           </div>
        </div>

        {/* Poster Header */}
        <header className={`w-full text-center z-30 mb-4 transition-transform duration-1000 ${isScattered ? 'scale-110 translate-y-2' : ''}`}>
          <div 
            className="text-white/60 text-[9px] tracking-[0.3em] uppercase font-black italic mb-3"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            When you take two minutes,
          </div>
          <h1 className="text-3xl font-black text-vintage tracking-tighter italic uppercase underline decoration-red-900/60 decoration-4 underline-offset-[12px] drop-shadow-[0_12px_24px_rgba(0,0,0,1)]">
            {albumInfo.title}
          </h1>
          <div className="mt-6 flex flex-col items-center">
             <span className="text-[7px] text-white/30 uppercase tracking-[0.5em] mb-1 font-mono">Curated & Produced By</span>
             <input 
               type="text" 
               value={userName} 
               onChange={(e) => setUserName(e.target.value.toUpperCase())}
               className="bg-transparent border-none text-center text-[11px] text-red-800 font-black tracking-[0.3em] outline-none focus:ring-0 placeholder-white/10 uppercase drop-shadow-md"
             />
          </div>
        </header>

        {/* Sequential Reveal Grid / 3D Scatter Mosaic */}
        <div className={`grid grid-cols-4 gap-3 w-full z-30 mt-2 mb-2 transition-all duration-1000 ${isScattered ? 'gap-0 translate-y-4' : ''}`} style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
          {photos.map((photo, i) => {
            const isVisible = (status as AppState) === AppState.IDLE || i < revealedCount;
            const offset = scatterOffsets[i];
            
            const scatterStyle = isScattered ? {
              transform: `translate3d(${offset.x}px, ${offset.y}px, ${offset.z}px) rotateX(${offset.rx}deg) rotateY(${offset.ry}deg) rotateZ(${offset.rz}deg) scale(${offset.s})`,
              opacity: 0.8,
              animationDelay: `${offset.delay}s`
            } : {};

            return (
              <label 
                key={i} 
                className={`relative aspect-square photo-frame overflow-hidden group cursor-pointer transition-all duration-[1500ms] ease-out
                  ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}
                  ${isScattered ? 'scattered-shadow floating-layer' : ''}
                `}
                style={{ 
                  ...scatterStyle,
                  zIndex: isScattered ? Math.floor(offset.z) : 10
                }}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleSingleUpload(i, e)} 
                  className="hidden" 
                />
                <div className="film-grain" />
                <div className="absolute inset-0 z-10 bg-black/5 pointer-events-none" />
                
                {photo ? (
                  <img 
                    src={photo.url} 
                    className="w-full h-full object-cover sharp-image" 
                    alt="" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-10 group-hover:opacity-40 transition-opacity">
                    <span className="text-white font-black italic text-xl drop-shadow-lg">{i + 1}</span>
                  </div>
                )}
                <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.6)] pointer-events-none" />
                {!isScattered && <div className="absolute bottom-0.5 right-1 z-20 font-mono text-[5px] text-white/30 tracking-tighter italic">CH {i+1}</div>}
              </label>
            );
          })}
        </div>

        <div 
          className="text-white/40 text-[9px] tracking-[0.3em] uppercase font-black italic z-30 mb-3"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
           To go back in time,
        </div>

        {/* Bottom Vinyl Player Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-40 px-8 flex flex-col justify-end pb-10">
           <div className="flex items-center gap-8">
              {/* Rolling Vinyl Record */}
              <div className="relative w-20 h-20 shrink-0 drop-shadow-[0_20px_45px_rgba(0,0,0,1)]">
                <div className={`absolute inset-0 bg-[#060606] rounded-full border-[2px] border-white/10 flex items-center justify-center 
                  ${status === AppState.GENERATING ? 'spinning' : 'spinning-slow opacity-50'}
                `}>
                  <div className="absolute inset-2 border-[1px] border-white/5 rounded-full" />
                  <div className="absolute inset-4 border-[1px] border-white/5 rounded-full" />
                  <div className="absolute inset-6 border-[1px] border-white/5 rounded-full" />
                  <div className="absolute inset-7 border-[1px] border-white/5 rounded-full" />
                  {/* Center Label */}
                  <div className="w-10 h-10 rounded-full bg-red-950 border-[2.5px] border-black flex items-center justify-center relative overflow-hidden">
                    {photos.find(p => p !== null) && <img src={photos.find(p => p !== null)?.url} className="w-full h-full object-cover opacity-80 sharp-image" alt="Vinyl label" />}
                    <div className="absolute w-2 h-2 bg-white/20 rounded-full shadow-inner" />
                  </div>
                </div>
              </div>

              {/* Player Details */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-3">
                   <div className="max-w-[220px]">
                     <div className="text-[12px] text-vintage font-black tracking-tight italic truncate uppercase drop-shadow-md">{albumInfo.title}</div>
                     <div className="text-[8px] text-white/50 uppercase tracking-[0.2em] mt-1.5 font-mono italic">{albumInfo.subtitle}</div>
                   </div>
                   <div className="text-[8px] font-mono text-vintage opacity-60 font-bold italic">
                     {getPlayTime()}
                   </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-[2.5px] bg-white/10 rounded-full overflow-hidden relative">
                   <div 
                    className="absolute top-0 left-0 h-full bg-red-900 transition-all duration-300" 
                    style={{ width: `${(revealedCount / 12) * 100}%` }}
                   />
                </div>
              </div>
           </div>
        </div>

        {/* Sidebar Vertical Decoration */}
        <div className="absolute top-10 right-4 text-[6px] text-white/5 font-mono tracking-[1.1em] uppercase vertical-text pointer-events-none z-40">
           LUNAMORE • ANALOG ANTHOLOGY 2025 • HI-FI FIDELITY COLLECTION
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-12 text-center opacity-30 group">
        <p className="text-[10px] font-mono tracking-[0.4em] uppercase italic group-hover:text-red-700 transition-colors cursor-default">
          {userName} • Retro Red Anthology 2025
        </p>
      </footer>
    </div>
  );
};

export default App;
