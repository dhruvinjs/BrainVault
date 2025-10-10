
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  DashBoard,
  AnotherBrain,
  Landing,
  Profile,

  Login,
  Register
} from "./Pages";
import { AuthStateSyncer } from "./Components/AuthStateSyncer";
import { PublicLayout } from "./Components/PublicLayout.tsx";
import { ProtectedLayout } from "./Components/ProtectedLayout";
function App() {
  return (
    <BrowserRouter>
      <AuthStateSyncer />

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

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
