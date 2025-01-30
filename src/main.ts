import { setupStravaData } from './alpine/strava'
import Alpine from 'alpinejs'


Alpine.data('dropdown', setupStravaData)
Alpine.start()