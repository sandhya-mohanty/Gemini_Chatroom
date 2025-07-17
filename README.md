# Gemini_Chatroom
 

A responsive and modern **chat application** built with **React**, **Redux Toolkit**, and **Tailwind CSS**, supporting:

- OTP-based login (mocked)
- Dark/light mode with local storage persistence
- Real-time chat UI
- Reverse infinite scroll (load older messages on scroll up)
- Image upload and preview
- Copy to clipboard
- Typing indicator
- Toast notifications




###  Authentication
- OTP-based login via phone number (mocked for demo)
- Basic country code selection

###  Chat Interface
- Reverse infinite scroll to load older messages
- Image messaging (using FileReader)
- Typing indicator
- Copy-to-clipboard for any message
- Responsive UI for desktop & mobile
- Skeleton loaders during initial load

###  Theming
- Toggle between light and dark modes
- Theme preference stored in localStorage

### State Management
- Redux Toolkit for global state
- Redux persist for state saving across sessions
- Async actions using `createAsyncThunk`



####  Folder/Component Roles
 ## components
This folder holds all UI and functional components, keeping the UI logic separated and reusable.

## 1. ChatInterface.jsx
Renders the actual chat UI.
Handles:
Message input and sending
Image upload
Copy to clipboard
Reverse scroll pagination
Hooks into chatroomMessages, visibleMessages, and dispatches messages.

## 2. Dashboard.jsx
Main panel that shows:
Chatroom list
Theme toggle (dark/light)
Search and create/delete chatroom options
Manages selected chatroom and modal state.

## 3. OTPLogin.jsx
Two-step login UI:
Enter phone
Enter OTP (hardcoded as 123456)
Fetches country codes dynamically.
On success, dispatches setUser() and shows Toast.

## 4. Toast.jsx
Global component for showing toast notifications.
Position: bottom-center (adjustable).
Accepts message and type (success, error, etc.).
Auto-dismiss logic with setTimeout.

## 5. MessageSkeleton.jsx
Optional loader component for chat UI during message fetch/typing.
Displays animated gray boxes (using Tailwind animate-pulse).

## redux/
Handles Redux setup, state slices, and the global store.

## redux/slices/
Modular slices for each state domain (Redux Toolkit).

# chatroomSlice.js
Manages list of chatrooms
Create/delete/set chatroom
localStorage sync on change

# messageSlice.js
Message list per chatroom
sendMessageAsync thunk simulates delayed bot reply
Pagination (visibleMessages)
Loading states and image upload

# uiSlice.js
UI-specific state like:
Modal open/close
Theme (dark/light mode toggle)

# userSlice.js
Stores current logged-in user
Supports OTP login with dummy logic

## store.js
Combines all slices into a global store.
Wraps the <index.js /> component with Redux Provider.

## App.jsx
Root component:
Renders either <OTPLogin /> or <Dashboard /> based on login state.
Toasts and theme class toggle applied here.

## index.js
Standard React entry point.
Renders <App /> into #root DOM element.


### 1. Clone the repository
git clone https://github.com/sandhya-mohanty/Gemini_Chatroom.git
cd Gemini_Chatroom

## 2. Install dependencies
npm install
##  Run the development server
npm run dev

## Live Demo
Check out the deployed project on Netlify:
https://rococo-tanuki-023e49.netlify.app/