import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getTimeline } from '../services/api';
import type { Observation } from '../services/api';
import { ObservationCard } from '../components/ObservationCard';
import { CardSkeleton, ErrorBanner } from '../components/UIKits';

const Timeline: React.FC = () => {
  const { activeProject } = useOutletContext<{ activeProject: string }>();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 10;

  const fetchTimeline = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let currentObservationId: number | undefined = undefined;
      
      if (!reset && observations.length > 0) {
        currentObservationId = observations[observations.length - 1].id;
      }

      const response = await getTimeline({
        project: activeProject || undefined,
        limit,
        observation_id: currentObservationId,
      });

      const newObs = response || [];

      if (reset) {
        setObservations(newObs);
      } else {
        setObservations((prev) => [...prev, ...newObs]);
      }

      setHasMore(newObs.length === limit);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch timeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline(true);
  }, [activeProject]);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-mocha-text flex items-center gap-2">
          Global Timeline
          {activeProject && (
            <span className="text-sm font-normal text-mocha-lavender bg-mocha-lavender/10 px-2 py-0.5 rounded-full border border-mocha-lavender/20">
              Filtered: {activeProject}
            </span>
          )}
        </h2>
        <button
          onClick={() => fetchTimeline(true)}
          className="text-mocha-lavender hover:bg-mocha-lavender/10 px-3 py-1.5 rounded transition-colors text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {observations.length === 0 && !loading && !error && (
        <div className="text-center py-12 text-gray-500 bg-[#181825] rounded-lg border border-gray-800">
          <p>No observations found. {activeProject ? 'Try clearing the project filter.' : 'Wait for an agent to create some!'}</p>
        </div>
      )}

      <div className="space-y-4">
        {observations.map((obs, index) => (
          <ObservationCard key={`${obs.id}-${index}`} observation={obs} />
        ))}
      </div>

      {loading && (
        <div className="mt-4 space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {hasMore && !loading && !error && observations.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => fetchTimeline(false)}
            className="bg-mocha-lavender text-mocha-base px-6 py-2.5 rounded-md font-semibold hover:bg-opacity-90 transition-opacity"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Timeline;
