# VOCAB BUILDER


#### [Live Site](https://vocab-builder-wp1d.onrender.com/)

## Description

This app allows you to search for the meaning of words, listen to the pronunciation and add them to your personal dictionary (The Vocab Mountain). Even if you don't know the correct spelling of the word, just search it and the app will make suggestions based on the closest match.

 Once you have learned the word you may move them to the Vocab Valley or delete them from your dictionary.

## Technologies
- React
- Firebase
- TailwindCSS

## Features
- Search for the full definition of words
- Get suggestions for the closest match on incorrect spelling
- Listen to the pronunciation of words
- Add words to your personal vocab dictionary
- Sort words in your dictionary by date added or alphabetically
- Move words that you have mastered to the Vocab Valley for future reference
- Delete words from your dictionary
- Responsive design
- Dark mode
- Firebase User authentication

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/SonamRinzinGurung/vocab-builder.git 

2. Navigate to the project directory:
   ```bash
   cd vocab-builder

3. Install the dependencies:
   ```bash
   npm install
   
4. Create a `.env` file in the root directory and add your Firebase configuration: (More information on how to set up Firebase can be found [here](https://firebase.google.com/docs/web/setup#config-object))
   ```bash
   VITE_API_KEY=your_api_key
   VITE_AUTH_DOMAIN=your_auth_domain
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_storage_bucket
   VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_APP_ID=your_app_id


5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser and go to `http://localhost:5173` to view the app.
***

## Preview
<img width="600" alt="image" src="https://res.cloudinary.com/ddr8aveca/image/upload/v1749011995/github%20storage/Screenshot_2025-06-04_102133_g1dlhc.png">

***

## Author

[Sonam Rinzin Gurung](https://sonamrinzingurung.github.io/)
