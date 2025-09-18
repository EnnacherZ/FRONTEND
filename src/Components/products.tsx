import React, { useEffect, useState } from "react";
import '../Styles/products.css';
import { useCart } from "../Contexts/cartContext";
import { FaCartPlus } from "react-icons/fa6";
import { RiErrorWarningLine } from "react-icons/ri";
import { Bounce, toast } from "react-toastify";
import FilterSection, { DataToFilter } from "./FilterSection";
import { motion } from "framer-motion";
import { Product, ProductDetail } from "../Contexts/ProductsContext";
import ReactPaginate from 'react-paginate';
import { useTranslation } from "react-i18next";
import { useLangContext } from "../Contexts/languageContext";
import NotFound from "./NotFound";
import NoProduct from "./NoProduct";
import Loading from "./loading";
import { selectedLang } from "./functions";

interface productsShow {
   pData: any;
   pDataDetails: any;
   productShowed: string;
   handleFilter: (criteria: DataToFilter) => void;
   handleReset : ()=>void;
}

const Products: React.FC<productsShow> = ({ pData, pDataDetails, productShowed,handleFilter, handleReset }) => {

    const { addItem } = useCart();
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const [products, setProducts] = useState<Product[]>();
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
    const [clickedButton, setClickedButton] = useState<{ [key: number]: string | null }>({});
    const [selectedProductDetails, setSelectedProductDetails] = useState<{ [key: number]: { size: string; quantity: number | null } }>({});
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = import.meta.env.VITE_PAGINATION;

    const handleSizeClick = (productId: number, size: string, quantity: number) => {
        setClickedButton((prevClickedButton) => ({
            ...prevClickedButton,
            [productId]: size,
        }));
        setSelectedProductDetails((prevDetails) => ({
            ...prevDetails, [productId]: { size, quantity }
        }));
    };

    function sizeFilter(L: ProductDetail[], l: number) {
        if (!Array.isArray(L)) {
            return [];
        }
        let x = L.filter((p) => p.productId === l).map((p) => [p.size, p.quantity] as [string, number]);
        return x;
    }

    const isRemaining = (i: number) => {
        const productDetail = selectedProductDetails[i];
        if (!productDetail) {
            return true;
        }
        return productDetail.quantity !== null && productDetail.quantity > 0;
    };

    useEffect(() => {
        setProducts(pData);
        setProductDetails(pDataDetails);
    }, [pData, pDataDetails]);

    const handleCommand = (product: Product) => {
        if (!selectedProductDetails[product.id]) {
            toast.error(t('toastSizeAlert'), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            return;
        }
        const item = {
            product: productShowed,
            id: product.id,
            category: product.category,
            ref: product.ref,
            name: product.name,
            price: product.price,
            size: selectedProductDetails[product.id].size,
            quantity: 1,
            image: product.image,
            promo: product.promo
        };
        addItem(item);
        toast.success(t('toastAddSuccess') , {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    const getProductDetail = (pro: Product) => {
        window.location.href = `/productDetails/${pro.productType}/${pro.category}/${pro.ref}/${pro.id}`;
    };

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected);
    };

    const displayedProducts =products? products?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage): [];
    const pageCount =products? Math.ceil(products.length / itemsPerPage):0

    
    if(!products){return <Loading message={t('loadingProducts')}/>}
    else if(products?.length==0 ){return <NoProduct />}
    return (
        <>
            <div className="productsDiv mt-3">
                <FilterSection handleFilter={handleFilter} productType={productShowed} handleReset={handleReset}/>
                {products.length > 0 ?(
                    <div className="products-wrapper">
                        {displayedProducts.map((pro) => (
                            <motion.div
                                key={pro.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}>
                                <div className="productCard p-0 card rounded-3 d-flex flex-column ">
                                    <div className="imgContainer rounded-" onClick={() => getProductDetail(pro)}>
                                        <img src={`${pro.image}`} />
                                    </div>
                                    <div className="text-center product-infos"
                                        style={{ wordSpacing: 2, gap: 2, textTransform: 'capitalize' }}
                                        onClick={() => getProductDetail(pro)}>
                                        <div>{pro.category.toLowerCase()} {pro.ref}</div>
                                        <div>{pro.name.toLowerCase()}</div>
                                    </div>
                                    <div className="product-text text-center product-price fw-bold"
                                        style={{ wordSpacing: 2 }}
                                        onClick={() => getProductDetail(pro)}>
                                        {pro.promo === 0 ? (
                                            <span className="product-pprice">{(pro.price).toFixed(2)} {t('mad')}</span>
                                        ) : (
                                            <>
                                                <span className="product-pprice">{(pro.price * (100 - pro.promo) * 0.01).toFixed(2)} {t('mad')}</span>
                                                <span className="product-dprice">
                                                    {(pro.price).toFixed(2)} {t('mad')}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div  className={`px-1 my-2 size-label 
                                                    ${selectedLang(currentLang)=='ar'?'rtl':''}`} 
                                          onClick={() => getProductDetail(pro)}>
                                        {t('sizes')} :
                                    </div>
                                    <div className="product-sizes-box">
                                        {sizeFilter(productDetails, pro.id).map((i, index) => (
                                            <button className={`product-size-button ${clickedButton[pro.id] === i[0] ? 'clicked' : ''}`}
                                                style={i[1] !== 0 ? {} : {
                                                    borderColor: 'red',
                                                    color: 'red', textDecoration: 'line-through',
                                                    textDecorationColor: 'red'
                                                }}
                                                key={index}
                                                onClick={() => { handleSizeClick(pro.id, i[0], i[1]) }}>
                                                {i[0]}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="rounded-0 mb-0">
                                        <button className="px-1 comm-button "
                                            onClick={() => handleCommand(pro)}
                                            disabled={!isRemaining(pro.id)}>
                                            {isRemaining(pro.id) ? (
                                                <><FaCartPlus size={16} className="comm-icon" /> {t('addCart')}</>
                                            ) : (
                                                <><RiErrorWarningLine size={18} className="comm-icon" /> {t('soldOut')} </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        
                    </div>
                ):(<NotFound onReset={handleReset}/>)}
                
            </div>
            {products.length > 0 && (
                    <ReactPaginate
                        previousLabel={`< ${t('previous')}`}
                        nextLabel={`${t('next')} >`}
                        breakLabel={'...'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                        
                    />
                )}
        </>
    );
};

export default Products;
