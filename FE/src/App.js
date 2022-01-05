import {Navigate, Route, Routes} from "react-router-dom";
import "./App.css";
import Login from "./googleLogin/index";
import Dashboard from './Dashboard/dashboard'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from "./ProfilePage/profilePage";
import {useSelector } from 'react-redux';
import ErrorPage from "./ErrorPage/errorPage";
import axios from "axios";

function App() {
  if(JSON.parse(localStorage.getItem("tokenDetails"))){
    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("tokenDetails")).tokenId}`;
  }
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  // console.log("APP.JS PAGE RELOAD CHECK", isLoggedIn)

  return (
    <div className="App">
      <ToastContainer autoClose={2000}/>
      <Routes>
         <Route path="/" element={!isLoggedIn ? <Login/> : <Navigate to="/dashboard"/>}/>
         <Route path="/dashboard" element={isLoggedIn ? <Dashboard/> : <Navigate to="/"/>}/>
         <Route path="/profile/:id" element={isLoggedIn ? <ProfilePage/> : <Navigate to="/"/>}/>
         <Route path="*" element={<ErrorPage isLoggedIn={isLoggedIn}/>}/>
      </Routes>
      </div>
  );
}

export default App;
