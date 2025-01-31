import { Route, Routes } from "react-router";
import "./App.css";
import HomePage from "./pages/HomePage";
import AuthForm from "./components/AuthForm";
import { Toaster } from "react-hot-toast";
import Chat from "./components/Chat/Chat";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="/login" element={<AuthForm />} />
          <Route path="/create_account" element={<AuthForm />} />
        </Route>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
      <Toaster position="top-center" reverseOrder={false}/>
    </>
  );
}

export default App;
