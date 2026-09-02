import { useState } from "react";

import LoginPage from "./src/screens/login.jsx";
import HomePage from "./src/screens/home.jsx";

export default function App() {
  const [logado, setLogado] = useState(false);

  const irHome = () => {
    setLogado(true)
  }
  const logoutSys = () => {
    setLogado(false)
  }


  if (logado === true) {
    return <HomePage onLogout={logoutSys}/>
  }
  
  return <LoginPage onLoginSucess = {irHome}/>;
}