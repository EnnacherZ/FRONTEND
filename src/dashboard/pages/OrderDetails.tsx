import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import DbHeader from "../DbHeader";
import "../Styles/orderDetails.css";
import { useParams } from "react-router-dom";
import { hideInfos, selectedLang, showToast } from "../functions";
import { useLangContext } from "../../Contexts/languageContext";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCircleCheck, faCircleXmark, faInfoCircle, faSortAmountDown, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import apiInstance from "../api";
import Loading from "../../Components/loading";
import NotFound from "../NotFound";
import { faWpforms } from "@fortawesome/free-brands-svg-icons";
import { toast, ToastContainer, Zoom } from "react-toastify";
import DeliveryForm from "../processing/DeliveryForm";


const connecter = apiInstance;







const OrderDetails : React.FC = () => {
    const {orderID} = useParams();
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFound, setIsFound] = useState<boolean>();
    const [isError, setIsError] = useState<boolean>();
    const [order, setOrder] = useState<any>();
    const [orderDeficiencies, setOrderDeficiencies] = useState<any[]>([]);
    const [isOrderTreated, setIsOrderTreated] = useState<boolean>();
    const [isExpanded, setIsExpanded] = useState<{orderedProducts:boolean, deficiencies:boolean}>({orderedProducts:false, deficiencies:false});

    const toggleExpand = (product:string) => {
    setIsExpanded((prev)=>({...prev, [product]:!prev[product as keyof {orderedProducts:boolean, deficiencies:boolean}]}));
    };

    useEffect(()=>{
        const getOrder = async() => {
            setIsLoading(true);
            try{
            const response = await apiInstance.get(`db/orders/getSearchedOrder?orderID=${orderID}`);
            const res = await response.data;
            if(!res.error){
                setIsFound(res.found);
                setOrder(res.order);
                setIsError(res.error);
                setOrderDeficiencies(res.deficiencies);
            }else{
                setIsError(true);
            }
            }
            finally{
                setIsLoading(false);
            }

        };
        getOrder();
    }, [orderID])

    const onBack = () => {
        window.close()
    }

        const getUrl = async (ord:any) => {
            
            if(ord.exception){
                toast.error(t('deficienciesMessage'),{
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false, 
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  transition: Zoom,
                })
            }else{
                console.log('bdina')
            const actualDate = new Date();
            const clientInfos = ord.client;
            const items = ord.ordered_products;
            const orderDetails = {
                    amount: ord.amount,
                    discount: 0,
                    shipping: 0,
                    paymentMethod: ord.payment_mode?"Credit Card":"Cash on delivery",
                    shippingMethod: "Colissimo",
                    shippingDate: actualDate.toLocaleDateString(),
                    date: ord.date,
                    order_id: ord.order_id, }
     
            try{
            setIsLoading(true);      
            const pdfUrl = await DeliveryForm(items, orderDetails, clientInfos);
            const deliveryBlob = await (await fetch(pdfUrl)).blob()
            const deliveryFile = new File([deliveryBlob], `${clientInfos.first_name}_${clientInfos.last_name}.pdf`, {type: 'application/pdf'});
            const formData = new FormData();
            const NoWaiting = true;
            formData.append('status',NoWaiting.toString());
            formData.append('delivery_form', deliveryFile);

            const response = await connecter.patch(`db/orders/manager/${ord.id}/`, formData,
                    {headers: {
                            'Content-Type': 'multipart/form-data',
                        }}
            );
            console.log(response)
            if(response.status ==200){
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `${clientInfos.first_name}_${clientInfos.last_name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(pdfUrl); 
                setIsLoading(false);
                console.log("treated")
                showToast(t('orderTreated'), "success");
                setIsOrderTreated(true);
                
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
            }
            }

                }   


        const processDeficiency = async(item: any) => {
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




    return(<>

        <Sidebar/>
        <div className={`db-home ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
            <DbHeader/>
                <h5 className="d-flex justify-content-start mx-3 fw-bold" style={{color:'#0e92e4'}}>
                    <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="mx-2"
                    />
                    {t('orderDetails')} :
                </h5>
                {isLoading?<>
                <Loading message={t('loading')}/>
                </>
                :
                isError?<>
                    <div className="d-flex align-items-center flex-column mt-4">
                            <FontAwesomeIcon
                              icon={faTriangleExclamation}
                              size="6x"
                              shake
                              style={{ color:"#ff0000"}}
                            />
                            <p className="my-3 fw-bold fs-4">{orderID} {t('noValidOrderId')}</p>
                    </div>
                </>
                :isFound?
                isOrderTreated?
                <>
                    <div className="d-flex align-items-center flex-column mt-5">
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              size="6x"
                              bounce
                              style={{ color:"green"}}
                            />
                            <p className="my-3 fw-bold fs-4">{t('orderTreated')} </p>
                            
                            
                    </div>                
                </>
                :
                <>
                <ul className="fw-bold my-3 db-orders-details-client">
                    <li className="m-2 my-3 ">
                        <span>{t('fullName')} :</span><span className="">{order.client.last_name + ' ' + order.client.first_name} </span>
                    </li>
                    <li className="m-2 my-3">
                        <span>{t('email')} :</span><span className="">{order.client.email}</span>
                    </li>                       
                    <li className="m-2 my-3 ">
                        <span>{t('phN')} :</span><span className="">{order.client.phone}</span>
                    </li>
                    <li className="m-2 my-3">
                        <span>{t('address')} :</span><span className="">{order.client.address + ' ' + order.client.city}</span>
                    </li> 
                    <li className="m-2 my-3">
                        <span>{t('orderId')} :</span><span className="">{orderID}</span>
                    </li> 
                    <li className="m-2 my-3">
                        <span>{t('transactionId')} :</span><span className="">{order.transaction_id}</span>
                    </li>
                    <li className="m-2 my-3">
                        <span>{t('deficiencies')} :</span><span className="">{orderDeficiencies.length}</span>
                    </li>   
                </ul>

                <hr />
                <h5 className="d-flex justify-content-start mx-3 fw-bold my-2" style={{color:'#0e92e4'}}>
                    <FontAwesomeIcon
                    icon={faWpforms}
                    className="mx-2"
                    />
                    {t('orderedProducts')} :
                </h5>

                    {order.ordered_products.length>0?<>
            <table className="table table-bordred orders-table rounded shadow-sm mt-2 mb-4" style={{width:"98%"}}>
                <thead>
          <tr className="text-muted">
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('productType')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('category')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('ref')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('name')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('size')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('quantity')}</th>
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>{t('avaibility')}</th>
          </tr>
                </thead>
                <tbody>
                    {Array.isArray(order.ordered_products) && order.ordered_products.slice(0, isExpanded.orderedProducts? order.ordered_products.length: 3).map((ord: any, index: number)=>(
                        <tr key={index}>
                            <td>{ord.product_type}</td>
                            <td>{ord.category}</td>
                            <td>{ord.ref}</td>
                            <td>{ord.name}</td>
                            <td>{ord.size}</td>
                            <td>{ord.quantity}</td>
                            <td>{ord.available?
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="mx-2"
                                    color="green"
                                    size="xl"
                                />:
                                <FontAwesomeIcon
                                    icon={faCircleXmark}
                                    className="mx-2"
                                    color="red"
                                    size="xl"
                                />
                            }</td>

                        </tr>
                    ))}
                </tbody>
            </table>
                        <div className={order.ordered_products.length>3?"orders-expansion text-center m-1 d-flex justify-content-center":'d-none'} >
                            <button className="btn btn-outline-primary" onClick={()=>toggleExpand("orderedProducts")}>
                                {!isExpanded.orderedProducts?`${t('readMore')} ${ order.ordered_products.length>=3?`(+ ${order.ordered_products.length - 3})`:''}`:t('readLess')}
                            </button>
                        </div>

                    </>:<></>}

                <hr className="my-3"/>
                <h5 className="d-flex justify-content-start mx-3 fw-bold my-2" style={{color:'#0e92e4'}}>
                    <FontAwesomeIcon
                    icon={faSortAmountDown}
                    className="mx-2"
                    />
                    {t('deficiencies')} :
                </h5>

            {orderDeficiencies.length>0?<>
            <table className="table table-bordred mt-2 orders-table rounded shadow-sm">
                <thead>
                    <tr className="text-muted">
                        <th className="text-muted">{t('orderId')} </th>
                        <th className="text-muted">{t('productType')}</th>
                        <th className="text-muted">{t('category')}</th>
                        <th className="text-muted">{t('ref')}</th>
                        <th className="text-muted">{t('name')}</th>
                        <th className="text-muted">{t('size')}</th>
                        <th className="text-muted">{t('quantityRequested')}</th>
                        <th className="text-muted">{t('action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDeficiencies.slice(0, isExpanded.deficiencies? orderDeficiencies.length: 3).map((ord, index)=>(
                        <tr key={index}>
                            <td>{hideInfos(ord.order.order_id, 30)}</td>
                            <td>{ord.product_type}</td>
                            <td>{ord.product_category}</td>
                            <td>{ord.product_ref}</td>
                            <td>{ord.product_name}</td>
                            <td>{ord.product_size}</td>
                            <td>{ord.delta_quantity}</td>
                            <td><button className="btn btn-primary" onClick={()=>{processDeficiency(ord)}} disabled={ord.treated}>
                                {ord.treated?t('treated'):t('processDeficiency')}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
                <div className={orderDeficiencies.length>3?'orders-expansion text-center m-1 d-flex justify-content-center':'d-none'}>
                    <button className="btn btn-outline-primary" onClick={()=>toggleExpand("deficiencies")}>
                        {!isExpanded.deficiencies?`${t('readMore')} ${ orderDeficiencies.length>=3?`(+ ${orderDeficiencies.length - 3})`:''}`:t('readLess')}
                    </button>
                </div>
            </>
            :<>
            <NotFound message={t('noDeficiencyFound')} />
            </>}

                <div className="orders-actions-buttons my-5 mx-3 d-flex justify-content-end">
                    <button className="btn btn-success mx-2" onClick={()=>getUrl(order)} disabled={order.status}>
                        {order.status?t('orderAlreadyTreated'):t('extractDeliveryForm')}
                    </button>
                    <button className="btn btn-danger mx-2" onClick={onBack}>{t('back')}</button>
                </div>
                </>
                :
                <>
                    <div className="d-flex align-items-center flex-column mt-5">
                            <FontAwesomeIcon
                              icon={faBan}
                              size="6x"
                              shake
                              style={{ color:"#ff0000"}}
                            />
                            <p className="my-3 fw-bold fs-4">{t('noOrderAssiciatedOrderId')} </p>
                            <p className="my-3 fw-bold fs-4">{t('orderIdProvided')} : {orderID}</p>
                            
                    </div>
                </>
                }

        </div>

        <ToastContainer/>


    
    </>);


}
export default OrderDetails