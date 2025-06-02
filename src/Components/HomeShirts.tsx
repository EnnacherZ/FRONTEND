import React from "react";
import { useTranslation } from "react-i18next";
import ProductCarousel from "./ProductCarousel";
import '../Styles/HomePage.css'
import { Product} from "../Contexts/ProductsContext";
import { FaShirt } from "react-icons/fa6";


const HomeShoes : React.FC<{data:Product[]| undefined }> = ({data}) => {
    const {t} = useTranslation();
    // const [promo, setPromo]=useState<Product[]>([])
    // const [noPromo, setNoPromo]=useState<Product[]>([])
    // useEffect(()=>{
    //         if (data.length > 0) {
    //             const { ispromo, isnoPromo } = data.reduce((acc, shoe) => {
    //                 if (shoe.promo === 0) {
    //                     acc.isnoPromo.push(shoe);
    //                 } else {
    //                     acc.ispromo.push(shoe);
    //                 }
    //                 return acc;
    //             }, { ispromo: [], isnoPromo: [] } as { ispromo: Product[]; isnoPromo: Product[] });
    //             setPromo(ispromo);
    //             setNoPromo(isnoPromo)
    //         }
    // }, [data])
    return(<>
            <div className="ProductsPromoAnnouncement my-1 HomeTitle fw-bold carsl-item-title">
                <FaShirt className="mx-2 HomeTitleIconL"/>
                {t('shirts')}
                <FaShirt className="mx-2 HomeTitleIconR"/>
            </div>
            <ProductCarousel Data={data} productType="Shirts"/>
    </>)
    
};
export default HomeShoes;