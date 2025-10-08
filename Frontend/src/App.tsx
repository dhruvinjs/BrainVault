import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnotherBrain, Dashboard, Landing, Profile, SavedPosts, Login, Register } from "./Pages";
import { AuthInitializer } from "./Components/AuthInitializer";
import { Header } from "./Components/Header";

const queryClient = new QueryClient();

const ProtectedLayout = () => {
  return (
    <>
      <AuthInitializer />
      {/* The Outlet will render the specific protected page (e.g., Dashboard) */}
      <Outlet />
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header /> 

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- Protected Routes --- */}
          {/* All routes wrapped by ProtectedLayout will run the AuthInitializer. */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/anotherBrain/:brainId" element={<AnotherBrain />} />
            <Route path="/saved-posts" element={<SavedPosts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
