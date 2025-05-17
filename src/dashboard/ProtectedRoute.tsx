import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import apiInstance, { ACCESS_TOKEN, REFRESH_TOKEN } from "./api";
import React, { ReactNode, useEffect, useState } from "react";
import Loading from "../Components/loading";

const ProtectedRoute : React.FC<{children:ReactNode}> = ({children}) =>{
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(()=>{
        auth().catch(()=>{setIsAuthorized(false)})
    },[])

    const refreshToken = async () =>{
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            const res = await apiInstance.post('db/token/refresh', {
                refresh:refreshToken
            });
            if((res).status===200){
                localStorage.setItem(ACCESS_TOKEN, (res).data.access);
                setIsAuthorized(true);
            }else{
                setIsAuthorized(false);
            }
        }
        catch{setIsAuthorized(false)}
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(!token){
            setIsAuthorized(false);return
        }
        const decode = jwtDecode(token);
        const tokenExpiration = decode.exp;
        const now = Date.now()/1000;
        if(tokenExpiration){
        if(tokenExpiration<now){
            await refreshToken();
        }else{setIsAuthorized(true)}}
    }
    
    if(isAuthorized == null){
        return(<><Loading message="Authentication..."/></>)
    }
    return (isAuthorized? children : <Navigate to={"/Login"}/>)

}

export default ProtectedRoute