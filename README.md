# The Thought Journal - Frontend

Welcome to the frontend repository of **The Thought Journal**, a blogging platform designed to enable users to express and share their thoughts seamlessly. This project leverages modern technologies to provide a feature-rich and user-friendly experience.

---

## Features

- **User Authentication:** Secure login and signup using Firebase.
- **Blog Creation:** Write, edit, and format blogs using a rich text editor (React Quill).
- **Navigation:** Smooth and dynamic page transitions powered by React Router DOM.
- **Prebuilt Components:** Beautiful and responsive UI with Shadcn.
- **Notifications:** User feedback and alerts with Hot Toast.
- **Data Management:** Efficient server communication and caching with Tanstack Query.
- **Follow Users**: Discover and follow other users on the platform.
- **Search Functionality**: Search for users or posts with ease.

---

## Technologies and Packages Used

- **[React](https://react.dev/):** The core JavaScript library for building the UI.
- **[Firebase](https://firebase.google.com/):** Handles user authentication.
- **[Shadcn](https://shadcn.dev/):** Prebuilt, customizable components for rapid UI development.
- **[Hot Toast](https://react-hot-toast.com/):** Lightweight library for notifications.
- **[React Icons](https://react-icons.github.io/react-icons/):** A comprehensive icon library.
- **[React Router DOM](https://reactrouter.com/):** Enables navigation and routing between pages.
- **[React Quill](https://www.npmjs.com/package/react-quill):** A WYSIWYG editor for composing blog posts.
- **[Tanstack Query](https://tanstack.com/query):** Facilitates data fetching, caching, and state synchronization.

---

## Installation and Setup

Follow the steps below to run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/the-thought-journal-frontend.git
   cd the-thought-journal-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize Firebase authentication:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Obtain the Firebase configuration object (API Key, Auth Domain, etc.).
   - Create a `.env` file in the root directory and add the Firebase configuration details as specified in `firebase.js`.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the app.

---

## Visit the site

[The Thought Journal](https://thethoughtjournal.vercel.app/)

