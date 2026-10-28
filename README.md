# GoodGather - Social Development Events Platform

A community-driven event management platform where citizens can **create**, **join**, and **track** social service initiatives in their local neighborhoods (Winter clothes distribution, blanket drives, lake cleanups, urban tree plantation, food relief, and health camps).

---

## 🌟 Tech Stack

* **FrontEnd & Backend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
* **Authentication & Authorization:** BetterAuth, MongoDB Adapter, JWT, BcryptJS
* **Database:** MongoDB (with dynamic query `.limit(6)` and fallback persistence)
* **UI & Notification:** Sonner (Toast), Lucide React, Next-Themes (Light/Dark Toggle)

---

## 🚀 Key Features

### 1. Navigation & Layout
* **App Branding:** Eye-catching logo and brand identity.
* **Upcoming Events Link:** Direct access to upcoming community drives.
* **Conditional Auth State:**
  * Logged out: Displays **Login** button.
  * Logged in: Displays profile picture avatar with **hover tooltip showing display name** and an explicit **Logout** button.
* **Profile Dropdown Menu:**
  * **Create Event** (Protected route)
  * **Manage Events** (Protected route)
  * **Joined Events** (Protected route)
* **Theme Customization:** Toggle between Light and Dark mode with instantaneous site-wide transitions.
* **Comprehensive Footer:** Social causes, volunteer guidelines, direct navigation, and community impact mission.

### 2. Authentication System
* **Login (`/login`):**
  * Email and password authentication.
  * Google login button (demo display placeholder as requested).
  * Forgot password button (placeholder as requested).
  * Link to registration page.
  * Full input validation and toast alerts.
* **Register (`/register`):**
  * Full Name, Email, photoURL, and Password.
  * **Strict Password Validation:**
    * At least one uppercase letter (`[A-Z]`)
    * At least one lowercase letter (`[a-z]`)
    * Minimum length of 6 characters
  * Visual live checklist and error toasts if criteria are not met.
  * Success toast alert upon registration.

### 3. Home Page (`/`)
* **Hero Banner Section:** Social development and community service theme with impact metrics and call-to-actions.
* **Platform Features:** Showcase community organizing, 1-click participation, creator controls, and strict future-date filtering.
* **Recent Upcoming Events (Dynamic):** Fetches 6 recent upcoming events from the database using MongoDB's `.limit(6)` operator and sorted by date.
* **Visual Gallery:** Photographs of community initiatives (Winter relief in Mirpur, blankets in Mohammadpur, Dhanmondi lake cleanup, tree plantation in Uttara).
* **Newsletter Section:** Cause alert subscription design.

### 4. Create Event Page (`/events/create` - Private)
* Accessible only to authenticated users (unauthenticated users are redirected to login).
* Form fields: Title, description, event type dropdown (Cleanup, Plantation, Donation, Winter Relief, Food Drive, Health Camp, Education), thumbnail URL, location, and event date.
* **Strict Future Date Validation:** Ensures past dates cannot be selected or submitted.
* Automatically attaches the creator's email to ensure creator ownership.
* Success toast alert and automatic redirect to `/events`.

### 5. Upcoming Events Page (`/events` - Public)
* Displays upcoming events in a responsive 3-column grid layout.
* **Upcoming-Only Guarantee:** Events whose dates have passed do not appear.
* Category filter tabs and keyword search.
* Each card includes thumbnail, title, location, event type badge, formatted event date, and **View Event** button.

### 6. Event Details Page (`/events/[id]` - Public)
* Publicly accessible to all visitors.
* Complete initiative breakdown, venue location, schedule, and verified organizer profile.
* **Functional Join Event Button:**
  * Prompts login if visitor is not authenticated.
  * If authenticated, commits user and event data into the database.
  * Displays confirmed volunteer count and list.
  * Allows toggling join/leave state with feedback toasts.

### 7. Joined Events Page (`/events/joined` - Private)
* Lists all community drives joined by the current logged-in user.
* Automatically sorted by event date.

### 8. Manage Events Page (`/events/manage` - Private)
* Displays all initiatives created by the logged-in user.
* **Update Event Modal:** Full form validation and future date check.
* **Delete Event:** Confirmation dialog and database cleanup.
* **Authorization Check:** Users can strictly update and delete only their own initiatives.

---

## 🛠️ Getting Started

### 1. Environment Variables
Create a `.env.local` file in the root directory (or use `.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017/goodgather
BETTER_AUTH_SECRET=goodgather_social_service_jwt_secret_token_2026_hermione
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
pnpm run build
pnpm start
```
