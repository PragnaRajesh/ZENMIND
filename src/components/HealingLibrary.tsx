import React, { useState } from 'react';
import { books } from '../data/books';
import { BookOpen, ExternalLink, Search } from 'lucide-react';

export const HealingLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center mb-4">
          <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Healing Library</h1>
        </div>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-4">by {book.author}</p>
              <p className="text-gray-500 mb-4">{book.description}</p>
              <a
                href="#"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
              >
                Learn more <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No books found matching your search criteria.
        </div>
      )}
    </div>
  );
};