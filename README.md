# CollabEdit - Prototype

This is a **Next.js application prototype** for collaborative file and code sharing, built within Firebase Studio.

**Current Status:** This is a functional **prototype**. It demonstrates the user interface and local file handling.
*   **Collaboration Features (Chat, Participants, Session Sharing):** Currently **simulated** with dummy data. Real-time collaboration requires setting up and integrating a Firebase backend (Firestore).
*   **File Sharing:** Files uploaded or edited are currently handled **locally** within your browser session and are **not shared** with others.

## Getting Started (Running the Prototype Locally)

Follow these steps to download the code and run the prototype locally.

**1. Download the Code:**

*   Ensure you have all the necessary code files generated during our conversation, maintaining the correct directory structure (e.g., `src/app/page.tsx`, `components/header.tsx`, etc.). Place them in a new project folder on your local machine.

**2. Prerequisites:**

*   **Node.js:** Make sure you have Node.js installed (which includes npm). Download it from [nodejs.org](https://nodejs.org/). Version 18 or later is recommended.
*   **(Optional) Yarn:** Use `npm` or `yarn`. If you prefer Yarn, install it: `npm install --global yarn`.

**3. Install Dependencies:**

*   Open your terminal or command prompt.
*   Navigate to the project folder.
*   Run:
    ```bash
    npm install
    # OR
    # yarn install
    ```

**4. (Optional - For Future Backend Integration) Set up Firebase:**

*   _This step is **not required** to run the current prototype, but you'll need it to enable real collaboration features later._
*   **Create a Firebase Project:** Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (free "Spark" plan is sufficient).
*   **Enable Firestore:** Go to "Firestore Database" and create a database. Start in "test mode" initially (remember to secure rules later).
*   **Get Firebase Config:**
    *   Project Settings (gear icon) > Your apps > Web (`</>`).
    *   Register a web app and copy the `firebaseConfig` object.
*   **Add Config to Environment Variables:**
    *   Create `.env.local` in your project root.
    *   Paste the config, prefixing keys with `NEXT_PUBLIC_FIREBASE_`:
        ```.env.local
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
        NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
        # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID (Optional)
        ```
    *   Replace `YOUR_...` with your actual values.
    *   _Note:_ `NEXT_PUBLIC_` makes variables browser-accessible.

**5. Run the Prototype Locally:**

*   Start the development server:
    ```bash
    npm run dev
    # OR
    # yarn dev
    ```
*   Open your browser and go to `http://localhost:9002` (or the specified port).
*   You can interact with the UI, upload local files (they won't be shared), and see the simulated chat/participants.

**6. Build for Production (Optional):**

*   To create an optimized build (still without backend features unless integrated):
    ```bash
    npm run build
    # OR
    # yarn build
    ```

**7. Deploying the Prototype (Optional):**

You can deploy this prototype version for free to show the UI. Remember, collaboration features **will not work** without the backend.

*   **Vercel (Recommended):**
    *   Push code to Git (GitHub, GitLab, etc.).
    *   Sign up at [vercel.com](https://vercel.com/).
    *   Import your Git repository. Vercel usually detects Next.js automatically.
    *   (Optional for backend) Add Firebase environment variables in Vercel project settings (Settings -> Environment Variables). **Do not commit `.env.local` to Git.**
    *   Deploy.

*   **Firebase Hosting:**
    *   Requires more setup for Next.js features. Vercel is generally simpler for Next.js apps.
    *   Install Firebase CLI: `npm install -g firebase-tools`
    *   Login: `firebase login`
    *   Initialize: `firebase init hosting` (choose your project, use `.next` as public directory, say No to single-page app rewrite unless doing static export).
    *   Build: `npm run build`
    *   Deploy: `firebase deploy --only hosting`

## Next Steps (Enabling Collaboration)

To make CollabEdit fully functional:

1.  **Implement Firebase Backend:**
    *   Set up Firestore database structure for sessions, files, chat messages, and participants.
    *   Write backend logic (potentially using Firebase Functions or integrated within Next.js API routes/Server Actions) to:
        *   Create and manage unique collaboration sessions.
        *   Handle real-time updates for file content using Firestore listeners.
        *   Store and retrieve chat messages.
        *   Manage participant lists (joining/leaving).
        *   Implement user authentication (Firebase Auth) if needed.
2.  **Connect Frontend to Backend:**
    *   Replace placeholder logic in `src/components/session-manager.tsx` and `src/components/collaboration-sidebar.tsx` with actual Firebase calls (e.g., using `firebase/firestore` SDK).
    *   Modify `src/components/file-editor.tsx` to read/write file content to/from Firestore in real-time.
3.  **Configure Firestore Security Rules:** Ensure only authorized users can access and modify data in the correct sessions.

This prototype provides the foundation UI. The next major step is the backend integration for real-time collaboration.
