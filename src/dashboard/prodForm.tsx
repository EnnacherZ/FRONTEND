import React, { useState } from 'react';
import "./Styles/prodForm.css";
import apiInstance from './api';
import { AnimatePresence, motion } from 'framer-motion';
import { dropIn } from './functions';
import { Rings } from 'react-loader-spinner';
import ModalBackDrop from '../Components/modalBackdrop';
import { useParametersContext } from './Contexts/ParametersContext';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer, Zoom } from 'react-toastify';

const connecter = apiInstance;

const ProductForm: React.FC<{ productType: string }> = ({ productType }) => {
    const {t} = useTranslation();
    const { categories } = useParametersContext();
    const [ref, setRef] = useState<number>(0);
    const [name, setName] = useState('');
    const [category, setCategory] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [newest, setNewest] = useState<boolean>(false);
    const [promo, setPromo] = useState<number>(0);
    const [imageP, setImageP] = useState<File>();
    const [images, setImages] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageP(e.target.files[0]);
        }
    };

    const productSwitcher = (type: string) => {
        switch (type) {
            case 'Shoe': return 'db/shoes';
            case 'Sandal': return 'db/sandals';
            case 'Shirt': return 'db/shirts';
            case 'Pant': return 'db/pants';
            default: return 'db/products';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(category == ''){
            toast.error(t('categoryErrorMessage'), {
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
            
        }else{
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('ref', ref.toString());
        formData.append('price', price.toString());
        formData.append('newest', newest ? 'true' : 'false');
        formData.append('promo', promo.toString());
        formData.append('productType', productType);
        if (imageP) {
            formData.append('image', imageP);
        }

        images.forEach((image, index) => {
            formData.append(`image${index + 1}`, image);
        });

        try {
            const response = await connecter.post(productSwitcher(productType), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Produit créé:', response.data, response.status);
            if (response.status === 201) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Erreur lors de la création du produit:', error);
        }
        setIsLoading(false);
    }};

    if (!categories) return <>Chargement des catégories...</>;

    return (
        <div className="prodForm">
            <h2>Créer un produit dans {productType}</h2>
            <form onSubmit={handleSubmit}>
                {/* Select catégorie */}
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">{t('category')} :</label>
                    <select
                        id="category"
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value={''}>{t('selectCategory')} </option>
                        
                        {(categories[productType] as any[])?.length>0?(categories[productType] as any[]).map((cat, index) => (
                            <option value={cat} key={index}>
                                {cat}
                            </option>
                        )):
                        <option value={undefined} disabled>{t('noCategoryData')}</option>}
                    </select>
                </div>

                {/* Référence */}
                <div className="mb-3">
                    <label htmlFor="ref" className="form-label">{t('ref')} :</label>
                    <input
                        type="number"
                        className="form-control"
                        id="ref"
                        value={ref}
                        onChange={(e) => setRef(Number(e.target.value))}
                        required
                    />
                </div>

                {/* Nom */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">{t('name')} :</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                {/* Prix */}
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">{t('price')} :</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        min="0"
                        required
                    />
                </div>

                {/* Switch Newest */}
                <div className="mb-3 form-check form-switch">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="flexSwitchCheckDefault"
                        checked={newest}
                        onChange={() => setNewest(!newest)}
                    />
                    <label htmlFor="flexSwitchCheckDefault" className="form-check-label">{t('newerProduct')} </label>
                </div>

                {/* Promo */}
                <div className="mb-3">
                    <label htmlFor="promo" className="form-label">{t('promotion')} (%):</label>
                    <input
                        type="number"
                        className="form-control"
                        id="promo"
                        value={promo}
                        onChange={(e) => setPromo(Number(e.target.value))}
                        min="0"
                        max="100"
                    />
                </div>

                {/* Image principale */}
                <div className="mb-3">
                    <label htmlFor="mainImage" className="form-label">{t('mainImage')} :</label>
                    <input
                        type="file"
                        className="form-control"
                        id="mainImage"
                        onChange={handleImageChange}
                        required
                    />
                </div>

                {/* Autres images */}
                <div className="mb-3">
                    <label htmlFor="images" className="form-label">{t('additionalImages')} :</label>
                    <input
                        type="file"
                        className="form-control"
                        id="images"
                        multiple
                        onChange={handleImagesChange}
                    />
                </div>

                {/* Counter d’images */}
                <div className="images-counter mb-3 fw-bold" style={{ fontSize: 12 }}>
                    {t('imagesUploaded')} : {images.length < 4 ? images.length : '4 (Max)'}
                </div>

                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Ajout en cours...' : 'Ajouter le produit'}
                </button>
            </form>

            {/* Modal de chargement */}
            <AnimatePresence mode="wait">
                {isLoading &&
                    <ModalBackDrop onClose={() => { }} onOpen={true}>
                        <motion.div
                            onClick={e => e.stopPropagation()}
                            className=""
                            variants={dropIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex-column rounded shadow" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                margin: 'auto',
                                marginTop: 50,
                                width: '80%'
                            }}>
                                <Rings
                                    height="10em"
                                    width="10em"
                                    color="#0e92e4"
                                    ariaLabel="loading"
                                    wrapperStyle={{ justifyContent: 'center', alignItems: "center" }}
                                />
                                <div className="loading-msg fs-3 fw-bold text-center my-4">
                                    {t('loading')} ...
                                </div>
                            </div>
                        </motion.div>
                    </ModalBackDrop>
                }
            </AnimatePresence>
            <ToastContainer/>
        </div>
    );
};

export default ProductForm;
