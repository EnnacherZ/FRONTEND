import React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineProduct, AiTwotoneAlert } from "react-icons/ai";











const NoProduct : React.FC = () => {
  const {t} = useTranslation();


    return(<>
    <div  className="d-flex flex-column align-items-center pt-5 rounded" 
          style={{marginBlock:20,margin:'auto'}}>
      <div className="m-2"><AiOutlineProduct  size={60} className=""/></div>
      <div className="fw-bold m-4 fs-3">
        {t('productsComing')} 
      </div>
      <AiTwotoneAlert className="fs-1"/>
      <div className="fw-bold m-2 fs-3">
         {t('stayTuned')}
      </div>
    </div>
    </>)

};
export default NoProduct;