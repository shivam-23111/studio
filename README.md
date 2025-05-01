# CollabEdit

This is a Next.js application for collaborative file and code sharing, built within Firebase Studio.

## Getting Started

Follow these steps to download the code, set it up locally, and deploy it for free personal use.

**1. Download the Code:**

*   You will need the code files generated during our conversation. Ensure you have saved all the necessary files with their correct names and directory structure (e.g., `src/app/page.tsx`, `components/header.tsx`, etc.). Place them in a new project folder on your local machine.

**2. Prerequisites:**

*   **Node.js:** Make sure you have Node.js installed (which includes npm). You can download it from [nodejs.org](https://nodejs.org/). Version 18 or later is recommended.
*   **(Optional) Yarn:** You can use `npm` or `yarn` as your package manager. If you prefer Yarn, install it globally: `npm install --global yarn`.

**3. Install Dependencies:**

*   Open your terminal or command prompt.
*   Navigate to the project folder where you saved the code files.
*   Run the installation command:
    ```bash
    npm install
    # OR if using yarn
    # yarn install
    ```
    This will download all the necessary libraries defined in `package.json`.

**4. Set up Firebase (Required for Collaboration Features):**

*   **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project. The free "Spark" plan is sufficient for personal use.
*   **Enable Firestore:** In your Firebase project console, go to the "Firestore Database" section and create a database. Start in "test mode" for easy setup (remember to configure security rules properly before sharing).
*   **Get Firebase Config:**
    *   In your Firebase project console, go to Project Settings (gear icon).
    *   Scroll down to the "Your apps" section.
    *   Click the Web icon (`</>`) to register a new web app.
    *   Give it a nickname (e.g., "CollabEdit Web").
    *   Firebase will provide you with a configuration object ( `firebaseConfig`). Copy this object.
*   **Add Config to Environment Variables:**
    *   Create a file named `.env.local` in the root of your project folder (where `package.json` is).
    *   Paste the configuration values into this file, prefixing each key with `NEXT_PUBLIC_FIREBASE_`:
        ```.env.local
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
        NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
        # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID (Optional)
        ```
    *   Replace `YOUR_...` with the actual values from your `firebaseConfig`.
    *   _Note: Using `NEXT_PUBLIC_` makes these variables accessible in the browser. Be mindful not to expose sensitive keys if you add server-side secrets later._

**5. Run Locally:**

*   Start the development server:
    ```bash
    npm run dev
    # OR
    # yarn dev
    ```
*   Open your web browser and navigate to `http://localhost:9002` (or the port specified in the terminal).

**6. Build for Production:**

*   When you're ready to deploy, create a production-optimized build:
    ```bash
    npm run build
    # OR
    # yarn build
    ```
    This creates an optimized version of your app in the `.next` folder.

**7. Deploy for Free (Personal Use):**

Here are two popular free options:

*   **Option A: Vercel (Recommended for Next.js)**
    *   **Sign up:** Create an account at [vercel.com](https://vercel.com/) (free tier available).
    *   **Push to Git:** Push your project code to a Git repository (GitHub, GitLab, Bitbucket).
    *   **Import Project:** In your Vercel dashboard, import the Git repository.
    *   **Configure:** Vercel usually detects Next.js projects automatically. You'll need to add your Firebase environment variables (from `.env.local`) in the Vercel project settings (Settings -> Environment Variables). Do **not** commit your `.env.local` file to Git.
    *   **Deploy:** Vercel will build and deploy your application.

*   **Option B: Firebase Hosting**
    *   **Install Firebase CLI:** If you don't have it, install it globally: `npm install -g firebase-tools`
    *   **Login:** Login to Firebase: `firebase login`
    *   **Initialize:** In your project root, initialize Firebase: `firebase init hosting`
        *   Select "Use an existing project" and choose the Firebase project you created.
        *   Use `.next` as your public directory (Vercel handles this better, Firebase needs specific configuration for Next.js features like SSR/ISR, often requiring Cloud Functions. Vercel is generally simpler for Next.js). For a purely static export, you might configure `next.config.js` for static output, but CollabEdit likely requires server features. *Using Firebase Hosting might be more complex for a full-stack Next.js app compared to Vercel.*
        *   Configure as a single-page app (rewrite all urls to /index.html): Choose **No** for a standard Next.js app unless you are doing a static export.
        *   Set up automatic builds and deploys with GitHub: Optionally choose **Yes** if using GitHub Actions.
    *   **Build:** Run `npm run build` (or `yarn build`).
    *   **Deploy:** Deploy your site: `firebase deploy --only hosting`

Now you have your CollabEdit application running either locally or deployed! Remember to configure Firebase security rules for Firestore to protect your data if others will use your deployed version.
