import React, { useEffect, useRef, useState } from 'react';
import { useRounds } from './useRounds';

const regions = ['r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12'];

export const MandalaColoring: React.FC = () => {
  const rounds = useRounds(4);
  const [palette] = useState<string[]>(['#7C3AED','#F472B6','#60A5FA','#34D399','#F97316','#F59E0B']);
  const [colors, setColors] = useState<Record<string,string>>(() => Object.fromEntries(regions.map(r => [r, 'transparent'])));
  const [selected, setSelected] = useState<string>(palette[0]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const allFilled = regions.every((id) => colors[id] && colors[id] !== 'transparent');
    if (allFilled) {
      const res = rounds.advance();
      if (!res.done) {
        setTimeout(() => setColors(Object.fromEntries(regions.map(r => [r, 'transparent']))), 900);
      }
    }
  }, [colors]);

  const fillRegion = (id: string) => {
    setColors((c) => ({ ...c, [id]: selected }));
  };

  const reset = () => setColors(Object.fromEntries(regions.map(r => [r, 'transparent'])));

  const exportPNG = async () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);
      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = png;
      a.download = 'mandala.png';
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Mandala Coloring</h2>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Reset</button>
          <button onClick={exportPNG} className="px-3 py-1 bg-purple-600 text-white rounded-md">Save</button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 flex-wrap">
        {palette.map((c) => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            className={`w-8 h-8 rounded-full border-2 ${selected===c? 'ring-2 ring-purple-400':''}`}
            style={{ backgroundColor: c }}
            aria-label={`Select ${c}`}
          />
        ))}
        <div className="text-sm text-gray-600 ml-2">Selected</div>
        <div className="ml-3 p-2 rounded" style={{ backgroundColor: selected, width: 28, height: 28 }} />
      </div>

      <div className="flex justify-center">
        <svg ref={svgRef} viewBox="0 0 300 300" width="360" height="360" className="rounded-md" role="img" aria-label="Mandala coloring">
          <defs>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>

          <circle cx="150" cy="150" r="140" fill="#FEF3C7" />

          {/* ring */}
          <g>
            <path id="r1" d="M150 40 A110 110 0 0 1 260 150 L195 150 A45 45 0 0 0 150 105 Z" fill={colors.r1} stroke="#7C3AED" strokeWidth={1} onClick={() => fillRegion('r1')} />
            <path id="r2" d="M260 150 A110 110 0 0 1 150 260 L150 195 A45 45 0 0 0 195 150 Z" fill={colors.r2} stroke="#7C3AED" strokeWidth={1} onClick={() => fillRegion('r2')} />
            <path id="r3" d="M150 260 A110 110 0 0 1 40 150 L105 150 A45 45 0 0 0 150 195 Z" fill={colors.r3} stroke="#7C3AED" strokeWidth={1} onClick={() => fillRegion('r3')} />
            <path id="r4" d="M40 150 A110 110 0 0 1 150 40 L150 105 A45 45 0 0 0 105 150 Z" fill={colors.r4} stroke="#7C3AED" strokeWidth={1} onClick={() => fillRegion('r4')} />
          </g>

          {/* inner petals */}
          <g>
            <ellipse id="r5" cx="150" cy="95" rx="24" ry="40" fill={colors.r5} stroke="#7C3AED" onClick={() => fillRegion('r5')} />
            <ellipse id="r6" cx="205" cy="150" rx="24" ry="40" fill={colors.r6} stroke="#7C3AED" transform="rotate(90 205 150)" onClick={() => fillRegion('r6')} />
            <ellipse id="r7" cx="150" cy="205" rx="24" ry="40" fill={colors.r7} stroke="#7C3AED" onClick={() => fillRegion('r7')} />
            <ellipse id="r8" cx="95" cy="150" rx="24" ry="40" fill={colors.r8} stroke="#7C3AED" transform="rotate(90 95 150)" onClick={() => fillRegion('r8')} />
          </g>

          {/* center shapes */}
          <g>
            <circle id="r9" cx="150" cy="150" r="28" fill={colors.r9} stroke="#7C3AED" onClick={() => fillRegion('r9')} />
            <circle id="r10" cx="150" cy="150" r="12" fill={colors.r10} stroke="#7C3AED" onClick={() => fillRegion('r10')} />
          </g>

          {/* decorative */}
          <g>
            <path id="r11" d="M150 20 L160 60 L140 60 Z" fill={colors.r11} stroke="#7C3AED" onClick={() => fillRegion('r11')} />
            <path id="r12" d="M150 280 L160 240 L140 240 Z" fill={colors.r12} stroke="#7C3AED" onClick={() => fillRegion('r12')} />
          </g>
        </svg>
      </div>

      <div className="mt-4 text-gray-600 text-sm">Tap a color, then tap a region to fill. Save your mandala as PNG.</div>
    </div>
  );
};
