# CollabEdit - Real-time Collaborative Editor

This is a **Next.js application** for collaborative file and code sharing, built with Firebase for real-time backend functionality.

**Current Status:** Functional with real-time features.
*   **Collaboration Features (Chat, Participants, File Syncing):** Implemented using Firebase Firestore for real-time updates.
*   **User Authentication:** Uses Firebase Anonymous Authentication to identify users within a session.
*   **File Sharing:** Files uploaded or edited are stored in Firestore and synced across all participants in the session.

## Getting Started (Running the Application Locally)

Follow these steps to download the code and run the application locally.

**1. Download the Code:**

*   Ensure you have all the necessary code files generated, maintaining the correct directory structure (e.g., `src/app/page.tsx`, `components/header.tsx`, etc.). Place them in a new project folder on your local machine.

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

**4. Set up Firebase:**

*   **Create a Firebase Project:** Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (free "Spark" plan is sufficient).
*   **Enable Firestore:** Go to "Firestore Database" and create a database. Start in "test mode" initially (remember to secure rules later).
*   **Enable Authentication:** Go to "Authentication" > "Sign-in method" and enable the "Anonymous" provider.
*   **Get Firebase Config:**
    *   Project Settings (gear icon) > Your apps > Web (`</>`).
    *   Register a web app (give it a nickname like "CollabEdit Web").
    *   Copy the `firebaseConfig` object presented.
*   **Add Config to `.env` file:**
    *   Open the `.env` file in your project root.
    *   **Replace the placeholder values** (`YOUR_API_KEY_HERE`, `YOUR_AUTH_DOMAIN_HERE`, etc.) with the actual values you copied from your Firebase project's `firebaseConfig`.
    *   **CRITICAL:** Ensure the keys start with `NEXT_PUBLIC_FIREBASE_` as shown in the `.env` file.
        ```.env
        # IMPORTANT: Replace these placeholder values with your actual Firebase project configuration!
        NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY_HERE"
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN_HERE"
        NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID_HERE"
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET_HERE"
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID_HERE"
        NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID_HERE"
        # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID_HERE" # Optional
        ```
    *   _Note:_ `NEXT_PUBLIC_` makes variables browser-accessible. **Do not commit your actual credentials to public Git repositories.** Add `.env` to your `.gitignore` file.

**5. Run the Application Locally:**

*   Start the development server:
    ```bash
    npm run dev
    # OR
    # yarn dev
    ```
*   Open your browser and go to `http://localhost:9002` (or the specified port).
*   Create or join sessions to test the collaboration features. Open multiple browser windows/tabs to simulate different users.

**6. Build for Production (Optional):**

*   To create an optimized build:
    ```bash
    npm run build
    # OR
    # yarn build
    ```

**7. Deploying the Application (Optional):**

You can deploy this application to platforms like Vercel or Firebase Hosting.

*   **Vercel (Recommended for Next.js):**
    *   Push code to Git (GitHub, GitLab, etc.). **Ensure `.env` is in your `.gitignore`!**
    *   Sign up at [vercel.com](https://vercel.com/).
    *   Import your Git repository. Vercel usually detects Next.js automatically.
    *   Add your Firebase environment variables in Vercel project settings (Settings -> Environment Variables). Use the same `NEXT_PUBLIC_FIREBASE_...` keys and your actual values.
    *   Deploy.

*   **Firebase Hosting:**
    *   Requires configuration for Next.js SSR/ISR features. Vercel is generally simpler.
    *   Install Firebase CLI: `npm install -g firebase-tools`
    *   Login: `firebase login`
    *   Initialize: `firebase init hosting` (choose your project, configure rewrites for Next.js).
    *   Set up Firebase environment variables: `firebase functions:config:set firebase.api_key="YOUR_API_KEY" firebase.auth_domain="YOUR_AUTH_DOMAIN" ...` (Note: these *don't* use the `NEXT_PUBLIC_` prefix when setting via CLI for functions/backend use, but you still need the `NEXT_PUBLIC_` ones for the frontend, typically set via Vercel or similar deployment platform env vars).
    *   Build: `npm run build`
    *   Deploy: `firebase deploy --only hosting,functions` (if using functions).

## Firestore Structure (Simplified)

*   **sessions / `{sessionId}`:**
    *   `ownerId`: (string) User ID of the creator.
    *   `createdAt`: (timestamp) Session creation time.
    *   `fileName`: (string) Current name of the shared file.
    *   `fileContent`: (string) Current content of the shared file.
    *   `lastUpdatedBy`: (string) User ID of the last editor.
    *   `updatedAt`: (timestamp) Last edit time.
    *   `participants`: (array of objects)
        *   `userId`: (string)
        *   `name`: (string)
        *   `joinedAt`: (timestamp)
*   **sessions / `{sessionId}` / messages / `{messageId}`:**
    *   `senderId`: (string)
    *   `senderName`: (string)
    *   `message`: (string)
    *   `timestamp`: (timestamp)

## Important Considerations

*   **Firestore Security Rules:** The initial "test mode" rules are insecure (`allow read, write: if true;`). **Before deploying to production or sharing widely, you MUST configure secure Firestore rules** to ensure only authenticated users within a specific session can read/write the relevant data.
*   **Scalability:** The current implementation uses direct client-side Firestore listeners. For very large documents or high participant counts, consider strategies like debouncing writes more aggressively, using diffing libraries, or potentially Cloud Functions for more complex logic.
*   **Error Handling:** More robust error handling can be added throughout the application.
