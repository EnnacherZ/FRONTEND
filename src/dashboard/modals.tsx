import React, {useLayoutEffect, useState } from "react";
import ModalBackDrop from "../Components/modalBackdrop";
import { motion } from "framer-motion";
import "./Styles/modals.css";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaRegTrashAlt, FaSortAmountDown, FaUserAlt, FaWpforms } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useLangContext } from "../Contexts/languageContext";
import { Rings } from "react-loader-spinner";
import Loading from "../Components/loading";
import apiInstance from "./api";
import { dropIn, goToNewBlank, selectedLang, showToast } from "./functions";



const connecter = apiInstance;

const Modals : React.FC<{cible:string, message:string|undefined, onBack:(()=>void), item:any, onDelete:(()=>void )| undefined}> = ({cible, onBack, item, onDelete, message}) => {
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const [isSP, setIsSP] = useState<boolean>();
    const [isLoading, setIsLoading] = useState<boolean>();



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

        const processDeficiency = async() => {
            setIsLoading(true);
            const response = await connecter.post(`db/deficiencies/processDeficiency`,
                {   exceptionID: item.exception_id,
                    orderID: item.order.order_id
                }
            );
            if(response.status ==200){
                showToast(t("successDeficiencyTreatment"), "success");
            }
            setIsLoading(false);
            onBack();
        }




return(
    <div className={selectedLang(currentLang)=='ar'?'rtl':''}>
    <ModalBackDrop onClose={()=>{}} onOpen={true}>
        <motion.div
        onClick={e=>e.stopPropagation()}
        className=""
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        >
{cible=='orders'&&<div className={cible=='orders'?'db modals orders card shadow':'d-none'}>
                {isLoading?<>
                <Loading message={t('loading')} />
                </>:<>
                <h4 className="m-3 fw-bold d-flex justify-content-center"><FaUserAlt className='mx-2'/>{t('clientInfos')} </h4>
                <ul className="fw-bold modal-orders-client-infos">

                    <li className="m-2 my-3 ">
                        <span>{t('fullName')} :</span><span className="">{item.client.last_name + ' ' + item.client.first_name} </span>
                    </li>
                    <li className="m-2 my-3">
                        <span>{t('email')} :</span><span className="">{item.client.email}</span>
                    </li>                       
                    <li className="m-2 my-3 ">
                        <span>{t('phN')} :</span><span className="">{item.client.phone}</span>
                    </li>
                    <li className="m-2 my-3">
                        <span>{t('address')} :</span><span className="">{item.client.address + ' ' + item.client.city}</span>
                    </li> 
                    <li className="m-2 my-3">
                        <span>{t('orderId')} :</span><span className="">{item.order_id}</span>
                    </li>                   
                    
                </ul>
                <hr className="mx-2 my-2"/>
                <h4 className="m-3 fw-bold d-flex justify-content-center"><FaWpforms className="mx-2"/>{t('orderedProducts')} </h4>
                
                <div style={{
                            maxHeight: '300px', // hauteur maximale visible
                            overflowY: 'auto',  // active le scroll vertical si nécessaire
                            width: '98%',
                            margin: 'auto'
      }}
      className="rounded shadow-sm">
                    {item.ordered_products.length>0?<>
            <table className="table table-bordred orders-table rounded shadow-sm" style={{width:"98%", margin:'auto'}}>
                <thead>
          <tr className="text-muted">
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('productType')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('category')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('ref')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('name')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('size')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('quantity')}</th>
          </tr>
                </thead>
                <tbody>
                    {Array.isArray(item.ordered_products) && item.ordered_products.map((ord: any, index: number)=>(
                        <tr key={index}>
                            <td>{ord.product_type}</td>
                            <td>{ord.category}</td>
                            <td>{ord.ref}</td>
                            <td>{ord.name}</td>
                            <td>{ord.size}</td>
                            <td>{ord.quantity}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
                    </>:<></>}
                </div>
                <div className="orders-actions-buttons m-3 d-flex justify-content-end">
                    <button className="btn btn-warning mx-2" onClick={()=>{goToNewBlank(`/Dashboard/OrderDetails/${item.order_id}`);onBack()}}>{t('orderDetails')}</button>
                    <button className="btn btn-danger mx-2" onClick={onBack}>{t('back')}</button>
                </div>
</>}

            </div>}


{cible=='deficiencies'&&<div className={cible=='deficiencies'?'db modals orders card shadow':'d-none'}>
                {isLoading?<>
                <Loading message={t('loading')} />
                </>:<>
                <h4 className="m-3 fw-bold d-flex justify-content-center"><FaUserAlt className='mx-2'/>{t('clientInfos')} </h4>
                <ul className="fw-bold modal-orders-client-infos">

                    <li className="m-2 my-3 ">
                        <span>{t('fullName')} :</span><span className="">{item.order.client.last_name + ' ' + item.order.client.first_name} </span>
                    </li>
                    <li className="m-2 my-3">
                        <span>{t('email')} :</span><span className="">{item.order.client.email}</span>
                    </li>                       
                    <li className="m-2 my-3 ">
                        <span>{t('phN')} :</span><span className="">{item.order.client.phone}</span>
                    </li>
                    <li className="m-2 my-3">
                        <span>{t('address')} :</span><span className="">{item.order.client.address + ' ' + item.order.client.city}</span>
                    </li> 
                    <li className="m-2 my-3">
                        <span>{t('orderId')} :</span><span className="">{item.order.order_id}</span>
                    </li>                   
                    
                </ul>
                <hr className="mx-2 my-2"/>
                <h4 className="m-3 fw-bold d-flex justify-content-center"><FaSortAmountDown className="mx-2"/>{t('deficiencies')}</h4>
                <div style={{
        maxHeight: '300px', // hauteur maximale visible
        overflowY: 'auto',  // active le scroll vertical si nécessaire
        width: '98%',
        margin: 'auto'
      }}
      className="rounded shadow-sm">
                    
            <table className="table table-bordred orders-table rounded shadow-sm" style={{width:"98%", margin:'auto'}}>
                <thead>
          <tr className="text-muted">
                        <th className="text-muted">{t('productType')}</th>
                        <th className="text-muted">{t('category')}</th>
                        <th className="text-muted">{t('ref')}</th>
                        <th className="text-muted">{t('name')}</th>
                        <th className="text-muted">{t('size')}</th>
                        <th className="text-muted">{t('quantityRequested')} </th>
          </tr>
                </thead>
                <tbody>
                   
                        <tr>
                            <td>{item.product_type}</td>
                            <td>{item.product_category}</td>
                            <td>{item.product_ref}</td>
                            <td>{item.product_name}</td>
                            <td>{item.product_size}</td>
                            <td>{item.delta_quantity}</td>

                        </tr>

                </tbody>
            </table>
                </div>
                <div className="orders-actions-buttons m-2 d-flex justify-content-end">
                    <button className="btn btn-success mx-2" onClick={processDeficiency}>
                       {t('confirmDeficiencyTreatment')}</button>
                    <button className="btn btn-danger mx-2" onClick={onBack}>{t('back')}</button>
                </div>
</>}

            </div>}





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





            <div className={`${cible=="loading"?"card align-middle parentCartConfAll ":"d-none"}`}>
                                <div className="flex-column" style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    }}>
                                <Rings
                                        height="10em"
                                        width="10em"
                                        color="#0e92e4"
                                        ariaLabel="loading"
                                        wrapperStyle={{justifyContent:'center', alignItems:"center"}}
                                        
                                    />
                                    <div className="loading-msg fs-3 fw-bold text-center mt-4">
                                        {message}
                                    </div>
                            </div>
            </div>

            
        </motion.div>

    </ModalBackDrop>
    </div>
)


}
export default Modals;