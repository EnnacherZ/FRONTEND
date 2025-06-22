import React, {useLayoutEffect, useState } from "react";
import ModalBackDrop from "../Components/modalBackdrop";
import { motion } from "framer-motion";
import "./Styles/modals.css";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaRegTrashAlt, FaUserAlt, FaWpforms } from "react-icons/fa";
import { selectedLang } from "../Contexts/languageContext";
import { useTranslation } from "react-i18next";
import { useLangContext } from "../Contexts/languageContext";
import { Rings } from "react-loader-spinner";
import DeliveryForm from "./processing/DeliveryForm";
import Loading from "../Components/loading";
import apiInstance from "./api";
import { toast, ToastContainer, Zoom } from "react-toastify";

export const dropIn = {
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



        const getUrl = async () => {
            const actualDate = new Date();
            const clientInfos = item.client;
            const items = item.ordered_products;
            const orderDetails = {
                    amount: item.amount,
                    discount: 0,
                    shipping: 0,
                    paymentMethod: item.payment_mode?"Credit Card":"Cash on delivery",
                    shippingMethod: "Colissimo",
                    shippingDate: actualDate.toLocaleDateString(),
                    date: item.date,
                    order_id: item.order_id, }

            setIsLoading(true);           
            try{
            const pdfUrl = await DeliveryForm(items, orderDetails, clientInfos);
            const deliveryBlob = await (await fetch(pdfUrl)).blob()
            const deliveryFile = new File([deliveryBlob], `${clientInfos.first_name}_${clientInfos.last_name}.pdf`, {type: 'application/pdf'});
            const formData = new FormData();
            const NoWaiting = true;
            formData.append('status',NoWaiting.toString());
            formData.append('delivery_form', deliveryFile);

            const response = await connecter.patch(`db/orders/manager/${item.id}/`, formData,
                    {headers: {
                            'Content-Type': 'multipart/form-data',
                        }}
            );
            if(response.status ==201){
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `${clientInfos.first_name}_${clientInfos.last_name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(pdfUrl); 
            setIsLoading(false);
            }
            }catch(error){
                    toast.error(String(error), {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Zoom,
                    });
            setIsLoading(false);
            // Télécharger le PDF
            }finally{
                onBack()
            }
                }



        


return(
    <ModalBackDrop onClose={()=>{}} onOpen={true}>
        <motion.div
        onClick={e=>e.stopPropagation()}
        className=""
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        >
            <div className={cible=='orders'?'db modals orders card shadow':'d-none'}>
                {isLoading?<>
                <Loading message={t('loading')} />
                </>:<>
                <h3 className="m-3 fw-bold d-flex justify-content-center"><FaUserAlt className='mx-2'/> Client infos</h3>
                <ul className="fw-bold">
                    <div className="d-flex flex-rows justify-content-between">
                    <li className="m-2 my-3 d-flex justify-content-start">Name :<span className="">{item.client.first_name} {item.client.last_name}</span></li>
                    <li className="m-2 my-3 d-flex justify-content-start">E-Mail :<span className="">{item.client.email}</span></li>                       
                    </div>
                    <div className="d-flex flex-rows justify-content-between">
                    <li className="m-2 my-3 d-flex justify-content-start">Phone :<span className="">{item.client.phone}</span></li>
                    <li className="m-2 my-3 d-flex justify-content-start">Address :<span className="">{item.client.address} {item.client.city}</span></li>                   
                    </div>
                </ul>
                <hr className="mx-2 my-2"/>
                <h3 className="m-3 fw-bold d-flex justify-content-center"><FaWpforms className="mx-2"/> Order's products</h3>
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
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>Product Type</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>Product Category</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>Product Ref</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>Product Name</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>Size</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>Quantity</th>
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
                <div className="orders-actions-buttons m-2 d-flex justify-content-end">
                    <button className="btn btn-success mx-2" onClick={getUrl}>
                        Extract delivery form</button>
                    <button className="btn btn-danger mx-2" onClick={onBack}>Back</button>
                </div>
</>}
<ToastContainer/>
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
)


}
export default Modals;