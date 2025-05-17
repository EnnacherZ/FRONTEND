import React from "react";
import "../Styles/CommandDetails.css"
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineAccessTimeFilled, MdPayment } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useLangContext } from "../Contexts/languageContext";
import { selectedLang } from "../Contexts/languageContext";

const CommandDetails : React.FC = () => {
    const {t} = useTranslation();
    const {currentLang} = useLangContext();

    const lang = () =>{return selectedLang(currentLang)}
    const getDateAfterDays = (days:number) :string => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString();
    }
return(<>

    <div className={`command-time ${(lang()==='ar')&&'rtl'} px-2`}>
        <h2 className="command-details-title pt-3">{t('details')} :</h2>
        <ul className="list-command-details">
            <li className="Delai-command d-flex">
                <h6 className="Delai-command-title my-1">
                <TbTruckDelivery size={25}/> {t('delivery')} :
                </h6>
                <div className="delai-command-details fw-bold" style={{color:'green'}}>
                    {t('free')}
                </div>
            </li>
            <li className="Delai-command d-flex ">
                <h6 className="Delai-command-title d-flex my-1">
                <MdOutlineAccessTimeFilled className="me-1" size={22}/> {t('deliveryTime')} :
                </h6>
                <div className="delai-command-details" style={{fontSize:16}} >
                    {t('expectedTime')} : {t('from')} {getDateAfterDays(1)} {t('to')} {getDateAfterDays(5)}
                </div>
            </li>
            <li className="Delai-command d-flex">
                <h6 className="Delai-command-title my-1">
                <MdPayment size={22}/> {t('payments')} :
                </h6>
                <div className="delai-command-details d-flex justify-content-center">
                        <div className="col p-0 mx-2"
                                style={{width:""}}>
                              <img src="https://static4.youcan.shop/store-front/images/visa.png" alt="visa"/>
                        </div> 
                        <div className="col p-0 mx-2"
                              style={{width:"25%"}}>
                              <img src="https://static4.youcan.shop/store-front/images/master-card.png" alt="master-card"/>
                        </div> 
                        <div className="col p-0 mx-2"
                              style={{width:"25%"}}>
                              <img src="https://static4.youcan.shop/store-front/images/american-express.png" alt="visa"/>
                        </div>
                        <div className="col p-0 mx-2"
                                                  style={{width:"25%"}}>
                            <img src="https://static4.youcan.shop/store-front/images/discover.png" alt="visa"/>
                        </div>
                    </div>
            </li>

        </ul>
    </div>
</>);
};
export default CommandDetails;