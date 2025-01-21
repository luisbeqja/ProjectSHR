
import fs from 'fs';
// Constants for OAuth
const CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI;

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
            grant_type: 'authorization_code',
        }),
    });
    return await response.json();
}

export async function getAthleteInfo(accessToken: string) {
    const response = await fetch("https://www.strava.com/api/v3/athlete", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
    });
    const data = await response.json();
    console.log(data);
    return data;
}



export async function createActivity(accessToken: string) {
    const response = await fetch("https://www.strava.com/api/v3/activities", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "Runnig from my computer",
            type: "Run",
            sport_type: "Run",
            start_date_local: new Date(),
            elapsed_time: 1812,
            description: "Running 10km in 30 minutes (With code ;))",
            distance: 11372,
            trainer: 1,
            commute: 0,
            location_country: "Belgium",
        })
    });
    const data = await response.json();
    console.log(data);
    return data;
}

export async function getActivities(accessToken: string) {
    const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
    });
    const data = await response.json();
    console.log(data);
    return data;
}

// /$ http post "https://www.strava.com/api/v3/uploads" file@/path/to/file name='value' description='value' trainer='value' commute='value' data_type='value' external_id='value' "Authorization: Bearer [[token]]"

export async function uploadActivity(accessToken: string) {
    const response = await fetch("https://www.strava.com/api/v3/uploads", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            file: fs.createReadStream('./src/assets/10krun.gpx'),
            name: "Running from my computer",
        })
    });
    const data = await response.json();
    console.log(data);
    return data;
}