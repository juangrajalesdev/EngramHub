import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { formatDistanceToNow } from 'date-fns';
import { Tag, User, Clock, CheckCircle2, AlertCircle, Zap, GitCommit, BookOpen } from 'lucide-react';

interface Observation {
  ID: number;
  Title: string;
  Project: string | null;
  Type: string;
  Author: string | null;
  CreatedAt: string;
  Content: string;
  Snippet?: string; // Optional snippet for search results
}

interface ObservationCardProps {
  observation: Observation;
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'bugfix': return 'text-mocha-rose bg-mocha-rose/10 border-mocha-rose/20';
    case 'decision': return 'text-mocha-lavender bg-mocha-lavender/10 border-mocha-lavender/20';
    case 'architecture': return 'text-mocha-sapphire bg-mocha-sapphire/10 border-mocha-sapphire/20';
    case 'discovery': return 'text-mocha-yellow bg-mocha-yellow/10 border-mocha-yellow/20';
    case 'pattern': return 'text-mocha-green bg-mocha-green/10 border-mocha-green/20';
    case 'config': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    default: return 'text-mocha-text bg-gray-500/10 border-gray-500/20';
  }
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'bugfix': return AlertCircle;
    case 'decision': return CheckCircle2;
    case 'architecture': return GitCommit;
    case 'discovery': return Zap;
    case 'pattern': return BookOpen;
    default: return Tag;
  }
};

export const ObservationCard: React.FC<ObservationCardProps> = ({ observation }) => {
  const Icon = getTypeIcon(observation.Type);
  const colorClasses = getTypeColor(observation.Type);

  return (
    <div className="bg-[#181825] border border-gray-800 rounded-lg p-5 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses}`}>
            <Icon className="w-3.5 h-3.5" />
            {observation.Type.toUpperCase()}
          </span>
          <h3 className="text-lg font-bold text-mocha-text">{observation.Title}</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {observation.Project && (
            <span className="flex items-center gap-1 bg-[#1e1e2e] px-2 py-1 rounded">
              <Tag className="w-3 h-3 text-mocha-lavender" />
              {observation.Project}
            </span>
          )}
          {observation.Author && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {observation.Author}
            </span>
          )}
          <span className="flex items-center gap-1" title={new Date(observation.CreatedAt).toLocaleString()}>
            <Clock className="w-3.5 h-3.5" />
            {formatDistanceToNow(new Date(observation.CreatedAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-[#1e1e2e] prose-pre:border prose-pre:border-gray-800 text-gray-300">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            strong: ({node, ...props}) => <strong className="text-mocha-lavender font-semibold" {...props} />,
          }}
        >
          {observation.Content}
        </ReactMarkdown>
      </div>
      
      {/* If there's a snippet (from search), display it below */}
      {observation.Snippet && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-sm text-gray-400 italic">Matching snippet:</p>
          <div 
            className="mt-2 text-sm text-mocha-text bg-[#1e1e2e] p-3 rounded border border-gray-800 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: observation.Snippet }} 
          />
        </div>
      )}
    </div>
  );
};
