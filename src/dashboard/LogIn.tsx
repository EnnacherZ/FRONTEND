import React, { useState } from "react";
import "../Styles/Login.css";
import logo from "../assets/FIRDAOUS STORE.png"
import Loading from "../Components/loading";
import apiInstance, { ACCESS_TOKEN, REFRESH_TOKEN } from "./api";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";


const Login : React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e:React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        try{
            const res = await apiInstance.post('db/token', {username,password});
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            console.log(jwtDecode(res.data.refresh).exp)
            navigate('/DBHome')
        }
        catch{alert('FORBIDDEN !!')}
        finally{setLoading(false)}
    }
    console.log(username,password)

if(loading){
    return(<><Loading message="Authentication..."/></>)
}

return(<>
    <div className="login-div card shadow align-items-center p-2">
        <div className="login-logo-div d-flex mt-2">
            <img src={logo} alt="" />
        </div>
        <h3 className="m-3 fw-bold">STORE DASHBOARD</h3>
        <form action="/submit" onSubmit={handleSubmit}>
        <div className="login-input mt-2 p-1">

        <div className="form-floating mb-3 my-1">
            <input type="text" className="form-control" id="floatingInput" autoComplete="current-username" placeholder="Username" value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
            <label className="floatingInput">Username</label>
        </div>
        <div className="form-floating my-1">
            <input type="password" className="form-control" id="floatingPassword" autoComplete="current-password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            <label htmlFor="floatingPassword">Password</label>
        </div> 
        </div>
        <button className="btn btn-primary login-btn m-2" type="submit" >
            Log In
        </button>
        </form>
    </div>
</>)
}
export default Login