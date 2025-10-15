
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  DashBoard,
  AnotherBrain,
  Landing,
  Profile,

  Login,
  Register,
  About
} from "./Pages";
import { ProtectedLayout } from "./Components/ProtectedLayout";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right" 
        toastOptions={{
          success: {
            style: {
              background: "#4ade80",
              color: "#000",
            },
          },
          error: {
            style: {
              background: "#f87171",
              color: "#000",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/anotherBrain/:brainId" element={<AnotherBrain />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
