import React, { useEffect, useRef } from 'react';

const HeroSignature = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const plate = containerRef.current;
    if (!cv || !plate) return;

    let timeoutId;

    const draw = () => {
      const w = plate.clientWidth;
      const h = plate.clientHeight;
      if (!w || !h) return;
      
      const dpr = Math.min(2.5, (window.devicePixelRatio || 1) * 1.4);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const x = cv.getContext('2d');
      x.scale(dpr, dpr);
      
      const BONE = '#E8E1CE';
      const INK = '#17130E';
      const CRIM = '#C2371F';
      const cx = w * 0.5;
      const cy = h * 0.54;
      const R = Math.min(w, h) * 0.21; // event horizon radius
      
      // seeded rand
      let seed = 20261023;
      const rnd = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };

      x.fillStyle = INK;
      x.fillRect(0, 0, w, h);
      
      // starfield
      for (let i = 0; i < 420; i++) {
        const sx = rnd() * w;
        const sy = rnd() * h;
        const sa = rnd();
        const dx = sx - cx;
        const dy = (sy - cy) * 2.2;
        if (Math.sqrt(dx * dx + dy * dy) < R * 2.1 && rnd() < 0.8) continue;
        x.globalAlpha = 0.12 + sa * 0.5;
        x.fillStyle = BONE;
        const ss = rnd() < 0.06 ? 1.6 : (rnd() < 0.5 ? 0.7 : 1);
        x.fillRect(sx, sy, ss, ss);
      }
      
      // distant dust specks
      for (let i2 = 0; i2 < 900; i2++) {
        x.globalAlpha = 0.03 + rnd() * 0.07;
        x.fillStyle = BONE;
        x.fillRect(rnd() * w, rnd() * h, 0.6, 0.6);
      }
      
      x.globalAlpha = 1;
      
      // accretion disk — flat elliptical streaks
      const tilt = -0.10; // slight rotation
      x.save();
      x.translate(cx, cy);
      x.rotate(tilt);
      const STREAKS = 920;
      for (let k = 0; k < STREAKS; k++) {
        const rr = R * 1.12 + Math.pow(rnd(), 1.6) * R * 2.55;
        const squash = 0.30 + rnd() * 0.05;
        const a0 = rnd() * Math.PI * 2;
        const len = 0.25 + rnd() * 1.15;
        const bright = Math.max(0, 1.25 - (rr / (R * 2.6)));
        const alpha = 0.05 + bright * 0.5 * rnd();
        const crim = rnd() < 0.085;
        x.beginPath();
        x.ellipse(0, 0, rr, rr * squash, 0, a0, a0 + len);
        x.strokeStyle = crim ? CRIM : BONE;
        x.globalAlpha = crim ? alpha * 0.85 : alpha;
        x.lineWidth = (rnd() < 0.12 ? 1.5 : 0.65) + bright * 0.5;
        x.stroke();
      }
      
      // inner hot rim of the disk
      for (let k2 = 0; k2 < 130; k2++) {
        const rr2 = R * 1.02 + rnd() * R * 0.16;
        const a02 = rnd() * Math.PI * 2;
        const len2 = 0.5 + rnd() * 1.6;
        x.beginPath();
        x.ellipse(0, 0, rr2, rr2 * 0.32, 0, a02, a02 + len2);
        x.strokeStyle = BONE;
        x.globalAlpha = 0.25 + rnd() * 0.5;
        x.lineWidth = 0.8 + rnd() * 1.1;
        x.stroke();
      }
      x.restore();
      
      // gravitational lensing — vertical halo over/under the hole
      x.save();
      x.translate(cx, cy);
      for (let k3 = 0; k3 < 150; k3++) {
        const rr3 = R * (1.06 + rnd() * 0.5);
        const up = rnd() < 0.55;
        const a03 = up ? (Math.PI * 1.15 + rnd() * 0.7) : (Math.PI * 0.15 + rnd() * 0.7);
        x.beginPath();
        x.ellipse(0, 0, rr3, rr3 * (0.82 + rnd() * 0.2), 0, a03, a03 + 0.5 + rnd() * 0.9);
        x.strokeStyle = BONE;
        x.globalAlpha = 0.05 + rnd() * 0.22;
        x.lineWidth = 0.6 + rnd() * 0.9;
        x.stroke();
      }
      x.restore();
      
      // photon ring
      x.beginPath();
      x.arc(cx, cy, R * 1.04, 0, Math.PI * 2);
      x.strokeStyle = BONE;
      x.globalAlpha = 0.9;
      x.lineWidth = 1.6;
      x.stroke();
      
      x.beginPath();
      x.arc(cx, cy, R * 1.10, 0, Math.PI * 2);
      x.strokeStyle = CRIM;
      x.globalAlpha = 0.35;
      x.lineWidth = 0.8;
      x.stroke();
      
      // event horizon
      x.globalAlpha = 1;
      x.beginPath();
      x.arc(cx, cy, R, 0, Math.PI * 2);
      x.fillStyle = '#0C0A08';
      x.fill();
      
      // faint cross-hair + annotations
      x.globalAlpha = 0.5;
      x.strokeStyle = BONE;
      x.lineWidth = 0.6;
      x.setLineDash([2, 4]);
      x.beginPath(); x.moveTo(cx - R * 3.1, cy); x.lineTo(cx - R * 1.5, cy); x.stroke();
      x.beginPath(); x.moveTo(cx + R * 1.5, cy); x.lineTo(cx + R * 3.1, cy); x.stroke();
      x.setLineDash([]);
      x.globalAlpha = 0.85;
      x.font = '9px "IBM Plex Mono", monospace';
      x.fillStyle = BONE;
      x.fillText('Rₛ = 2GM/c²', cx + R * 1.62, cy - 6);
      x.fillText('ACCRETION DISK', cx - R * 3.05, cy - 6);
      x.globalAlpha = 1;
    };

    draw();

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(draw, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-[34px_1fr_34px] gap-2 md:gap-4 lg:gap-6 mt-4 w-full">
        {/* Left Japanese Vertical Text - visible on desktop */}
        <div className="hidden md:flex flex-col justify-between items-center uppercase overflow-hidden gap-3">
          <span className="font-jp font-bold text-[11.5px] leading-relaxed w-[1.2em] text-center" style={{ lineBreak: 'anywhere', wordBreak: 'break-all' }}>
            光さえも逃れられない。
          </span>
          <span className="font-mono text-[8px] opacity-85 leading-relaxed w-[1.4ch] text-center break-all text-bone-dim">
            INTO DARKNESS
          </span>
        </div>
        
        <figure ref={containerRef} className="relative border-2 border-bone bg-ink overflow-hidden aspect-[16/10.6] w-full">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" aria-hidden="true" />
          <div className="screen absolute inset-0 pointer-events-none"></div>
          <span className="absolute left-2 top-2 z-10 font-mono text-[9px] tracking-widest text-bone border border-bone/75 px-1.5 py-0.5 bg-ink/50 uppercase">
            FIG.01 — ACCRETION STUDY // GARGANTUA CLASS
          </span>
          <div className="absolute right-2 bottom-2 z-10 text-right font-mono text-[8.5px] tracking-[0.14em] text-bone/85 uppercase leading-relaxed">
            AEROSS VISUAL UNIT<br/>EXPOSURE 1/60 · ISO 3200
          </div>
        </figure>
        
        {/* Right Japanese Vertical Text - visible on desktop */}
        <div className="hidden md:flex flex-col justify-between items-center uppercase overflow-hidden gap-3">
          <span className="font-jp font-bold text-[11.5px] leading-relaxed w-[1.2em] text-center" style={{ lineBreak: 'anywhere', wordBreak: 'break-all' }}>
            未来の技術者たちへ。
          </span>
          <span className="font-mono text-[8px] opacity-85 leading-relaxed w-[1.4ch] text-center break-all text-bone-dim">
            THE NEXT GENERATION
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSignature;
