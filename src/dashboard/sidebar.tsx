import React, { useState } from "react";
import "../Styles/dbSidebar.css"
import { BsInboxesFill } from "react-icons/bs";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { PiPantsBold } from "react-icons/pi";
import { FaArrowDownWideShort, FaShirt } from "react-icons/fa6";
import { GiSandal } from "react-icons/gi";
import logo from "../assets/FIRDAOUS STORE.png";
import { FaSignOutAlt } from "react-icons/fa";
import { goTo } from "../Components/header";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./api";

const Sidebar : React.FC = () => {
    const [actual, setActual] = useState<string>('');

    const signOut = () => {
        localStorage.setItem(ACCESS_TOKEN, '')
        localStorage.setItem(REFRESH_TOKEN,'')
        goTo('login');
    };

    console.log(actual)

    return(<>
    <div className="db-sidebar card shadow justify-content-between">
        <div className="">
        <div className="db-sidebar-logo my-1" onClick={()=>goTo('home')}><img src={logo} alt="" /></div>
        <h5 className="text-center fw-bold my-2">STORE DASHBOARD</h5>
        <ul>
            <li className={`my-3 rounded ${actual=='Orders'&&'DbIsClicked'}`} onClick={()=>setActual('Orders')}><BsInboxesFill className="me-2"/> Orders</li>
            <li className={`my-3 rounded ${actual=='Deficiency'&&'DbIsClicked'}`} onClick={()=>setActual('Deficiency')}><FaArrowDownWideShort className="me-2"/> Deficiency</li>
            <li className={`my-3 rounded ${actual=='Shoes'&&'DbIsClicked'}`} onClick={()=>{setActual('Shoes');goTo('/db/Shoe')}}><LiaShoePrintsSolid className="me-2"/> Shoes</li>
            <li className={`my-3 rounded ${actual=='Sandals'&&'DbIsClicked'}`} onClick={()=>{setActual('Sandals');goTo('/db/Sandal')}}><GiSandal className="me-2"/> Sandals</li>
            <li className={`my-3 rounded ${actual=='Shirts'&&'DbIsClicked'}`} onClick={()=>{setActual('Shirts');goTo('Shirt')}}><FaShirt className="me-2"/> Shirts</li>
            <li className={`my-3 rounded ${actual=='Pants'&&'DbIsClicked'}`} onClick={()=>{setActual('Pants');goTo('/db/Pant')}}><PiPantsBold className="me-2"/> Pants</li>
        </ul>
        </div>
        <div className="my-1 rounded db-signout shadow " onClick={signOut}><FaSignOutAlt className="me-2"/> Sign out</div>
    </div>
    </>)

};
export default Sidebar;