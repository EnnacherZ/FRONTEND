import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../Styles/ProductCarousel.css";
import { useNavigate } from "react-router-dom";
import { Product } from "../Contexts/ProductsContext";
import { useTranslation } from "react-i18next";
import Loading from "./loading";

interface ProductCarouselProps {
  Data : Product[];
  productType : string;
}

const ProductCarousel : React.FC<ProductCarouselProps> = ({Data, productType}) => {
  const apiUrl = import.meta.env.VITE_IMG_URL
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [productsData, setProductsData] = useState<Product[]>([]);
    const responsive = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 1024 },
          items: 4
        },
        desktop: {
          breakpoint: { max: 1024, min: 768 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 768, min: 500 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 500, min: 0 },
          items: 1
        }
      };

      useEffect(()=>{
        setProductsData(Data);
      },[Data]);
      
      const getProductDetail = (pro : Product) =>{
        window.location.href = `/productDetails/${pro.productType}/${pro.category}/${pro.ref}/${pro.id}/` 
      }

      const productRender = (l:string)=>{
        let x = '';
        switch(l){
          case 'Shoes':
            x = 'goShoesSec';
            break;
          case 'Sandals':
            x = 'goSandalsSec';
            break;
          case 'Shirts':
            x = 'goShirtsSec';
            break;
          case 'Pants':
            x = 'goPantsSec';
            break;
        }
        return x;
      }

    return(
      <><hr className="my-1"/>
        {productsData.length==0 && <Loading message="Products are being loaded"/>}
        <Carousel className={`mt-1 productCarousel z-0 `} 
                responsive={responsive}
                swipeable={true}
                autoPlay={productsData.length>1}
                infinite={true}
                autoPlaySpeed={1000}
                transitionDuration={1000}
                showDots={true}
                >
            {productsData.map((item, index)=>(
            <div className="productCarouselCard card text-center d-flex flex-column  " 
                  key={index}  onClick={()=>getProductDetail(item)}>
            <div className="productCImgCont rounded-">
              <img src={`${apiUrl}${item.image}`} className="rounded-top" alt="" />
            </div>
            <div className="productCInfos1 my-1 fw-bold" >
              {(item.category).toLowerCase()} {item.ref}
            </div>
            <div className="productCInfos2 my-1 fw-bold">
                {(item.name).toLowerCase()}
            </div>
            <div className="productCPrice my-1">
              <div className="productCPriceP my-2">{(item.price*(1-item.promo*0.01)).toFixed(2)} MAD</div>
              <div className={`productCPriceD my-2 ${item.promo==0?'d-none':''}`}>{item.price} MAD</div>
              <div className={`productCDiscount my-2 ${item.promo==0?'d-none':''}`}> {item.promo}% off</div>
            </div>

              <button className="fw-bold productCView mb-0 "
                    onClick={()=>getProductDetail(item)}>
                  {t('viewProduct')} 
              </button>
          </div>
            ))}
        </Carousel>
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-outline-secondary fw-bold"
                  onClick={()=>navigate(`/${productType}`)}> 
            {t(productRender(productType))} 
          </button>
        </div>
        <hr className="my-1"/>
      </>

    )


}
export default ProductCarousel;


