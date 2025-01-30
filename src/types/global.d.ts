import type { setupStravaData } from '../alpine/strava'

interface Alpine {
  data(name: string, callback: () => any): void;
  [key: string]: any;
}

declare global {
  interface Window {
    setupStravaData: typeof setupStravaData;
    Alpine: Alpine;
  }
} 