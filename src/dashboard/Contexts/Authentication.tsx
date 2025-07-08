import React, {useState, useEffect, useContext, createContext} from 'react';
import Loading from '../../Components/loading';
import apiInstance, { ACCESS_TOKEN, REFRESH_TOKEN, USER_IMAGE, USER_ROLE, USER_USERNAME } from '../api';
import { jwtDecode } from 'jwt-decode';
import Login from '../LogIn';



type AuthContextType = {
  isAuthorized: boolean | null;
  isLoading: boolean;
  signIn: (e:React.FormEvent, username:string, password:string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({  
  isAuthorized: null,
  isLoading: false,
  signIn: async () => {},
  signOut: async () => {},});


export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean|null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
    console.log(localStorage.getItem(USER_IMAGE))
    const signIn = async (e:React.FormEvent, username:string, password:string) => {
        setIsLoading(true);
        e.preventDefault();
        try{
            const res = await apiInstance.post('db/token', {username,password});
            console.log(res)
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            localStorage.setItem(USER_ROLE, res.data.role);
            localStorage.setItem(USER_USERNAME, res.data.username);
            localStorage.setItem(USER_IMAGE, res.data.image);
            setIsAuthorized(true);
        }
        catch{alert('FORBIDDEN !!')}
        finally{setIsLoading(false)}
    }

    const signOut = () => {
        localStorage.setItem(ACCESS_TOKEN, '');
        localStorage.setItem(REFRESH_TOKEN,'');
        localStorage.setItem(USER_ROLE, '');
        localStorage.setItem(USER_USERNAME, '');
        localStorage.setItem(USER_IMAGE, '');
        setIsAuthorized(false);
    };


  return (
    <AuthContext.Provider value={{ isAuthorized, isLoading, signIn, signOut }}>
    

    {isAuthorized===null?<Loading message="Authentication..."/>:
    isAuthorized? children : <Login/>
    }
    </AuthContext.Provider>
  );
};

const useAuth =  () => {
  return useContext(AuthContext);
}

export {useAuth, AuthContext}