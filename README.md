# Wellness Hub: Your AI-Powered Clinical Copilot

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E44AD?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)

**Wellness Hub** is a state-of-the-art, AI-powered clinical operations platform designed to act as a **copilot for doctors**. Our vision is to empower private practitioners by automating administrative burdens, amplifying diagnostic capabilities, and streamlining every facet of clinic management. We handle the operational complexities so you can focus on what truly matters: your patients.

## ✨ Features

- **🤖 AI Diagnostic Copilot**: Upload patient reports and get AI-powered analysis, including summaries, potential diagnoses, and follow-up questions.
- **💬 AI Reception Assistant**: A conversational AI to manage patient queues and clinic tasks in real-time.
- **📝 AI Smart Notes**: Draft clinical SOAP notes with an AI assistant providing suggestions.
- **💸 AI Smart Billing**: Get AI-suggested ICD/CPT codes from visit notes.
- **📈 Practice Insights**: Generate reports on patient trends, revenue, and marketing.
- **👨‍⚕️ Patient Management**: A centralized hub for all patient information.
- **📋 Task & Care Plan Manager**: A visual Kanban board to manage clinic tasks.
- **📹 Telehealth**: Secure, one-click video consultations.
- **🔐 Role-Based Access**: Tailored experiences for Doctors, Admins, and Staff.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20.9 or later)
- [npm](https://www.npmjs.com/)
- [Firebase Account](https://firebase.google.com/)
- [Google AI API Key](https://ai.google.dev/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dishudhalwal12/wellness-hub.git
    cd wellness-hub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Firebase is prefilled in code as a fallback for this project, so the app can still boot without a local Firebase env file. If you want to override Firebase locally or enable AI features, create a `.env.local` file in the root of the project and add:

    ```env
    # Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=

    # Google AI
    GOOGLE_API_KEY=
    GENAI_MODEL=
    ```

    If `GOOGLE_API_KEY` is left blank, the app can still run, but Gemini-powered AI features will stay unavailable.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

5.  **Run the Genkit AI flows:**
    In a separate terminal, run the following command to start the Genkit AI flows:
    ```bash
    npm run genkit:watch
    ```

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
- **AI:** [Google Gemini](https://ai.google.dev/), [Genkit](https://firebase.google.com/docs/genkit)
- **UI:** [Shadcn UI](https://ui.shadcn.com/), [Recharts](https://recharts.org/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)

## 📂 Project Structure

```
/
├── src/
│   ├── app/         # Next.js app router, pages and layouts
│   ├── ai/          # Genkit AI flows and actions
│   ├── components/  # Shared UI components
│   ├── firebase/    # Firebase configuration and hooks
│   ├── hooks/       # Custom React hooks
│   └── lib/         # Utility functions
├── public/          # Static assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
