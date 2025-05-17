import React, { useLayoutEffect, useState } from "react";
import { CartItem } from "../Contexts/cartContext";
import ModalBackDrop from "./modalBackdrop";
import { motion} from "framer-motion";
import "../Styles/modals.css"
import { FaRegTrashAlt } from "react-icons/fa";
import { IoArrowBackOutline, IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { selectedLang, useLangContext } from "../Contexts/languageContext";
import { MdReviews } from "react-icons/md";
import { FaStar, FaUser } from "react-icons/fa6";




interface cartConfirmProps {
    cible : string;
    item : CartItem | undefined;
    rev_productType : string |undefined;
    rev_productId : number | undefined;
    onRemove : (() => void )| undefined;
    onBack : () => void;
    onClearAll : (() => void) | undefined;
}

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

const Modals : React.FC<cartConfirmProps> =({item, cible, onBack, onRemove, onClearAll}) => {

    const [isSP, setIsSP] = useState<boolean>(false);
    const [star, setStar] = useState<number>(0);
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [reviewText, setReviewText] = useState<string>();
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const apiImg = import.meta.env.VITE_IMG_URL

    useLayoutEffect(()=>{
        if(window.innerWidth<600){
            setIsSP(true);
        }else{setIsSP(false)}
    }, [window.innerWidth])
    const now  = new Date();

    const st = (n:number) =>  {
    setStar((prevStar) => (prevStar === n ? n - 1 : n));
    };

    const addRev = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Check if all fields are filled
        if (!username || !email || !reviewText || star === 0) {
            alert("Please fill in all fields and provide a rating.");
            return;
        }
    
        try {
            const response = await fetch('api/addReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    date: now.toISOString(),
                    review: reviewText,
                    stars: star,
                    productType: 'rev_productType', // Use the prop from Preview component
                    productId: 56, // Use the prop from Preview component
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data.message);
            onBack(); // Close the modal after submitting the review
        } catch (err) {
            console.log(err);
            onBack();
        }
    };
    
    
    // if(cible=="reviews"){
    //     return(<>
    //     <ModalBackDrop onClose={onBack} onOpen={true}>
    //         <motion.div
    //         onClick={e=>e.stopPropagation()}
    //         className=""
    //         variants={dropIn}
    //         initial="hidden"
    //         animate="visible"
    //         exit="exit"
    //         >
    //             <div className="adding-div card shadow mt-4 p-2">
    //                 <h3 className="my-2"><MdReviews /> Add your review</h3>
    //                 <div className="review-adding-close fw-bold" onClick={onBack}><IoClose /></div>
    //                 <hr/>
    //                 <label className="my-2 fw-bold">Username:</label>
    //                 <div className="input-group mb-3">
    //                     <span className="input-group-text" id="basic-addon1"><FaUser /></span>
    //                     <input onChange={(e)=>{setUsername(e.target.value)}} type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
    //                 </div>

    //                 <label className="my-2 fw-bold">Email address:</label>
    //                 <div className="input-group mb-3">
    //                     <span className="input-group-text" id="basic-addon1">@</span>
    //                     <input onChange={(e)=>{setEmail(e.target.value)}} type="email" className="form-control" placeholder="Email" aria-label="Username" aria-describedby="basic-addon1"/>                       
    //                 </div>

    //                 <label className="my-2 fw-bold">Stars:</label>
    //                 <div className="d-flex ">
    //                     <div className={`mx-3 rounded star-cont ${star>=1?"clicked":""}`} onClick={()=>st(1)}><FaStar className="star-icon"/></div>
    //                     <div className={`mx-3 rounded star-cont ${star>=2?"clicked":""}`} onClick={()=>st(2)}><FaStar /></div>
    //                     <div className={`mx-3 rounded star-cont ${star>=3?"clicked":""}`} onClick={()=>st(3)}><FaStar /></div>
    //                     <div className={`mx-3 rounded star-cont ${star>=4?"clicked":""}`} onClick={()=>st(4)}><FaStar /></div>
    //                     <div className={`mx-3 rounded star-cont ${star>=5?"clicked":""}`} onClick={()=>st(5)}><FaStar /></div>
    //                 </div>
                    
    //                 <label className="my-3 fw-bold">Your review:</label>
    //                 <div className="input-group mb-3">
    //                     <textarea onChange={(e)=>setReviewText(e.target.value)} maxLength={300} className="form-control" aria-label="Username" aria-describedby="basic-addon1"/>                       
    //                 </div>

    //                 <button className="btn btn-success my-2" onClick={addRev}>Add my review</button>

    //             </div>

                

    //         </motion.div>
    //     </ModalBackDrop>

    //     </>)
    // }
    
    return(<>
    <ModalBackDrop onClose={onBack} onOpen={true}>
        <motion.div
        onClick={e=>e.stopPropagation()}
        className=""
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        >
            <div className={`adding-div card shadow mt-4 p-2 ${!(cible=='reviews')&&'d-none'}`} onSubmit={addRev}>
                    <h3 className="my-2"><MdReviews /> Add your review</h3>
                    <div className="review-adding-close fw-bold" onClick={onBack}><IoClose /></div>
                    <hr/>
                    <label className="my-2 fw-bold">Username:</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1"><FaUser /></span>
                        <input onChange={(e)=>{setUsername(e.target.value)}} type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
                    </div>

                    <label className="my-2 fw-bold">Email address:</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">@</span>
                        <input onChange={(e)=>{setEmail(e.target.value)}} type="email" className="form-control" placeholder="Email" aria-label="Username" aria-describedby="basic-addon1"/>                       
                    </div>

                    <label className="my-2 fw-bold">Stars:</label>
                    <div className="d-flex ">
                        <div className={`mx-3 rounded star-cont ${star>=1?"clicked":""}`} onClick={()=>st(1)}><FaStar className="star-icon"/></div>
                        <div className={`mx-3 rounded star-cont ${star>=2?"clicked":""}`} onClick={()=>st(2)}><FaStar /></div>
                        <div className={`mx-3 rounded star-cont ${star>=3?"clicked":""}`} onClick={()=>st(3)}><FaStar /></div>
                        <div className={`mx-3 rounded star-cont ${star>=4?"clicked":""}`} onClick={()=>st(4)}><FaStar /></div>
                        <div className={`mx-3 rounded star-cont ${star>=5?"clicked":""}`} onClick={()=>st(5)}><FaStar /></div>
                    </div>
                    
                    <label className="my-3 fw-bold">Your review:</label>
                    <div className="input-group mb-3">
                        <textarea onChange={(e)=>setReviewText(e.target.value)} maxLength={300} className="form-control" aria-label="Username" aria-describedby="basic-addon1"/>                       
                    </div>

                    <button type="submit" className="btn btn-success my-2">Add my review</button>
                    <button className="btn btn-danger" onClick={addRev}>hhh</button>

                </div>
            
            <div    className={cible==="remove"?" card parentCartConf":"d-none "}>
                <div className={`ms-3 fw-bold ${selectedLang(currentLang)=='ar'?'rtl me-2':''}`} style={{fontSize:20, marginTop:"1%"}}>
                    {t('deleteConf')}
                </div>
                <hr></hr>
                <div className={`ms-3 mt-1 ${selectedLang(currentLang)=='ar'?'rtl me-2':''}`} style={isSP?{fontSize:16}:{fontSize:18,}}>
                    {t('removeItem')}
                </div >

                    <div className=" d-flex flex-column align-items-center justify-content-between card-body px-0 mb-2"
                     style={{width:"100%", aspectRatio:18, marginTop:"3%",paddingTop:"5%"}}>
                    <div className='col-md-4 imgCartConf py-1 px-1' >
                        <img src={`${apiImg}${item?.image}`} className='imgCartImgConf rounded' />
                        
                    </div> 
                    <div className={`d-flex justify-content-around g-0 mt-2 ${selectedLang(currentLang)=='ar'?'rtl':''}`}
                                    style={{width:"100%", textTransform:'capitalize'}}>
                    <div className= {`col-md-4  cartPriceConf1 ${selectedLang(currentLang)=='ar'?'':'text-start'}`}>
                            <div style={{fontSize:14,}}><strong style={{fontWeight:500}}>{t('category')} : </strong>{item?.category.toLowerCase()}</div> 
                            <div style={{fontSize:14,}}><strong style={{fontWeight:500}}>{t('ref')} :</strong> {item?.ref.toLowerCase()}</div>
                            <div style={{fontSize:14,}}><strong style={{fontWeight:500}}>{t('name')} :</strong> {item?.name.toLowerCase()}</div> 
                    </div> 
                    <div className='' style={{wordSpacing:5}}>
                            <div style={{fontSize:14,}}><strong style={{fontWeight:500}}>{t('price')} :</strong> <b id="inPr">{((item?.price?item.price:0)*(1-(item?.promo?item.promo:0)*0.01)).toFixed(2)}{t('mad')}</b></div> 
                            <div className={item?.promo===0?"d-none":""} style={{fontSize:14,}}><strong style={{fontWeight:500}}>{t('before')} : </strong><b id='delPr'>{(item?.price.toFixed(2))}{t('mad')}</b></div>
                            <div style={{fontSize:14,}}><b style={{ fontWeight:500}}>{t('size')} :</b> {item?.size}</div>
                    </div> 

                    </div> 

                </div>
                <div className="align-bottom"
                    style={{ display:'flex',
                        justifyContent:'end',
                        marginBottom:"1%",
                        marginRight:"2%"
               }} >
                    <span className="mx-2"><button className="btn btn-secondary mt-2"
                                                    style={{fontSize:14}} 
                                                    onClick={onBack}>
                                                <IoArrowBackOutline size={20} /> {t('cancelBack')}
                                            </button>
                    </span>
                    <span className="mx-2"><button className="btn bry btn-danger mt-2"
                                                    style={{fontSize:14}} 
                                                    onClick={onRemove}>
                                                <FaRegTrashAlt  /> {t('remove')}
                                            </button>
                    </span>
                </div>

                
            </div>
            <div  className={cible==="clearAll"?"card align-middle parentCartConfAll ":"d-none"}
                    >
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
                                                    onClick={onClearAll}>
                                                <FaRegTrashAlt  /> {t('clearAllItems')}
                                            </button>
                    </span>
                </div>
            </div>

        </motion.div>

        

    </ModalBackDrop>
        
    </>)
}
export default Modals