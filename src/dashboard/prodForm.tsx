import React, { useState } from 'react';
import "./Styles/prodForm.css";
import apiInstance from './api';


const connecter = apiInstance;

const ProductForm: React.FC<{productType:string}> = ({productType}) => {
    const [ref, setRef] = useState<number>(0);
    const [name, setName] = useState('');
    const [category, setCategory] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [newest, setNewest] = useState<boolean>(false);
    const [promo, setPromo] = useState<number>(0);
    const [imageP, setImageP] = useState<File>();
    const [images, setImages] = useState<File[]>([]);

    // Fonction de gestion de l'upload d'images
    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };
    const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files){setImageP(e.target.files[0])}
    }

    const productSwitcher = (productType:string) => {
        let prod = "";
        switch(productType){
            case('Shoe'):
                prod = 'db/shoes';break;
            case('Sandal'):
                prod = 'db/sandals';break;
            case('Shirt'):
                prod = 'db/shirts';break;
            case('Pant'):
                prod = 'db/pants';break;
        }
        return prod;
    }


    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category)
        formData.append('ref', ref.toString());
        formData.append('price', price.toString());
        formData.append('newest', newest ? 'true' : 'false');
        formData.append('promo', promo.toString());
        formData.append('productType', 'Shoe');
        formData.append('image', imageP || '')
        
        
        // Ajout des images au FormData
        images.forEach((image, index) => {
            formData.append(`image${index+1}`, image);
        });

        try {
            // Envoi des données au backend via l'API
            const response = await connecter.post(productSwitcher(productType), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Produit créé:',response.data, response.status);
            if(response.status == 201){
              window.location.reload();
            }
        } catch (error) {
            
            console.error('Erreur lors de la création du produit:', error);
        }
    };

    return (
        <div className="prodForm">
        <h2>Créer un produit dans {productType}</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="ref" className="form-label">Category:</label>
            <input
              type="text"
              className="form-control"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="ref" className="form-label">Référence:</label>
            <input
              type="number"
              className="form-control"
              id="ref"
              value={ref}
              onChange={(e) => setRef(Number(e.target.value))}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nom:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Prix:</label>
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
          <div className="mb-3 form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="flexSwitchCheckDefault"
              checked={newest}
              onChange={() => setNewest(!newest)}
              required
            />
            <label htmlFor="newest" className="form-check-label">Produit le plus récent:</label>
          </div>
          <div className="mb-3">
            <label htmlFor="promo" className="form-label">Promo (%):</label>
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
          <div className="mb-3">
            <label htmlFor="images" className="form-label">Image Pricipale:</label>
            <input
              type="file"
              className="form-control"
              id="images"
              multiple
              onChange={handleImageChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="images" className="form-label">Images:</label>
            <input
              type="file"
              className="form-control"
              id="images"
              multiple
              onChange={handleImagesChange} 
            />
          </div>
          <button type="submit" className="btn btn-primary">Ajouter le produit</button>
        </form>
      </div>
      
    );
};

export default ProductForm;
