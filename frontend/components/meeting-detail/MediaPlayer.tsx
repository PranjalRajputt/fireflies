'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react';

interface MediaPlayerProps {
  src: string;
  title: string;
  durationSeconds?: number;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

const MediaPlayer = forwardRef<HTMLAudioElement, MediaPlayerProps>(
  ({ src, title, durationSeconds = 900, currentTime, onTimeUpdate }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(durationSeconds);

    useImperativeHandle(ref, () => audioRef.current as HTMLAudioElement);

    // Sync external time changes (like clicking transcript lines or chapters)
    useEffect(() => {
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = currentTime;
        } catch (e) {}
      }
    }, [currentTime]);

    useEffect(() => {
      if (durationSeconds && durationSeconds > 0) {
        setDuration(durationSeconds);
      }
    }, [durationSeconds]);

    // Drive the slider and timer forward when playing
    useEffect(() => {
      let interval: any = null;
      if (isPlaying) {
        interval = setInterval(() => {
          const next = currentTime + 1;
          if (next >= duration) {
            setIsPlaying(false);
            onTimeUpdate(0);
            return;
          }
          onTimeUpdate(next);
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isPlaying, currentTime, duration, onTimeUpdate]);

    const togglePlay = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    };

    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      const current = audioRef.current.currentTime;
      if (!isNaN(current) && Math.abs(current - currentTime) > 1) {
        onTimeUpdate(current);
      }
    };

    const handleLoadedMetadata = () => {
      if (!audioRef.current) return;
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = time;
        } catch (e) {}
      }
      onTimeUpdate(time);
    };

    const formatTime = (seconds: number) => {
      if (isNaN(seconds)) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const skip = (amount: number) => {
      const newTime = Math.max(0, Math.min(duration, currentTime + amount));
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = newTime;
        } catch (e) {}
      }
      onTimeUpdate(newTime);
    };

    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-lg flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Audio Recording</span>
          <span className="text-xs text-gray-400 truncate max-w-[180px]">{title}</span>
        </div>

        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-300 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekChange}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div className="flex items-center justify-center space-x-6 pt-2">
          <button onClick={() => skip(-10)} className="text-gray-400 hover:text-white transition" title="Rewind 10s">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 transition shadow-md text-white"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button onClick={() => skip(10)} className="text-gray-400 hover:text-white transition" title="Forward 10s">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);

MediaPlayer.displayName = 'MediaPlayer';
export default MediaPlayer;