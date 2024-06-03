import { BrowserRouter, Route, Routes } from "react-router-dom";
import FirstScreen from "./components/FirstScreen";
import LoginScreen from "./components/LoginScreen";
import React from "react";
import SignUpScreen from "./components/SignUpScreen";
import HomeScreen from "./components/HomeScreen";
import Preferences from "./components/Preferences";
import Settings from "./components/Settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
