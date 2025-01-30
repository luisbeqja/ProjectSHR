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


export async function uploadActivityGpx(accessToken: string, gpxFile: File) {
    try {
        const formData = new FormData();
        formData.append('file', gpxFile);
        formData.append('name', 'Running from my computer');
        formData.append('data_type', 'gpx');

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

export async function getUploadActivity(accessToken: string, activityId: string) {
    console.log('Getting uploaded activity:', activityId);
    const response = await fetch(`https://www.strava.com/api/v3/uploads/${activityId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    console.log('Uploaded activity:', data);
    return data;
}