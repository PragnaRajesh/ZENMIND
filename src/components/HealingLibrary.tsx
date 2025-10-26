import React, { useEffect, useRef, useState } from 'react';
import { books } from '../data/books';
import { BookOpen, ExternalLink, Search } from 'lucide-react';
import { musicPlaylist } from '../data/music';
import { BreathingExercise } from './games/BreathingExercise';

export const HealingLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'books' | 'music'>('books');
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [playAllActive, setPlayAllActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const breathRef = useRef<any>(null);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnded = (index: number) => {
    const next = index + 1;
    if (playAllActive && next < musicPlaylist.length) {
      setTimeout(() => playTrackAt(next), 300);
    } else {
      setCurrentTrack(null);
      setPlayingIndex(null);
      setPlayAllActive(false);
      try { breathRef.current?.stop(); } catch (e) {}
    }
  };

  const playTrackAt = (index: number) => {
    const track = musicPlaylist[index];
    if (!track) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.url;
      audioRef.current.onended = () => handleEnded(index);
      audioRef.current.play().catch(() => {});
    } else {
      const a = new Audio(track.url);
      a.onended = () => handleEnded(index);
      audioRef.current = a;
      a.play().catch(() => {});
    }
    setCurrentTrack(track.id);
    setPlayingIndex(index);
    try { breathRef.current?.start(); } catch (e) {}
  };

  const playTrack = (trackUrl: string, id: string) => {
    const idx = musicPlaylist.findIndex((m) => m.id === id);
    if (idx !== -1) playTrackAt(idx);
  };

  const stopTrack = () => {
    if (audioRef.current) audioRef.current.pause();
    setCurrentTrack(null);
    setPlayingIndex(null);
    setPlayAllActive(false);
    try { breathRef.current?.stop(); } catch (e) {}
  };

  const playAll = () => {
    setPlayAllActive(true);
    playTrackAt(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center mb-4">
          <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Healing Library</h1>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setView('books')} className={`px-4 py-2 rounded ${view === 'books' ? 'bg-purple-600 text-white' : 'bg-white border'}`}>Books</button>
          <button onClick={() => setView('music')} className={`px-4 py-2 rounded ${view === 'music' ? 'bg-purple-600 text-white' : 'bg-white border'}`}>Music</button>
        </div>
        {view === 'books' && (
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        )}
        {view === 'music' && (
          <div className="w-full max-w-md relative">
            <div className="text-sm text-gray-500">Healing music playlist — play to start a guided breathing exercise with voice prompts.</div>
          </div>
        )}
      </div>

      {view === 'books' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-4">by {book.author}</p>
                <p className="text-gray-500 mb-4">{book.description}</p>
                <a href="#" className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors">Learn more <ExternalLink className="h-4 w-4 ml-1" /></a>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'music' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Relaxing Meditation Music Playlist</h2>
            <div className="space-y-3">
              {musicPlaylist.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-sm text-gray-500">{t.artist} — {Math.round(t.duration/60)}:{('0'+(t.duration%60)).slice(-2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentTrack === t.id ? (
                      <button onClick={stopTrack} className="px-3 py-1 bg-red-100 text-red-700 rounded-md">Stop</button>
                    ) : (
                      <button onClick={() => playTrack(t.url, t.id)} className="px-3 py-1 bg-purple-600 text-white rounded-md">Play</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Guided Breathing</h2>
            <BreathingExercise ref={breathRef} guidance initialCycles={3} />
          </div>
        </div>
      )}

    </div>
  );
};
