import React from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "../sidebar";
import DbHeader from "../DbHeader";
import "../Styles/Statistics.css";
import { selectedLang } from "../functions";
import { useLangContext } from "../../Contexts/languageContext";




const Statistics : React.FC = () => {
    const {t} = useTranslation();
    const {currentLang} = useLangContext();





    return(<>

        <Sidebar/>
        <div className={`db-home ${selectedLang(currentLang)=='ar'&&'rtl'}`} >
            <DbHeader/>
            <div className="d-flex justify-content-center fs-2 fw-bold">
                {t('notDevelopedYet')}
            </div>        
        </div>


    </>)


}


export default Statistics