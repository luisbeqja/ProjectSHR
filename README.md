
# **Project Strava Hack Run🚴‍♂️🏃‍♂️**  
A simple web app to upload GPX files to Strava with a single click.  
![Screenshot 2025-01-30 at 20 25 50](https://github.com/user-attachments/assets/cce18244-660e-441b-8996-adb1d3dd9529)

## **Features**  
✅ Upload GPX files directly to Strava.  
✅ Track the upload status of your activity.  
✅ Run kilometers without moving at all.

## **How to Use**  
1. Select a `.gpx` file from your device. 
3. Click **"Upload GPX to Strava"** to send the activity.  
4. Click **"Check Upload Status"** to verify if your activity is ready.  
5. Open Strava and check your activity history.  

## **Setup & Installation**  
1. Clone the repository:  
   ```sh
   git clone https://github.com/luisbeqja/project_shr.git
   cd project_shr
   ```
2. Install dependencies:  
   ```npm install```
3. Set up your Strava API credentials:  
   - Create an `.env` file and add:  
     ```env
      VITE_STRAVA_CLIENT_ID=your_client_id
      VITE_STRAVA_CLIENT_SECRET=your_client_secret
      VITE_STRAVA_REDIRECT_URI=your_redirect_uri
      VITE_STRAVA_ACCESS_TOKEN=your_access_token 
      VITE_STRAVA_REFRESH_TOKEN=your_refresh_token
     ```
4. Run the project locally:  
   ```sh
   npm run dev
   ```
5. Open your browser and visit:  
   ```http://localhost:5173```

## **Technologies Used**  
- Typescript  
- Strava API  
- Alpine Js  

🚀 **Enjoy your runs and rides with Strava!** 🚴‍♂️🏃‍♂️  
