
import React, { useState, useCallback } from 'react';
import { AnimationPlan } from './types';
import { generateAnimationPlan } from './services/geminiService';
import { exampleAnimations } from './data/example-animations';
import AnimationPlayer from './components/AnimationPlayer';
import Loader from './components/Loader';

const InspirationCard: React.FC<{ title: string; description: string; onClick: () => void; }> = ({ title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-700 hover:border-sky-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
  >
    <h3 className="font-bold text-sky-400">{title}</h3>
    <p className="text-sm text-gray-400 mt-1">{description}</p>
  </button>
);


const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [numSteps, setNumSteps] = useState<number>(10);
  const [animationPlan, setAnimationPlan] = useState<AnimationPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewedInspiration, setViewedInspiration] = useState<boolean>(false);

  const handleSubmit = useCallback(async (currentPrompt: string, steps: number) => {
    if (!currentPrompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnimationPlan(null);
    setViewedInspiration(false);
    
    try {
      const plan = await generateAnimationPlan(currentPrompt, steps);
      setAnimationPlan(plan);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleInspirationClick = (plan: AnimationPlan) => {
    setError(null);
    setAnimationPlan(plan);
    setPrompt('');
    setViewedInspiration(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-500">
          Code Animator AI
        </h1>
        <p className="text-gray-400 mt-2">
          Visualize code concepts and algorithms with AI-generated animations.
        </p>
      </header>

      <main className="flex-grow flex flex-col items-center">
        <div className="w-full max-w-4xl mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(prompt, numSteps);
            }}
            className="flex flex-col sm:flex-row gap-3 items-center"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., How a for loop works"
              className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition w-full"
              disabled={isLoading}
            />
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <label htmlFor="num-steps" className="text-gray-400 text-sm font-medium whitespace-nowrap">Max Steps:</label>
              <input
                id="num-steps"
                type="number"
                value={numSteps}
                onChange={(e) => setNumSteps(Math.max(3, Math.min(30, Number(e.target.value))))}
                min="3"
                max="30"
                className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 w-20 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 flex items-center justify-center self-stretch sm:self-auto"
              disabled={isLoading}
            >
              Generate
            </button>
          </form>
        </div>

        <div className="w-full flex-grow flex items-center justify-center p-4 bg-gray-800/50 rounded-xl border border-gray-700 shadow-2xl">
          {isLoading && <Loader />}
          {error && <div className="text-red-400 text-center p-8 bg-red-900/20 rounded-lg">{`Error: ${error}`}</div>}
          {!isLoading && !error && animationPlan && (
            <AnimationPlayer plan={animationPlan} key={viewedInspiration ? animationPlan.steps[0].description : JSON.stringify(animationPlan)} />
          )}
          {!isLoading && !error && !animationPlan && (
             <div className="text-center text-gray-500 w-full max-w-4xl">
              <p className="text-2xl mb-4">Enter a topic above or get started with an example.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exampleAnimations.map(ex => (
                  <InspirationCard 
                    key={ex.title}
                    title={ex.title}
                    description={ex.description}
                    onClick={() => handleInspirationClick(ex.plan)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;