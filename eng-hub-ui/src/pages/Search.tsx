import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { searchObservations } from '../services/api';
import type { Observation } from '../services/api';
import { ObservationCard } from '../components/ObservationCard';
import { CardSkeleton, ErrorBanner } from '../components/UIKits';
import { Search as SearchIcon } from 'lucide-react';

const SearchPage: React.FC = () => {
  const { activeProject } = useOutletContext<{ activeProject: string }>();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Observation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await searchObservations(searchQuery, {
        project: activeProject || undefined,
      });
      setResults(response.Observations || []);
    } catch (err: any) {
      setError(err.message || 'Failed to perform search.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, activeProject]);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search semantic memory, bugs, patterns, code snippets..."
          className="w-full pl-12 pr-4 py-4 text-lg bg-[#181825] border border-gray-700 rounded-lg text-mocha-text placeholder-gray-500 focus:outline-none focus:border-mocha-lavender focus:ring-1 focus:ring-mocha-lavender shadow-sm transition-all"
        />
        {activeProject && (
          <div className="absolute right-4 top-4 bg-mocha-lavender/10 text-mocha-lavender px-2 py-1 rounded text-xs font-semibold">
            In {activeProject}
          </div>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      {loading && (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!loading && !error && query.trim() !== '' && results.length === 0 && (
        <div className="text-center py-16 text-gray-500 bg-[#181825] rounded-lg border border-gray-800">
          <p className="text-lg">No matches found for "{query}".</p>
          <p className="text-sm mt-2">Try different keywords or clearing the project filter.</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((obs) => (
          <ObservationCard key={obs.id} observation={obs} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
