import '../style.css'
import { uploadActivityGpx, getUploadActivity } from '../api/activities'
import { exchangeToken, getAuthorizationUrl } from '../api/utils'

const REFRESH_TOKEN = import.meta.env.VITE_STRAVA_REFRESH_TOKEN;
// Define the return type for better type checking
interface StravaState {
    currentUploadId: string | null;
    status: string;
    isUploadDisabled: boolean;
    isCheckDisabled: boolean;
    tokenCode: string;
    handleFileChange: (event: Event) => void;
    handleUpload: () => Promise<void>;
    checkStatus: () => Promise<void>;
    getAuthorizationUrlTokenCode: () => Promise<void>;
    initStravaApp: () => Promise<void>;
}

export function setupStravaData(): StravaState {
    return {
        currentUploadId: null,
        status: '',
        isUploadDisabled: true,
        isCheckDisabled: true,
        tokenCode: '',
        // handle file change
        handleFileChange(event: Event) {
            const input = event.target as HTMLInputElement
            this.isUploadDisabled = !input.files || input.files.length === 0
            this.isCheckDisabled = true
            this.currentUploadId = null
        },

        async handleUpload() {
            try {
                this.status = 'Uploading...'
                this.isUploadDisabled = true
                this.isCheckDisabled = true

                const fileInput = document.querySelector<HTMLInputElement>('#gpxFile')
                const file = fileInput?.files?.[0]
                if (!file) {
                    throw new Error('Please select a GPX file')
                }

                if (!this.tokenCode) {
                    throw new Error('Not authenticated. Please log in first.')
                }

                const result = await uploadActivityGpx(this.tokenCode, file)

                if (result.id) {
                    this.currentUploadId = result.id
                    this.status = 'Upload successful! Processing your activity...'
                    this.isCheckDisabled = false
                } else {
                    throw new Error('Upload failed: No upload ID received')
                }

                // Clear the file input
                if (fileInput) fileInput.value = ''
                this.isUploadDisabled = true

            } catch (error) {
                console.error('Upload failed:', error)
                this.status = `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                this.isUploadDisabled = false
                this.isCheckDisabled = true
            }
        },

        async checkStatus() {
            if (!this.currentUploadId) {
                this.status = 'No active upload to check'
                return
            }

            try {
                this.isCheckDisabled = true
                this.status = 'Checking upload status...'

                const activity = await getUploadActivity(this.tokenCode, this.currentUploadId)

                if (activity.error) {
                    this.status = `Upload error: ${activity.error}`
                } else if (activity.status === 'Your activity is still being processed.') {
                    this.status = 'Activity is still processing...'
                    this.isCheckDisabled = false
                } else {
                    this.status = `Upload status: ${activity.status}`
                    if (activity.activity_id) {
                        this.status += ` - Activity ID: ${activity.activity_id}`
                    }
                }
            } catch (error) {
                console.error('Status check failed:', error)
                this.status = `Status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                this.isCheckDisabled = false
            }
        },

        async getAuthorizationUrlTokenCode() {
            const authUrl = await getAuthorizationUrl()
            console.log('Please visit this URL to authorize:', authUrl)
            window.open(authUrl, '_blank')
        },

        async initStravaApp() {
            const urlParams = new URLSearchParams(window.location.search)
            const tokenCode = urlParams.get('code')
            if (tokenCode) {
                const tokens = await exchangeToken(tokenCode)
                localStorage.setItem('strava_access_token', tokens.access_token)
                this.tokenCode = tokens.access_token
            } else if (localStorage.getItem('strava_access_token')) {
                console.log('Access token found in localStorage')
                this.tokenCode = localStorage.getItem('strava_access_token') || ''
            }
        }
    }
} 