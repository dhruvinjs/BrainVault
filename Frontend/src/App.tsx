import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnotherBrain, Dashboard, Landing, Profile, SavedPosts, Signin, Signup } from "./Pages";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/anotherBrain/:brainId" element={<AnotherBrain />} />
        <Route path="/saved-posts" element={<SavedPosts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
