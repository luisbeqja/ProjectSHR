// Constants for OAuth
const CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI;

const SCOPE = 'activity:write,activity:read_all';

export async function getAuthorizationUrl() {
    return `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;
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

export async function uploadActivity(accessToken: string) {
    try {
        const response = await fetch('/src/assets/10krun.gpx');
        const blob = await response.blob();
        const file = new File([blob], '10krun.gpx', { type: 'application/gpx+xml' });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', 'Running from my computer');
        formData.append('data_type', 'gpx');
        formData.append('activity_id', '13412734859');

        const uploadResponse = await fetch("https://www.strava.com/api/v3/uploads", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
            body: formData
        });
        const data = await uploadResponse.json();
        console.log('Upload:', data);
        return data;
    } catch (error) {
        console.error('Error uploading activity:', error);
        throw error;
    }
}