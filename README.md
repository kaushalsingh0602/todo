React Native TODO App with Firebase Realtime Database

A fully functional and scalable TODO management application built using React Native and Firebase Realtime Database, featuring real-time updates, pagination, sorting, filtering, and offline-safe UI interactions. Designed with a clean UI and optimized performance for large datasets.

🚀 Features

📡 Firebase Realtime Database Integration

🔐 Secure storage of keys using .env & react-native-dotenv

📥 Fetch initial TODOs from API (jsonplaceholder.typicode.com)

♻️ Real-time syncing & live updates

📑 Infinite scrolling / Pagination (20 items per load)

🔍 Filter by All / Active / Completed

↕️ Sort by Recent / ID

📝 Add, Edit, Delete & Toggle Complete

🏃‍♂️ Optimized performance (no heavy reload on navigation)

🔄 Smooth UI with minimal loading state

📱 Clean and responsive design

📦 Clean build & deployment ready

🛠 Tech Stack
Technology	Used For
React Native	UI & App structure
Redux Toolkit	State management
Firebase Realtime DB	Storage & Live Sync
Async Thunks	Async operations
.env configuration	Secure keys
TypeScript	Type safety
React Navigation	Page navigation
📸 App Highlights

Loads data in pages for smooth performance

Listener triggers instant UI updates on DB change

Only shows loader on first page (no big delay after returning)

Pagination footer loader visible when reaching list end
