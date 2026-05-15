# User Analytics Application

A simple full-stack user analytics application built for the CausalFunnel assignment. It tracks page views and clicks from a demo webpage, stores events in MongoDB, and displays session journeys and click heatmap data in a Next.js dashboard.

## Tech Stack

- **Frontend Dashboard:** Next.js, React, TypeScript, Tailwind CSS
- **Backend API:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Tracking Script:** Vanilla JavaScript
- **Deployment:** Backend can be hosted on Render; frontend can be hosted on Vercel or any Next.js-compatible platform

## Features

- Tracks `page_view` events
- Tracks `click` events with x/y coordinates
- Stores a persistent `session_id` in browser localStorage
- Sends event data to the backend API
- Lists sessions with total event counts
- Shows ordered event history for a selected session
- Displays click positions for a selected page URL as a simple heatmap

## Project Structure

```txt
backend/    Express API and MongoDB event model
frontend/   Next.js analytics dashboard
tracking/   Vanilla JS tracker and demo HTML page
```

## Setup Steps

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd "User Analytics Application"
```

### 2. Set up MongoDB

Create a MongoDB database using MongoDB Atlas or a local MongoDB instance.

Example MongoDB URI:

```txt
mongodb+srv://<username>:<password>@<cluster-url>/user-analytics
```

### 3. Run the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=3001
MONGODB_URI=<your-mongodb-uri>
```

Start the backend server:

```bash
npm run dev
```

The backend will run at:

```txt
http://localhost:3001
```

Available API endpoints:

```txt
POST   /api/events
GET    /api/sessions
GET    /api/sessions/:sessionId/events
GET    /api/heatmap?page_url=<page-url>
GET    /api/pages-with-clicks
```

### 4. Run the frontend dashboard

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

The dashboard will run at:

```txt
http://localhost:3000
```

Dashboard pages:

```txt
/sessions
/heatmap
```

### 5. Test the tracking script

Open `tracking/demo.html` in a browser.

The demo page includes the tracker script:

```html
<script
  src="./tracker.js"
  data-endpoint="http://localhost:3001/api/events">
</script>
```

If the backend is deployed, replace the endpoint with the deployed backend URL:

```html
<script
  src="./tracker.js"
  data-endpoint="https://your-backend-url.onrender.com/api/events">
</script>
```

Visit the demo page and click around. Then open the dashboard to view sessions and heatmap data.

## Assumptions and Trade-offs

- Session identity is stored in `localStorage` instead of cookies. This keeps the tracker simple and avoids cookie configuration issues, but sessions are browser/device-specific and will reset if localStorage is cleared.

- A session does not currently expire after inactivity. The same `session_id` is reused until localStorage is cleared, which is acceptable for this demo but a production system would define session timeout rules.

- The tracker records only `page_view` and `click` events, as required by the assignment. It does not track scroll depth, form input, navigation timing, referrer, device metadata, or user identity.

- Click coordinates are stored as viewport coordinates using `clientX` and `clientY`. This makes the implementation lightweight, but heatmap accuracy can vary across screen sizes and responsive layouts. A production heatmap would also store viewport dimensions, page dimensions, element metadata, and scroll offset.

- Events are sent immediately from the browser using `fetch` with `keepalive`. Failed network requests are ignored so the demo page is not affected by analytics failures. A production tracker would likely add batching, retries, throttling, and offline buffering.

- The backend stores raw events in a single MongoDB `events` collection. This keeps querying simple for sessions and heatmaps, but very large traffic volumes would benefit from aggregation tables, background jobs, pagination, and retention policies.

- The dashboard fetches live data directly from the API and uses manual refresh. Real-time updates through WebSockets or polling were skipped to keep the app focused on the assignment requirements.

- The heatmap is a simple visual dot map rather than a full density-based heatmap. This satisfies the requirement to display click positions visually while avoiding unnecessary charting complexity.

- This demo does not include login or separate accounts. It assumes all analytics data is for one project only.

