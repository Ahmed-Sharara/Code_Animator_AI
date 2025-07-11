
import React from 'react';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import NextIcon from './icons/NextIcon';
import PrevIcon from './icons/PrevIcon';
import ResetIcon from './icons/ResetIcon';
import SpeakerOnIcon from './icons/SpeakerOnIcon';
import SpeakerOffIcon from './icons/SpeakerOffIcon';

interface AnimationControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  isVoiceEnabled: boolean;
  description: string;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onScrub: (step: number) => void;
  onToggleVoice: () => void;
}

const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode, title: string }> = ({ onClick, children, title }) => (
    <button onClick={onClick} title={title} className="text-gray-300 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed" >
        {children}
    </button>
);


const AnimationControls: React.FC<AnimationControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  isVoiceEnabled,
  description,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  onScrub,
  onToggleVoice
}) => {
  return (
    <div className="bg-gray-800/60 p-4 mt-4 rounded-lg border border-gray-700 flex flex-col gap-4 w-full">
        <div className="text-center text-sky-300 min-h-[40px] flex items-center justify-center font-mono px-4">
            <p>{description}</p>
        </div>

        <div className="flex items-center gap-6 w-full">
            {/* Playback Controls */}
            <div className="flex items-center gap-4">
                <ControlButton onClick={onReset} title="Reset">
                    <ResetIcon />
                </ControlButton>
                <ControlButton onClick={onPrev} title="Previous Step">
                    <PrevIcon />
                </ControlButton>
                <ControlButton onClick={onPlayPause} title={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </ControlButton>
                <ControlButton onClick={onNext} title="Next Step">
                    <NextIcon />
                </ControlButton>
            </div>
            
            {/* Slider */}
            <div className="flex-grow flex items-center gap-3">
                <span className="text-xs text-gray-400 font-mono w-16 text-center">
                    {currentStep + 1} / {totalSteps}
                </span>
                <input
                    type="range"
                    min={-1}
                    max={totalSteps - 1}
                    value={currentStep}
                    onChange={(e) => onScrub(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
            </div>

            {/* Voice Control */}
             <div className="flex items-center">
                <ControlButton onClick={onToggleVoice} title={isVoiceEnabled ? "Disable Voice" : "Enable Voice"}>
                    {isVoiceEnabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
                </ControlButton>
            </div>
        </div>
    </div>
  );
};

export default AnimationControls;
