# Client Setup

This project now includes the current Firebase web config in code as a fallback, so the app can start on another laptop without adding Firebase values manually.

Important:
- Firebase auth and Firestore should work out of the box.
- AI features still need a real `GOOGLE_API_KEY` if you want Gemini-powered features to work.
- The current local project has `GOOGLE_API_KEY` blank, so AI features are not fully configured yet.

## WhatsApp Message To Send The Client

Copy this whole message and send it:

```text
Open VS Code and sign in to GitHub if asked.

Then open GitHub Copilot Chat in Agent mode and paste this exact prompt:

I want you to fully set up and run this project for me on this laptop.

Repository:
https://github.com/dishudhalwal12/wellness-hub.git

Please do all of this step by step:
1. Check whether Git is installed. If not, tell me exactly what to install and wait.
2. Check whether Node.js 20 or newer and npm are installed. If not, tell me exactly what to install and wait.
3. Clone the repository into a convenient folder.
4. Open the cloned project in VS Code.
5. Install all project dependencies with npm.
6. Create a `.env.local` file only if needed.
7. Use these Firebase values if the project asks for them:
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBCnaC7Q8EcASXbd3LYb5ycE7twOGVJeOI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=krishna-e9c59.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=krishna-e9c59
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=krishna-e9c59.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1048468387337
NEXT_PUBLIC_FIREBASE_APP_ID=1:1048468387337:web:614731f6b1a73b84b02ad8
GOOGLE_API_KEY=
GENAI_MODEL=
8. Start the app with the correct command from `package.json`.
9. Tell me the local URL where the app is running.
10. If any command fails, fix it automatically if possible, otherwise tell me the exact next action in one short sentence.

Do not explain the project to me. Just help me get it running locally.

If a terminal permission popup appears in VS Code, I approve it.
```

## Manual Backup Steps

If Copilot Agent is unavailable, the client can still run this manually:

```bash
git clone https://github.com/dishudhalwal12/wellness-hub.git
cd wellness-hub
npm install
npm run dev
```

The app should open at:

```text
http://localhost:9002
```
