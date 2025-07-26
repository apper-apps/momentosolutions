import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import Home from "@/components/pages/Home";
import Memories from "@/components/pages/Memories";
import Chat from "@/components/pages/Chat";
import Capsules from "@/components/pages/Capsules";
import Profile from "@/components/pages/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="memories" element={<Memories />} />
          <Route path="chat" element={<Chat />} />
          <Route path="capsules" element={<Capsules />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;