// Constants for OAuth
const CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI;
const REFRESH_TOKEN = import.meta.env.VITE_STRAVA_REFRESH_TOKEN;
const SCOPE = 'activity:write,activity:read_all';

export async function getAuthorizationUrl() {
    return `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;
}

export async function exchangeToken(code: string) {
    const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            refresh_token: REFRESH_TOKEN,
            grant_type: 'authorization_code',
            scope: SCOPE,
        }),
    });
    return await response.json();
}

// Get the access token from localStorage
export function getAccessToken(): string | null {
    return localStorage.getItem('strava_access_token');
}