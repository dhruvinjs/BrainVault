
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  DashBoard,
  AnotherBrain,
  Landing,
  Profile,

  Login,
  Register
} from "./Pages";
import { ProtectedLayout } from "./Components/ProtectedLayout";
function App() {
  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
