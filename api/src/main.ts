import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { getAthleteInfo, createActivity, getAuthorizationUrl, exchangeToken, getActivities, uploadActivity } from './api.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

const accessToken = import.meta.env.VITE_STRAVA_ACCESS_TOKEN;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
getAthleteInfo(accessToken)
getActivities(accessToken)

async function main() {
    try {
        // 1. Get the authorization URL
        const authUrl = await getAuthorizationUrl();
        console.log('Please visit this URL to authorize:', authUrl);
        
        // 2. After user authorizes, they'll be redirected to the callback URL with a code
        // For testing, you can copy the 'code' parameter from the redirect URL and paste it here
        const code = '9977f2de8e81a42a3b3a5156f2036145dfda2b9c'; // Replace this with the actual code from redirect URL

        // 3. Exchange the code for tokens
        const tokens = await exchangeToken(code);
        console.log('Received tokens:', tokens);
        
        // 4. Use the access token to create an activity
        if (tokens.access_token) {
            //const activity = await createActivity(tokens.access_token);
            //const activities = await getActivities(tokens.access_token);
            //const upload = await uploadActivity(tokens.access_token);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();