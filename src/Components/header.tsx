import React, {useEffect, useLayoutEffect, useState } from "react";
import { useCart } from "../Contexts/cartContext";
import { Link } from "react-router-dom";
import "../Styles/header.css";
import icon2 from "../assets/WHITE FIRDAOUS STORE.png"
import {FaHome, FaShoppingCart, FaTshirt } from "react-icons/fa";
import { GiSandal } from "react-icons/gi";
import { PiPantsBold } from "react-icons/pi";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { FaAngleRight, FaShirt } from "react-icons/fa6";
import { MdLanguage } from "react-icons/md";
import { useTranslation } from "react-i18next";
import "../Contexts/languageContext";
import { useLangContext } from "../Contexts/languageContext";
import { goTo } from "./functions";
const Header: React.FC = () => {
    const { itemCount } = useCart();
    const {setCurrentLang, currentLang} = useLangContext();
    const {t} = useTranslation();
    const [sidebar, setSidebar] =useState<boolean>(false);
    const [isPhone, setIsPhone] = useState<boolean>(false);


    useLayoutEffect(()=>{
        const handleResize = () => 
        {if(window.innerWidth<=800){
            setIsPhone(true)
        }else{
            setIsPhone(false)
        }}
        handleResize();
        addEventListener('resize', handleResize);
        return () =>{window.removeEventListener('resize', handleResize)}
    }, [window.innerWidth])

    useEffect(()=>{
        setSidebar(false)
    },[currentLang])


    const butData = [
        {
            path :"/Home" ,
            icon : <FaHome/>,
            name: 'home' ,
            cName: 'text-nav',
        },
        {
            path : "/Shoes",
            icon : <LiaShoePrintsSolid/>,
            name: 'shoes',
            cName: 'text-nav',
        },
        {
            path : "/Sandals",
            icon : <GiSandal/>,
            name: 'sandals',
            cName: 'text-nav',
        },
        {
            path : "/Shirts",
            icon : <FaShirt/>,
            name: 'shirts',
            cName: 'text-nav',
        },
        {
            path : '/Pants',
            icon : <PiPantsBold/>,
            name: 'pants',
            cName: 'text-nav',
        },
    ]    

    return (
        <div    className={`header-container border-bottom-5 shadow-lg`} 
                style={{borderBottomColor:"#7baccb"}}
                >
        {isPhone?(<>
            
            <div className="navbar p-0">
            <div className="icon-section">
                <a onClick={() => goTo("/Home")}>
                    <img className="icon1" src={icon2} alt="Icon" />
                </a>
            </div>
            <div className="sideBarIcon " onClick={()=>setSidebar(!sidebar)}>
                <div className="d-flex flex-column justify-content-evenly align-items-center" style={{height:60}}>
                                    <div    className={sidebar?`sideBarIconLine1 active`:"sideBarIconLine1"}
                        onClick={()=>setSidebar(!sidebar)}></div>
                <div    className={sidebar?`sideBarIconLine2 active`:"sideBarIconLine2"}
                        onClick={()=>setSidebar(!sidebar)}></div>
                <div    className={sidebar?`sideBarIconLine3 active`:"sideBarIconLine3"}
                        onClick={()=>setSidebar(!sidebar)}></div>
                </div>
                <div className="fs-6 fw-bold text-center">{t('menu')}</div>
            </div>
            <div className="SmallCart d-flex" onClick={()=>goTo("/YourCart")}>
                <FaShoppingCart className="SmallCartIcon" />
                <span className="rounded" style={{backgroundColor:'#fff', color:"#0e92e4", direction:'rtl'}}>
                {itemCount}</span>
            </div>
            <div className={`d-flex ${sidebar?"sideBarReducer-active":"sideBarReducer"}`} 
                >
                   <nav className={sidebar?"nav-menu active":"nav-menu"}>
                <ul className="nav-menu-items p-0">
                    <li className="text-nav text-nav-li langSelectorPhone justify-content-around" style={{zIndex:11000}}>
                    <MdLanguage size={30}/>
                        <select className=""
                                onChange={(e)=>setCurrentLang(e.target.value)}
                                value={currentLang}
                                >
                            <option >
                                Français
                            </option>
                            <option >
                                العربية
                            </option>
                            <option >
                                English
                            </option>
                        </select>
                    </li>
                    <li className="text-nav text-nav-li" onClick={()=>{setSidebar(false);goTo('/YourCart')}}>
                    <Link to="#"
                            data-active={location.pathname=="/YourCart"?"true":"false"}>
                    <FaShoppingCart/>
                        <span className="nav-span">
                            {t('YourCart')} 
                        </span><span style={{fontSize:14}}>({itemCount})</span>
                    </Link>
                    </li>
                    {butData.map((item,index)=>{
                        return(
                            
                            <li key={index} className={item.cName} onClick={()=>{setSidebar(false);goTo(item.path);}}>
                                <Link to="#"
                                        data-active={location.pathname==item.path?"true":"false"}>
                                    {item.icon}
                                    <span className="nav-span">{t(item.name)}</span>
                                    <span className="nav-span-icon"><FaAngleRight /></span>
                                </Link>
                            </li>
                        )
                    })}

                </ul>
            </nav>
            <div className="voidSectionSideBarReducer" onClick={()=>setSidebar(false)}></div>
            </div>
         
            </div>

        </>):(<>
            <div className="icon-section">
                <a onClick={() => goTo("/Home")}>
                    <img className="icon1" src={icon2} alt="Icon" />
                </a>
            </div>
            <button
                onClick={() => goTo("/YourCart")}
                className="btn rounded-pill border-cart btn-cart mt-1 me-1"
                style={{ outline: "none",zIndex: 20, fontSize:"1.3vw" }}>
                <div><FaShoppingCart className="cart-icon" style={{ marginRight: '2%' }} /></div>
                <div>{t('YourCart')}</div>
                <div>({itemCount})</div>
            </button>
            <div className="header-buttons btn-group" style={{ position: 'absolute', left: '12%', }}>
                <div className="vertical-line mx-1 muted"></div>
                <button
                    onClick={() => {goTo("/Home")}}
                    type="button"
                    className={`btn rounded btn-header  text-end `}
                    data-active={location.pathname=="/Home"|| location.pathname=="/"?"true":"false"}
                    
                >   
                    <FaHome className="btn-header-icon" /> {t('home')}
                </button>
                <div className="vertical-line mx-1 muted"></div>
                <button
                    onClick={() => {goTo("/Shoes")}}
                    type="button"
                    className={`btn rounded btn-header text-end`}
                    data-active={location.pathname=="/Shoes"?"true":"false"}
                >
                    <LiaShoePrintsSolid className="btn-header-icon" /> {t('shoes')}
                </button>
                <div className="vertical-line mx-1"></div>
                <button
                    onClick={() => {goTo("/Sandals")}}
                    type="button"
                    className={`btn rounded btn-header text-end  p-1`}
                    data-active={location.pathname=="/Sandals"?"true":"false"}
                >
                    <GiSandal className="btn-header-icon" /> {t('sandals')}
                </button>
                <div className="vertical-line mx-1"></div>
                <button
                    onClick={() => {goTo("/Shirts")}}
                    type="button"
                    className={`btn rounded btn-header text-end`}
                    data-active={location.pathname=="/Shirts"?"true":"false"}
                >
                    <FaTshirt className="btn-header-icon" /> {t('shirts')}
                </button>
                <div className="vertical-line mx-1"></div>
                <button
                    onClick={() =>{goTo("/Pants")}}
                    type="button"
                    className={`btn rounded btn-header text-end`}
                    data-active={location.pathname=="/Pants"?"true":"false"}
                >
                    <PiPantsBold className="btn-header-icon" /> {t('pants')}
                </button>

                <div className="vertical-line mx-1 muted"></div>
            </div>
            <div className="LanguageSelector flex-column">
                <MdLanguage size={25} color="#fff"/>
                <select className=""
                        onChange={(e)=>setCurrentLang(e.target.value)}
                        value={currentLang}
                        style={{backgroundColor:'transparent', color:"#fff"}}>
                    <option style={{backgroundColor:'#0e92e4', color:"#fff", outline:'none'}}>
                        Français
                    </option >
                    <option style={{backgroundColor:'#0e92e4', color:"#fff", outline:'none'}}>
                        العربية
                    </option>
                    <option style={{backgroundColor:'#0e92e4', color:"#fff", outline:'none'}}>
                        English
                    </option>
                </select>
            </div>

        </>)}





        </div>
    );
};

export default Header;
