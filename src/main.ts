import { setupStravaData } from './alpine/strava'
import Alpine from 'alpinejs'


Alpine.data('stravaData', setupStravaData)
Alpine.start()