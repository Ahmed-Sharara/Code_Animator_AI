
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-500"></div>
      <h2 className="text-xl font-semibold text-gray-200">Generating Animation...</h2>
      <p className="text-gray-400">The AI is thinking. This may take a moment.</p>
    </div>
  );
};

export default Loader;
