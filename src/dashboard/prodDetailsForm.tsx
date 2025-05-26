import React, {useState } from "react";
import Select from "react-select";
import "./Styles/prodForm.css"
import { toast, ToastContainer, Zoom } from "react-toastify";
import { OptionType } from "./pages/ProductsManager";
import apiInstance from "./api";

const connecter = apiInstance;

const ProdDetailsForm : React.FC<{productType:string, AllOptions:OptionType[]}> = ({productType, AllOptions}) => {
    const [size, setSize] = useState<string | number >('');
    const [quantity, setQuantity] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<OptionType|null>(null);

    const productSwitcher = (productType:string) => {
        let prod = ""; let prodDetail = "";
        switch(productType){
            case('Shoe'):
                prod = 'db/shoes';prodDetail = "db/updateShoeDetails";break;
            case('Sandal'):
                prod = 'db/sandals';prodDetail = "db/updateSandalDetails";break;
            case('Shirt'):
                prod = 'db/shirts';prodDetail = "db/updateShirtDetails";break;
            case('Pant'):
                prod = 'db/pants';prodDetail = "db/updatePantDetails";break;
        }
        return [prod, prodDetail];
    }

    const handleOption = (option:OptionType | null) =>  {
        setSelectedOption(option)};



    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        if(selectedOption && size!='' && quantity!=0){
            console.log(size, selectedOption.value, quantity)
        try{
            const response = await connecter.post(productSwitcher(productType)[1], {
                productId: selectedOption.value,
                size : size,
                quantity: quantity
            });
            if(response.status == 201){
              window.location.reload();
            }            
        }catch{}
    }
    else{
        toast.error(`Check the fields of : ${!selectedOption?'product':''} ${size==''?'size':''} ${quantity==0?"quantity":''}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Zoom,
    });
    }


    }


    return(<>
        <div className="prodForm">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="ref" className="form-label"> Product :</label>
                    <Select
                    options={AllOptions}
                    value={selectedOption}
                    onChange={handleOption}
                    placeholder="Choisissez un produit"
                    isClearable
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"> Size :</label>
                    <input
                    type="text"
                    className="form-control"
                    id="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"> Quantity :</label>
                    <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    value={quantity==0?undefined:quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    min={1}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>

<ToastContainer/>
    </>)


}

export default ProdDetailsForm;