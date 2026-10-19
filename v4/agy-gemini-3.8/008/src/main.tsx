import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { proceduralAudio } from './engine/ProceduralAudioEngine';
import './index.css';

// Expose audio engine for headless DSP verification and automated testing
(window as unknown as { __proceduralAudio: unknown }).__proceduralAudio = proceduralAudio;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
