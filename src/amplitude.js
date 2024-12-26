import { init } from '@amplitude/analytics-browser';

// Initialize Amplitude with your API key and defaultTracking option
init('5536de7451587432e3c4a5b69028c1ba', {
  defaultTracking: true,
});

export const amplitude = window.amplitude;
