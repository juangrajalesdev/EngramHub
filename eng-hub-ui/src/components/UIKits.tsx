export const CardSkeleton = () => {
  return (
    <div className="bg-[#181825] border border-gray-800 rounded-lg p-5 mb-4 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 w-1/2">
          <div className="h-6 bg-gray-700 rounded-full w-24"></div>
          <div className="h-6 bg-gray-700 rounded-full w-3/4"></div>
        </div>
        <div className="flex items-center gap-4 w-1/4">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export const ErrorBanner = ({ message }: { message: string }) => {
  return (
    <div className="bg-mocha-rose/10 border border-mocha-rose/20 text-mocha-rose rounded-lg p-4 mb-4 flex items-center gap-3">
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
      <div>
        <span className="font-medium">Error:</span> {message}
      </div>
    </div>
  );
};
