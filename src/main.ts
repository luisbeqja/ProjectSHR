import './style.css'
import { getUploadActivity, uploadActivityGpx } from './api/activities'
import { exchangeToken, getAccessToken, getAuthorizationUrl } from './api/utils'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Project Strava🦿</h1>
    <p class="read-the-docs">
      Upload any run to Strava with a single click
    </p>
    <div class="upload-container">
      <input type="file" id="gpxFile" accept=".gpx" />
      <button id="uploadButton" disabled>Upload GPX to Strava</button>
      <button id="checkStatusButton">Check Upload Status</button>
    </div>
    <p id="status"></p>
  </div>
`

const fileInput = document.querySelector<HTMLInputElement>('#gpxFile')!
const uploadButton = document.querySelector<HTMLButtonElement>('#uploadButton')!
const checkStatusButton = document.querySelector<HTMLButtonElement>('#checkStatusButton')!
const statusElement = document.querySelector<HTMLParagraphElement>('#status')!

// Keep track of the current upload ID
let currentUploadId: string | null = '14394554526';

// Enable/disable upload button based on file selection
fileInput.addEventListener('change', () => {
  uploadButton.disabled = !fileInput.files || fileInput.files.length === 0
  checkStatusButton.disabled = true // Reset check status button
  currentUploadId = null // Reset upload ID
})

// Handle checking the upload status
checkStatusButton.addEventListener('click', async () => {
  if (!currentUploadId) {
    statusElement.textContent = 'No active upload to check'
    return
  }

  const authUrl = await getAuthorizationUrl();
  console.log('Please visit this URL to authorize:', authUrl);
  const code = '47e2eca3e2b82fb5f3dfc2ce733cf89bd6abcc16';

  try {
    checkStatusButton.disabled = true
    statusElement.textContent = 'Checking upload status...'

    const tokens = await exchangeToken(code)
    const activity = await getUploadActivity(tokens.access_token, currentUploadId)
    
    if (activity.error) {
      statusElement.textContent = `Upload error: ${activity.error}`
    } else if (activity.status === 'Your activity is still being processed.') {
      statusElement.textContent = 'Activity is still processing...'
      checkStatusButton.disabled = false // Allow checking again
    } else {
      statusElement.textContent = `Upload status: ${activity.status}`
      if (activity.activity_id) {
        statusElement.textContent += ` - Activity ID: ${activity.activity_id}`
      }
    }
  } catch (error) {
    console.error('Status check failed:', error)
    statusElement.textContent = `Status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    checkStatusButton.disabled = false
  }
})

// Handle the upload when button is clicked
uploadButton.addEventListener('click', async () => {
  try {
    statusElement.textContent = 'Uploading...'
    uploadButton.disabled = true
    checkStatusButton.disabled = true

    const file = fileInput.files?.[0]
    if (!file) {
      throw new Error('Please select a GPX file')
    }

    const authUrl = await getAuthorizationUrl();
    console.log('Please visit this URL to authorize:', authUrl);
    const code = '110b68df6e8d7daed35e8921b157c774d13c9af5';

    const tokens = await exchangeToken(code)
    
    if (!tokens) {
      throw new Error('Not authenticated. Please log in first.')
    }
    
    const result = await uploadActivityGpx(tokens.access_token, file)
    
    if (result.id) {
      currentUploadId = result.id
      statusElement.textContent = 'Upload successful! Processing your activity...'
      checkStatusButton.disabled = false // Enable status check button
    } else {
      throw new Error('Upload failed: No upload ID received')
    }

    // Clear the file input
    fileInput.value = ''
    uploadButton.disabled = true
    
  } catch (error) {
    console.error('Upload failed:', error)
    statusElement.textContent = `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    uploadButton.disabled = false
    checkStatusButton.disabled = true
  }
})