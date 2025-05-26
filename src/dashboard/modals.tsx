import React, { useLayoutEffect, useState } from "react";
import ModalBackDrop from "../Components/modalBackdrop";
import { motion } from "framer-motion";
import "./Styles/modals.css";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { selectedLang } from "../Contexts/languageContext";
import { useTranslation } from "react-i18next";
import { useLangContext } from "../Contexts/languageContext";

const dropIn = {
    hidden : {
        y : "-100vh",
        opacity : 0
    },
    visible : {
        y : 0,
        opacity : 1,
        transition:{
            type: "tween",
            duration: 0.8,
            ease: "easeInOut"
        }
    },
    exit : {
        y : "100vh",
        opacity : 0
    },
}

const Modals : React.FC<{cible:string, onBack:()=>void, item:any, onDelete:(()=>void )| undefined}> = ({cible, onBack, item, onDelete}) => {
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const [isSP, setIsSP] = useState<boolean>();



        useLayoutEffect(()=>{
            if(window.innerWidth<600){
                setIsSP(true);
            }else{setIsSP(false)}
        }, [window.innerWidth])


        const handleOnDelete = () => {
            if(onDelete){
                onDelete();onBack();
                //window.location.reload();
            }

        }


return(
    <ModalBackDrop onClose={onBack} onOpen={true}>
        <motion.div
        onClick={e=>e.stopPropagation()}
        className=""
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        >
            <div className={cible=='orders'?'db modals orders card shadow':'d-none'}>
                <h3 className="m-3 fw-bold">Order infos</h3>
                <ul className="fw-bold">
                    <li className="m-2 my-4">Order ID : <span className="">{item.order_id}</span></li>
                    <li className="m-2">Transaction ID : <span className="">{item.transaction_id}</span></li>
                    <li className="m-2"></li>
                    <li className="m-2"></li>
                    <li className="m-2"></li>
                    <li className="m-2"></li>
                </ul>

            </div>

            <div className={`${cible=="db/delete"?"card align-middle parentCartConfAll ":"d-none"}`}>
                <div className={`ms-3 fw-bold ${selectedLang(currentLang)=='ar'?'rtl me-2':''}`} style={{fontSize:20, marginTop:"1%"}}>
                    {t('deleteConf')}
                </div>
                <hr></hr>
                <div className={`mx-3 mt-1 ${selectedLang(currentLang)=='ar'?'rtl me-2':''}`} style={{fontSize:16, marginTop:"1%"}}>
                    {t('removeAll')}
                </div >
                <div className="align-bottom mt-4"
                    style={{ display:'flex',
                        justifyContent:'end',
                        alignItems:"end",
                        marginRight:"1%",
                        marginBottom:"2%"
                }} >
                    <span className="mx-2"><button className="btn btn-secondary "
                                                     style={isSP?{fontSize:13}:{}}
                                                    onClick={onBack}>
                                                <IoArrowBackOutline  /> {t('cancelBack')}
                                            </button>
                    </span>
                    <span className="mx-2"><button className="btn bry btn-danger"
                                                    style={isSP?{fontSize:13}:{}}
                                                    onClick={handleOnDelete}>
                                                <FaRegTrashAlt  /> {t('clearAllItems')}
                                            </button>
                    </span>
                </div>               
            </div>

            
        </motion.div>

    </ModalBackDrop>
)


}
export default Modals;