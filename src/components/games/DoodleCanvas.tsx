import React, { useEffect, useRef, useState } from 'react';
import { useRounds } from './useRounds';
import { startSession, endSession } from '../../utils/progressTracker';

type Tool = 'brush' | 'pen' | 'pencil' | 'eraser';

export const DoodleCanvas: React.FC = () => {
  const rounds = useRounds(4);
  useEffect(() => { startSession('DoodleCanvas'); return () => { try { endSession('DoodleCanvas'); } catch {} }; }, []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#7C3AED');
  const [size, setSize] = useState(6);
  const [tool, setTool] = useState<Tool>('brush');
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    c.width = 900;
    c.height = 540;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
  }, []);

  const pushHistory = () => {
    const c = canvasRef.current;
    if (!c) return;
    try {
      const data = c.toDataURL();
      setHistory((h) => [data, ...h].slice(0, 30));
      setRedoStack([]);
    } catch (e) {
      // ignore
    }
  };

  const getPos = (clientX: number, clientY: number) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const pointerDown = (clientX: number, clientY: number) => {
    pushHistory();
    lastPos.current = getPos(clientX, clientY);
    setDrawing(true);
  };
  const pointerUp = () => {
    setDrawing(false);
    lastPos.current = null;
  };

  const drawPoint = (x: number, y: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.save();
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const width = tool === 'pencil' ? Math.max(1, size - 3) : tool === 'pen' ? Math.max(2, size - 1) : size;
    ctx.lineWidth = width;
    if (tool === 'pencil') ctx.globalAlpha = 0.8;
    else ctx.globalAlpha = 1;
    if (!lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.1, y + 0.1);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.restore();
    lastPos.current = { x, y };
  };

  const pointerMove = (clientX: number, clientY: number) => {
    if (!drawing) return;
    const p = getPos(clientX, clientY);
    drawPoint(p.x, p.y);
  };

  // mouse handlers
  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); pointerDown(e.clientX, e.clientY); };
  const onMouseUp = () => pointerUp();
  const onMouseMove = (e: React.MouseEvent) => { e.preventDefault(); pointerMove(e.clientX, e.clientY); };

  // touch handlers
  const onTouchStart = (e: React.TouchEvent) => { e.preventDefault(); const t = e.touches[0]; pointerDown(t.clientX, t.clientY); };
  const onTouchEnd = (e: React.TouchEvent) => { e.preventDefault(); pointerUp(); };
  const onTouchMove = (e: React.TouchEvent) => { e.preventDefault(); const t = e.touches[0]; pointerMove(t.clientX, t.clientY); };

  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    pushHistory();
  };

  const undo = () => {
    const c = canvasRef.current;
    if (!c) return;
    if (history.length === 0) return clear();
    const [latest, ...rest] = history;
    const prev = rest[0];
    if (!prev) {
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      setHistory([]);
      setRedoStack([latest, ...redoStack]);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      setHistory(rest);
      setRedoStack((r) => [latest, ...r].slice(0, 20));
    };
    img.src = prev;
  };

  const redo = () => {
    const c = canvasRef.current;
    if (!c) return;
    const next = redoStack[0];
    if (!next) return;
    const img = new Image();
    img.onload = () => {
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      setHistory((h) => [next, ...h].slice(0,20));
      setRedoStack((r) => r.slice(1));
    };
    img.src = next;
  };

  const save = () => {
    const c = canvasRef.current;
    if (!c) return;
    const data = c.toDataURL();
    try {
      localStorage.setItem('doodle_saved', data);
    } catch (e) {
      // ignore
    }

    try { endSession('DoodleCanvas'); } catch {}
    const res = rounds.advance();
    if (!res.done) {
      // clear canvas for next round
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      pushHistory();
      try { startSession('DoodleCanvas'); } catch {}
    } else {
      // finished all rounds - keep drawing but could show a message
    }
  };

  const loadSaved = () => {
    const c = canvasRef.current;
    if (!c) return;
    const raw = localStorage.getItem('doodle_saved');
    if (!raw) return;
    const img = new Image();
    img.onload = () => {
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      pushHistory();
    };
    img.src = raw;
  };

  const exportPNG = () => {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement('a');
    link.href = c.toDataURL('image/png');
    link.download = 'doodle.png';
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Doodle Canvas</h2>
        <div className="flex items-center gap-2">
          <button onClick={clear} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Clear</button>
          <button onClick={undo} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Undo</button>
          <button onClick={redo} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Redo</button>
          <button onClick={save} className="px-3 py-1 bg-purple-600 text-white rounded-md">Save</button>
          <button onClick={loadSaved} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Load</button>
          <button onClick={exportPNG} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Export</button>
        </div>
      </div>

      <div className="mb-3 flex gap-2 items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => setTool('brush')} className={`px-3 py-1 rounded-md ${tool === 'brush' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>Brush</button>
          <button onClick={() => setTool('pen')} className={`px-3 py-1 rounded-md ${tool === 'pen' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>Pen</button>
          <button onClick={() => setTool('pencil')} className={`px-3 py-1 rounded-md ${tool === 'pencil' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>Pencil</button>
          <button onClick={() => setTool('eraser')} className={`px-3 py-1 rounded-md ${tool === 'eraser' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>Eraser</button>
        </div>
        <label className="text-sm text-gray-600">Color</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-8 p-0" />
        <label className="text-sm text-gray-600">Size</label>
        <input type="range" min={1} max={48} value={size} onChange={(e) => setSize(Number(e.target.value))} />
      </div>

      <div className="border rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          onTouchMove={onTouchMove}
          style={{ touchAction: 'none', width: '100%', height: '360px', display: 'block' }}
        />
      </div>

      <div className="mt-3 text-gray-600 text-sm">Draw freely — saving stores the image in your browser. Tools: brush, pen, pencil, eraser. Supports touch, undo/redo, export.</div>
    </div>
  );
};
