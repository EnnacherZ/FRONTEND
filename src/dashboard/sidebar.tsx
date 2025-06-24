import React from "react";
import "./Styles/dbSidebar.css";
import { BsInboxesFill } from "react-icons/bs";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { PiPantsBold } from "react-icons/pi";
import { FaArrowDownWideShort, FaShirt } from "react-icons/fa6";
import { GiSandal } from "react-icons/gi";
import logo from "../assets/FIRDAOUS STORE.png";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./api";
import { MdLanguage, MdOutlineSettings } from "react-icons/md";
import { useLangContext } from "../Contexts/languageContext";
import { useTranslation } from "react-i18next";
import { ImStatsDots } from "react-icons/im";
import { goTo, selectedLang } from "./functions";


const Sidebar : React.FC = () => {
    const {t} = useTranslation();
    const {currentLang, setCurrentLang} = useLangContext();
    const actual = window.location.pathname.slice(1);
    
    const signOut = () => {
        localStorage.setItem(ACCESS_TOKEN, '')
        localStorage.setItem(REFRESH_TOKEN,'')
        goTo('Login');
    };

    return(<>
    <div className={`${selectedLang(currentLang)=='ar'?'db-sidebar-rtl rtl':'db-sidebar'} shadow justify-content-between`}>
        <div className={`${selectedLang(currentLang)=='ar'?'db-sidebar-header-rtl rtl':'db-sidebar-header'} shadow-sm`}>
        <div className="db-sidebar-logo my-2" onClick={()=>goTo('Home')}><img src={logo} alt="" /></div>
        <h5 className="text-center fw-bold my-2">STORE DASHBOARD</h5>
        </div>
        <ul className={`db-sidebar-list ${selectedLang(currentLang)=='ar'?'rtl':''}`}>
                    <li className="d-flex rounded " style={{zIndex:11000}}>
                    <MdLanguage size={20}/>
                        <select className="mx-1 sidebar-lang fw-bold"
                                onChange={(e)=>setCurrentLang(e.target.value)}
                                value={currentLang}
                                >
                            <option className="mx-2">
                                Français
                            </option>
                            <option className="mx-2">
                                العربية
                            </option>
                            <option className="mx-2">
                                English
                            </option>
                        </select>
            </li>
            <li className={`my-3 rounded ${actual.toLowerCase()=='dashboard/home'&&'DbIsClicked'}`} onClick={()=>{goTo("/Dashboard/Home")}}><FaHome className="me-2"/> {t('home')} </li>
            <li className={`my-3 rounded ${actual.toLowerCase()=='dashboard/orders'&&'DbIsClicked'}`} onClick={()=>{goTo("/Dashboard/Orders")}}><BsInboxesFill className="me-2"/> {t('orders')} </li>
            <li className={`my-3 rounded ${actual.toLowerCase()=='dashboard/deficiency'&&'DbIsClicked'}`} onClick={()=>{goTo("/Dashboard/Deficiency")}}><FaArrowDownWideShort className="me-2"/> {t('deficiencies')} </li>
            <li className={`my-3 rounded ${actual.toLowerCase()=='dashboard/shoe'&&'DbIsClicked'}`} onClick={()=>{goTo('/Dashboard/Shoe')}}><LiaShoePrintsSolid className="me-2"/> {t('shoes')}</li>
            <li className={`my-3 rounded ${actual.toLowerCase()=='dashboard/sandal'&&'DbIsClicked'}`} onClick={()=>{goTo('/Dashboard/Sandal')}}><GiSandal className="me-2"/> {t('sandals')}</li>
            <li className={`my-3 rounded ${actual.toLowerCase()=='dashboard/shirt'&&'DbIsClicked'}`} onClick={()=>{goTo('/Dashboard/Shirt')}}><FaShirt className="me-2"/> {t('shirts')}</li>
            <li className={`my-3 rounded ${actual.toLowerCase()=='dashboard/pant'&&'DbIsClicked'}`} onClick={()=>{goTo('/Dashboard/Pant')}}><PiPantsBold className="me-2"/> {t('pants')}</li>
            <div className="my-2 rounded db-statistics-btn shadow " onClick={()=>goTo("/Dashboard/Statistics")}><ImStatsDots  className="me-2"/> {t('statistics')}</div>
            <div className="my-2 rounded db-settings-btn shadow " onClick={()=>goTo("/Dashboard/Settings")}><MdOutlineSettings  className="me-2"/> {t('settings')}</div>
            <div className="my-2 rounded db-signout shadow " onClick={signOut}><FaSignOutAlt className="me-2"/> {t('signOut')}</div>
        </ul>
    </div>
    </>)

};
export default Sidebar;