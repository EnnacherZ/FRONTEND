import React, {useEffect, useLayoutEffect, useState } from "react";
import "../Styles/ProductDetail.css";
import Header from "./header";
import { TbRosetteDiscount } from "react-icons/tb";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaCartPlus, FaShirt, FaStar, } from "react-icons/fa6";

import 'swiper/css';             // Importation du CSS principal
import 'swiper/css/bundle';      // Si tu veux les styles pour les fonctionnalités comme les boutons, pagination, etc.
import 'swiper/css/navigation'; // Si tu utilises la navigation
import 'swiper/css/free-mode';  // Si tu utilises le mode libre (dragging)
import 'swiper/css/thumbs';     // Si tu utilises les vignettes (thumbs)
import {Swiper, SwiperSlide} from "swiper/react";
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper/modules";
import {type Swiper as SwiperType} from "swiper";
import Footer from "./footer";
import { Product, ProductDetail, ProductReviews } from "../Contexts/ProductsContext";
import { Bounce, toast, ToastContainer } from "react-toastify";
import {useCart } from "../Contexts/cartContext";
import { useTranslation } from "react-i18next";
import { selectedLang, useLangContext } from "../Contexts/languageContext";
import Text from "./TextProductsDetails";
import useShoesData from "../Server/shoesData";
import useShirtsData from "../Server/shirtsData";
import useSandalsData from "../Server/sandalsData";
import usePantsData from "../Server/pantsData";
import { connecter } from "../Server/connecter";
import ProductCarousel from "./ProductCarousel";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { GiSandal } from "react-icons/gi";
import { PiPantsBold } from "react-icons/pi";
import '../Styles/HomePage.css';
import CommandDetails from "./CommandDetails";
import {useParams } from "react-router-dom";
import Loading from "./loading";
import "../Styles/reviews.css";
import { MdOutlineRateReview, MdRateReview, MdReviews } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import ModalBackDrop from "./modalBackdrop";
import { IoAddCircle, IoClose } from "react-icons/io5";
import img from "../assets/review-guest.jpg";
import TextReducer from "./TextReducer";

const apiUrl = import.meta.env.VITE_IMG_URL

const dropIn = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "tween", duration: 0.8, ease: "easeInOut" } },
    exit: { y: "100vh", opacity: 0 },
  };

const toCheckout = () => {window.location.href="/Checkout"};

const ProductDetails: React.FC = () => {
//   const navigate = useNavigate()
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { product, category, ref, id } = useParams<{ product: string; category: string; ref: string; id:string }>();
  const {shoesDataDetails } = useShoesData();
  const [pro, setPro] = useState<Product>();
  const {addItem} = useCart();
  const {t} = useTranslation();
  const {currentLang} = useLangContext();
  const {sandalsDataDetails} = useSandalsData();
  const {shirtsDataDetails} = useShirtsData();
  const {pantsDataDetails} = usePantsData();
  const [clickedButton, setClickedButton] = useState<{ [key: number]: string | null }>({});
  const [selectedShoeDetails, setSelectedShoeDetails] = useState<{ [key: number]: { size: string; quantity: number | null } }>({});
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isPhone, setIsPhone] = useState<boolean>();
  const [data, setData] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReviews[]>([]); 
  const [star, setStar] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [reviewText, setReviewText] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const reviewsLength = 3;
   
     useEffect(()=>{
         const getPro = async () => {
                 const res = await connecter.get(`api/getSearchedProd?product=${product}&category=${category}&ref=${ref}&id=${id}`)
                 const respo = await res.data.product[0]
                 const respo1 = await res.data.products
                 const respo2 = await res.data.reviews
                 setPro(respo);
                 setData(respo1);
                 setReviews(respo2)
                 console.log(res)
         };
         getPro();
     },[ref, category, id, product])
     const now_date = new Date();
     const onBack = () => {setIsAdding(false);}
     const st = (n: number) => setStar((prevStar) => (prevStar === n ? n - 1 : n));
        const addRev = async () => {
            console.log("Adding review...");
            console.log("Name:", name, "Email:", email, "Review:", reviewText, "Stars:", star);
        
            if (!name || !email || !reviewText || star === 0) {
                alert("Please fill in all fields and provide a rating.");
                return;
            }

                const response = await connecter.post('api/addReview', {
                    name: name,
                    email: email,
                    date: now_date.toISOString(),
                    review: reviewText,
                    stars: star,
                    productType: pro?.productType,
                    productId: pro?.id,
                });
                console.log("Review added successfully:", response);
                onBack();
        };
   const productDetilsSelector = (pro : Product) => {
     switch(pro.productType){
         case 'Shoe': return(shoesDataDetails);
         case 'Sandal': return(sandalsDataDetails);
         case 'Shirt': return(shirtsDataDetails);
         case 'Pant': return(pantsDataDetails);
     }
     return [];}
 
 
   useLayoutEffect(()=>{
       const phone = () =>{
           if(innerWidth<800){setIsPhone(true)}
           else{setIsPhone(false)}
       }
       phone();
       addEventListener('resize', phone);
       return () =>{window.removeEventListener('resize', phone)}
   },[])
 
   const handleSizeClick = (shoeId: number, size: string, quantity: number) => {
       setClickedButton(prev => ({ ...prev, [shoeId]: size }));
       setSelectedShoeDetails(prev => ({ ...prev, [shoeId]: { size, quantity } }));
   };
 
   function sizeFilter(L: ProductDetail[] | undefined, l: number) {
       if (!L) return []; 
       return L.filter(p => p.productId === l).map(p => [p.size, p.quantity] as [string, number]);
   }
 
   const isRemaining = (i: number) => {
       const detail = selectedShoeDetails[i];
       return detail ? detail.quantity !== null && detail.quantity > 0 : true;
   };
 
   const proImg = (pro:Product) => [pro.image, pro.image1, pro.image2, pro.image3, pro.image4];
 
   const handleCommand = (pro:Product) => {
       if(!selectedShoeDetails[pro.id]){
           toast.error(t('toastSizeAlert'), {
               position: "top-center",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: false,
               pauseOnHover: false,
               draggable: true,
               progress: undefined,
               theme: "colored",
               transition: Bounce,
           });
         return
       }
       const item = {
         product : pro.productType,
         id: pro.id,
         category: pro.category,
         ref: pro.ref,
         name: pro.name,
         price: pro.price,
         size: selectedShoeDetails[pro.id].size,
         quantity: 1,
         image : pro.image,
         promo : pro.promo,
       };
       addItem(item);
       toast.success(t('toastAddSuccess') , {
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: false,
           pauseOnHover: false,
           draggable: true,
           progress: undefined,
           theme: "colored",
           transition: Bounce,
       });
     };
     const handleDirectCommand = (pro:Product) =>{
       if(!selectedShoeDetails[pro.id]){
           toast.error(t('toastSizeAlert'), {
               position: "top-center",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: false,
               pauseOnHover: false,
               draggable: true,
               progress: undefined,
               theme: "colored",
               transition: Bounce,
           });
         return 
       }
       const item = {
         product : pro.productType,
         id: pro.id,
         category: pro.category,
         ref: pro.ref,
         name: pro.name,
         price: pro.price,
         size: selectedShoeDetails[pro.id].size,
         quantity: 1,
         image : pro.image,
         promo : pro.promo,
       };
       addItem(item);
       toast.success(t('toastAddSuccess') , {
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: false,
           pauseOnHover: false,
           draggable: true,
           progress: undefined,
           theme: "colored",
           transition: Bounce,
       });
       toCheckout();
     };
   const handleThumbSwiper = (swiper: SwiperType) => {
       setThumbsSwiper(swiper);
   };
   const getProductIcon = (product:string)=>{
         switch(product){
             case 'Shoe':
                 return <>
                     <LiaShoePrintsSolid className="mx-2 HomeTitleIconL"/>
                         {t('shoesPlus')}
                     <LiaShoePrintsSolid className="mx-2 HomeTitleIconR"/>
                 </>;
             case 'Sandal':
                 return <>
                     <GiSandal className="mx-2 HomeTitleIconL"/>
                         {t('sandalsPlus')}
                     <GiSandal className="mx-2 HomeTitleIconR"/>
                 </>
             case 'Shirt':
                 return <>
                     <FaShirt className="mx-2 HomeTitleIconL"/>
                     {t('shirtsPlus')}
                     <FaShirt className="mx-2 HomeTitleIconR"/>
                 </>
             case 'Pant':
                 return <>
                     <PiPantsBold className="mx-2 HomeTitleIconL"/>
                     {t('pantsPlus')}
                     <PiPantsBold className="mx-2 HomeTitleIconR"/>
                 </>
         };
     }   
  if(!pro){return(<>
  <Header/>
  <Loading message="Loading product details..."/>
  <Footer/>
  </>)}
  if(pro!=undefined){
  return (
      <>
          <Header />
          <div className={`ProductDetailDiv mt-2 d-flex justify-content-around ${isPhone?'flex-column ':''}`}>
              <div className={`mt-2 mb-4 text-center 
                              ProductDetailName phone ${isPhone?'':'d-none'} 
                              ${selectedLang(currentLang)=='ar'?'rtl':''}`}>
                      {t('productPreview')} 
                  </div>
              <div className={`ProducyDetailImgs ${isPhone?'phone':''}`}>
                  <Swiper
                      className='ProductDetailImgDiv'
                      spaceBetween={30}
                      thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed?thumbsSwiper:null}}
                      navigation={true}
                      modules={[Navigation, FreeMode, Thumbs, Autoplay]}
                      autoplay={{delay:1500, disableOnInteraction:true, }}
                  >
                      {proImg(pro).map((ig, index) => (
                          <SwiperSlide className="ProductDetailImgDiv" key={index}>
                              <img src={`${apiUrl}${ig}`} alt="" className="rounded" />
                          </SwiperSlide>
                      ))}
                  </Swiper>
                  <Swiper
                      onSwiper={handleThumbSwiper}
                      spaceBetween={5}
                      slidesPerView={5}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[Navigation, FreeMode, Thumbs]}
                      className="zero mt-2">
                      {proImg(pro).map((ig, index)=>(
                          <SwiperSlide key={index} className="thunme">
                              <img src={`${apiUrl}${ig}`} alt="" />
                          </SwiperSlide>
                      ))}
                  </Swiper>
              </div>
              <div className={`mt-2 ProductDetailNP ${isPhone?'phone':''}`}>
                  <div className={`ProductDetailInfos1 mt-2 mb-4 text-center 
                                  ProductDetailName ${isPhone?'d-none':''} 
                                  ${selectedLang(currentLang)=='ar'?'rtl':''}`}>
                      {t('productPreview')}
                  </div>
                  <div className={`ProductDetailName mt-1 mb-3 text-muted ${isPhone?'phone':''}`}>
                      {(pro?.category).toUpperCase()} {(pro?.productType).toUpperCase()} : {pro?.ref}
                  </div>
                  <div className={`ProductDetailName mt-1 mb-3 text-muted ${isPhone?'phone':''}`}>
                      {(pro?.name).toUpperCase()}
                  </div>
                  {pro?.promo !== 0 && (
                      <div    className={`${selectedLang(currentLang)=='ar'?'rtl text-center':""}`}
                              style={{
                                  color: 'red',
                                  paddingLeft: '6%',
                                  fontWeight: 'bold',
                                  fontSize: isPhone?'4.2vw':'1.9vw'
                              }}>
                          <TbRosetteDiscount /> {t('promotion')} !
                      </div>
                  )}
                  <div className={`ProductDetailPS d-flex my-4 ${isPhone?'phone':''}`}>
                      <div className={`ProductDetailPP ${isPhone?'phone':''}`}>
                          {(pro?.price * (1 - pro?.promo * 0.01)).toFixed(2)} MAD
                      </div>
                      <div className={`ProductDetailDP text-muted d-flex ${isPhone?'phone':''}`}>
                          {(pro?.price).toFixed(2)} {t('mad')}
                      </div>
                      <div className={`ProductDetailDC ${isPhone?'phone':''} 
                                      ${selectedLang(currentLang)=='ar'?'rtl':''}`}>
                          {(pro?.promo)} % {t('off')}
                      </div>
                  </div>
                  <div className={`my-2 ${selectedLang(currentLang)=='ar'?'rtl':""}`} style={{
                      paddingLeft: '6%',
                      fontWeight: 'bold',
                      fontSize: isPhone?'3.3vw':'1.4vw'
                  }}>
                      {t('sizes')} :
                  </div>
                  <div className="ProductDetailSizesBox">
                      {sizeFilter(productDetilsSelector(pro), pro.id).map((i, index) => (
                          <button
                              className={`ProductDetailSizesButton ${clickedButton[pro?.id] === i[0] ? 'clicked' : ''}`}
                              style={i[1] !== 0 ? {} : {
                                  borderColor: 'red',
                                  color: 'red',
                                  textDecoration: 'line-through',
                                  textDecorationColor: 'red'
                              }}
                              key={index}
                              onClick={() => { handleSizeClick(pro?.id, i[0], i[1]) }}
                          >
                              {i[0]}
                          </button>
                      ))}
                  </div>
                  <div className="rounded-0 mb-0">
                      <button
                          className={`ProductDetailComButton ${isPhone?'phone':''}`}
                          onClick={() => handleCommand(pro)}
                          disabled={!isRemaining(pro?.id)}
                      >
                          {isRemaining(pro?.id) ? (
                              <>
                                  <FaCartPlus size={20} className="ProductDetailComIcon" /> {t('addCart')}
                              </>
                          ) : (
                              <>
                                  <RiErrorWarningLine size={20} className="ProductDetailComIcon" /> {t('soldOut')}
                              </>
                          )}
                      </button>
                      <button
                          className={`ProductDetailDirectComButton mt-3 ${isPhone?'phone':''}`}
                          onClick={() => handleDirectCommand(pro)}
                          disabled={!isRemaining(pro?.id)}
                      >
                          {isRemaining(pro?.id) ? (
                              <>
                                  <FaCartPlus size={20} className="ProductDetailComIcon" /> {t('directCmd')}
                              </>
                          ) : (
                              <>
                                  <RiErrorWarningLine size={20} className="ProductDetailComIcon" /> {t('soldOut')}
                              </>
                          )}
                      </button>
                  </div>                   
              </div>
          </div>
          <div className={`ProductDetailDiv mt-2 d-flex justify-content-between px-2 ${isPhone?'flex-column-reverse ':''}`}>
              <div className="ProductDetailText">
                  <Text productType={(pro?.productType).toLowerCase()} Category={(pro?.category).toLowerCase()} lang={selectedLang(currentLang)}/>
              </div>
              <div className="time-command card shadow fw-bold">
                  <CommandDetails/>
              </div>
          </div>
          <div className={`${(selectedLang(currentLang)=='ar')&&'rtl'}`}>
          {(!reviews || reviews.length==0)&&
          (<>
            <div className="card shadow m-3 p-2">
              <h3 className='fw-bold mx-2'><MdRateReview size={40} />{t('productReviews')}</h3>
              <div className="no-reviews d-flex flex-column align-items-center mt-3 text-muted">
              <MdOutlineRateReview size={50}/>
              <h6 className='fw-bold mt-4'>{t('firstReview')}</h6>
              </div>
              <div className="reviews-add card shadow my-2 p-2">
          <button className="btn btn-primary m-1" onClick={() => setIsAdding(true)}>
            <IoAddCircle /> {t('addReview')}
          </button>
        </div>
              </div>
              <AnimatePresence mode='wait'>
                  {isAdding && (
                    <ModalBackDrop onClose={onBack} onOpen={true}>
                      <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className="adding-div card shadow mt-4 p-2"
                        variants={dropIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit" >
                        <div className="d-flex justify-content-between px-1">
                            <h3 className="my-2"><MdReviews /> {t('addReview')}</h3>
                            <div className="review-div-closer fw-bold" onClick={onBack}><IoClose /></div>
                        </div>
                        <hr />
                        <form onSubmit={(e)=>{e.preventDefault();addRev()}}>
                        <label className="fw-bold my-2">{t('username')}:</label>
                        <input minLength={1} value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" placeholder={t('username')} />
                        <label className="fw-bold my-2">{t('email')}:</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder={t('email')} />    
                        <label className="fw-bold my-2">{t('stars')}:</label>
                        <div className="d-flex">
                          {Array(5).fill(0).map((_, i) => (
                            <div key={i} className={`mx-3 rounded star-cont ${star >= i + 1 ? "clicked" : ""}`} onClick={() => st(i + 1)}>
                              <FaStar />
                            </div>
                          ))}
                        </div>
                        <label className="fw-bold">{t('yourReview')}:</label>
                        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} maxLength={300} className="form-control" />   
                        <button type="submit" className="btn btn-success my-2">{t('addMyReview')}</button>
                        </form>
                      </motion.div>
                    </ModalBackDrop>
                  )}
                </AnimatePresence>
            </>)}
            {(reviews.length>0)&&(
                <>
                <div className="reviews-div">
                  <h3 className='fw-bold mx-2'><MdRateReview size={40} />{t('productReviews')}</h3>
                  {reviews.slice(0,isExpanded?reviews.length:reviewsLength).map((review, index) => (
                    <div key={index} className="reviews-body card shadow-sm py-1 my-2">
                      <div className="reviewer-infos d-flex flex-columns">
                        <div className="reviewer-img m-2"><img src={img} alt="Reviewer" /></div>
                        <div className="reviewer-name fw-bold m-2">{review.name}</div>
                        <div className="review-stars mt-1 mx-2 d-flex">
                          {Array(5).fill(false).map((_, i) => (
                            <span key={i}><FaStar color={i < review.stars ? '#ffd700' : '#ccc'} /></span>
                          ))}
                        </div>
                        <div className="review-date">{new Date(review.date).toLocaleString()}</div>
                      </div>
                      <TextReducer text={review.review} maxLength={100}/>
                    </div>
                  ))}
                    {reviews.length && reviews.length > reviewsLength && (
                        <div className="text-center my-3">
                            <button className="btn btn-outline-primary border border-2 border-primary fw-bold" onClick={() => setIsExpanded(!isExpanded)}>
                                {isExpanded ? t('readLess') : t('readMore')}
                            </button>
                        </div>
                    )}
                 <div className="reviews-add card shadow my-2 p-2">
                    <button className="btn btn-primary m-1" onClick={() => setIsAdding(true)}>
                        <IoAddCircle /> {t('addReview')}
                    </button>
                </div>
                </div>
                <AnimatePresence mode='wait'>
                  {isAdding && (
                    <ModalBackDrop onClose={onBack} onOpen={true}>
                      <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className="adding-div card shadow mt-4 p-2"
                        variants={dropIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit" >
                        <div className="d-flex justify-content-between px-1">
                            <h3 className="my-2"><MdReviews /> {t('addReview')}</h3>
                            <div className="review-div-closer fw-bold" onClick={onBack}><IoClose /></div>
                        </div>
                        <hr />
                        <form onSubmit={(e)=>{e.preventDefault();addRev()}}>
                        <label className="fw-bold my-2">{t('username')}:</label>
                        <input minLength={1} value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" placeholder={t('username')} />
                        <label className="fw-bold my-2">{t('email')}:</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder={t('email')} />    
                        <label className="fw-bold my-2">{t('stars')}:</label>
                        <div className="d-flex">
                          {Array(5).fill(0).map((_, i) => (
                            <div key={i} className={`mx-3 rounded star-cont ${star >= i + 1 ? "clicked" : ""}`} onClick={() => st(i + 1)}>
                              <FaStar />
                            </div>
                          ))}
                        </div>
                        <label className="fw-bold">{t('yourReview')}:</label>
                        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} maxLength={300} className="form-control" />   
                        <button type="submit" className="btn btn-success my-2">{t('addMyReview')}</button>
                        </form>
                      </motion.div>
                    </ModalBackDrop>
                  )}
                </AnimatePresence>
              </>
            )}
            </div>
          <div className="ProductDetailDiv">
              <div className="ProductsPromoAnnouncement my-1 HomeTitle fw-bold carsl-item-title">
                  {getProductIcon(pro?.productType)}
              </div>
              <ProductCarousel Data={data} productType={pro.productType+'s'}/>
          </div>
          <Footer />
          <ToastContainer style={{ width: "40%", marginLeft:'15%' }}/>
      </>
  )};
};
export default ProductDetails;
