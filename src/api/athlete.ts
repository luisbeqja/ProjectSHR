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
