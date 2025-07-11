
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimationPlan, AnimationElement } from '../types';
import AnimationCanvas from './AnimationCanvas';
import AnimationControls from './AnimationControls';

interface AnimationPlayerProps {
  plan: AnimationPlan;
}

const AnimationPlayer: React.FC<AnimationPlayerProps> = ({ plan }) => {
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1 is initial state before step 0
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const totalSteps = plan.steps.length;

  useEffect(() => {
    const getAndSetVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;

      // Heuristic to find a "better" voice
      // 1. Prefer Google voices if available (often higher quality)
      let bestVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'));
      
      // 2. If not, prefer local voices over remote ones
      if (!bestVoice) {
        bestVoice = voices.find(v => v.localService && v.lang.startsWith('en'));
      }

      // 3. As a fallback, take the first available English voice
      if (!bestVoice) {
        bestVoice = voices.find(v => v.lang.startsWith('en'));
      }

      setSelectedVoice(bestVoice || voices[0] || null);
    };

    // Voices load asynchronously.
    getAndSetVoice();
    window.speechSynthesis.onvoiceschanged = getAndSetVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);


  const displayedElements = useMemo<AnimationElement[]>(() => {
    // Start with a deep copy of the initial elements
    let elementsById: Map<string, AnimationElement> = new Map(
      JSON.parse(JSON.stringify(plan.elements)).map((el: AnimationElement) => [el.id, el])
    );

    // Apply actions for all steps up to the current one
    for (let i = 0; i <= currentStep; i++) {
      if (i >= plan.steps.length) continue;
      const step = plan.steps[i];
      for (const action of step.actions) {
        const element = elementsById.get(action.elementId);
        if (element) {
          switch (action.type) {
            case 'UPDATE':
              element.style = { ...element.style, ...action.payload };
              break;
            case 'FADE_IN':
              element.style.opacity = 1;
              break;
            case 'FADE_OUT':
              element.style.opacity = 0;
              break;
          }
        }
      }
    }
    return Array.from(elementsById.values());
  }, [currentStep, plan]);

  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
  },[]);

  useEffect(() => {
    stopSpeech();

    if (isVoiceEnabled && currentStep >= 0 && currentStep < totalSteps) {
      const description = plan.steps[currentStep].description;
      const utterance = new SpeechSynthesisUtterance(description);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
    
    return () => {
        stopSpeech();
    }
  }, [currentStep, isVoiceEnabled, plan.steps, totalSteps, stopSpeech, selectedVoice]);


  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      const stepData = plan.steps[currentStep];
      const duration = (currentStep >= 0 && stepData?.duration) ? stepData.duration : 1500;

      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, duration);
      
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= totalSteps - 1) {
        setIsPlaying(false);
    }
  }, [isPlaying, currentStep, totalSteps, plan.steps]);

  const handlePlayPause = useCallback(() => {
    stopSpeech();
    if (currentStep >= totalSteps - 1) {
        setCurrentStep(-1);
        setIsPlaying(true);
    } else {
        setIsPlaying(prev => !prev);
    }
  }, [currentStep, totalSteps, stopSpeech]);

  const handleNext = useCallback(() => {
    stopSpeech();
    setIsPlaying(false);
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps, stopSpeech]);

  const handlePrev = useCallback(() => {
    stopSpeech();
    setIsPlaying(false);
    setCurrentStep(prev => Math.max(prev - 1, -1));
  }, [stopSpeech]);

  const handleReset = useCallback(() => {
    stopSpeech();
    setIsPlaying(false);
    setCurrentStep(-1);
  }, [stopSpeech]);
  
  const handleScrub = useCallback((step: number) => {
    stopSpeech();
    setIsPlaying(false);
    setCurrentStep(step);
  }, [stopSpeech]);
  
  const handleToggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => {
        const isTurningOff = !prev === false;
        if (isTurningOff) {
            stopSpeech();
        }
        return !prev;
    })
  }, [stopSpeech]);

  const currentDescription = currentStep >= 0 && currentStep < totalSteps 
    ? plan.steps[currentStep].description 
    : "Initial state. Press play to begin.";

  return (
    <div className="w-full h-full flex flex-col">
      <AnimationCanvas elements={displayedElements} scene={plan.scene} />
      <AnimationControls
        currentStep={currentStep}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        description={currentDescription}
        isVoiceEnabled={isVoiceEnabled}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
        onScrub={handleScrub}
        onToggleVoice={handleToggleVoice}
      />
    </div>
  );
};

export default AnimationPlayer;
