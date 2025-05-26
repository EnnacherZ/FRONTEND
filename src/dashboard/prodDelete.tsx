import React, {useState } from "react";
import Select from "react-select";
import { toast, ToastContainer, Zoom } from "react-toastify";
import Modals from "./modals";
import "../Styles/modals.css";
import { AnimatePresence } from "framer-motion";
import { OptionType } from "./pages/ProductsManager";
import apiInstance from "./api";



const connecter = apiInstance;

const ProdDelete : React.FC<{productType:string, AllOptions:OptionType[]}> = ({productType, AllOptions}) => {
    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
    const [isModal, setIsModal] = useState<boolean>(false);

    const productSwitcher = (productType:string) => {
        let prod = ""; let prodDetail = ""; let prodManager = "";
        switch(productType){
            case('Shoe'):
                prod = 'db/shoes';prodDetail = "db/updateShoeDetails";prodManager = "db/shoes/manager/";break;
            case('Sandal'):
                prod = 'db/sandals';prodDetail = "db/updateSandalDetails";prodManager = "db/sandals/manager/";break;
            case('Shirt'):
                prod = 'db/shirts';prodDetail = "db/updateShirtDetails";prodManager = "db/shirts/manager/";break;
            case('Pant'):
                prod = 'db/pants';prodDetail = "db/updatePantDetails";prodManager = "db/pants/manager/";break;
        }
        return [prod, prodDetail, prodManager];
    }

    const handleOption = (option:OptionType | null) =>  {
        setSelectedOption(option)
    };

    const handleSubmit = async () => {
        if(selectedOption){
            let prodId = selectedOption.value;
            const response = await connecter.delete(String(productSwitcher(productType)[2] + `${prodId}/`))
            if(response.status == 201){           
              window.location.reload();
            }           
        }    else{
        toast.error(`Check the fields of : ${!selectedOption?'product':''}`, {
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
            <form>
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
                <button type="button" className="btn btn-danger fw-bold" onClick={()=>setIsModal(true)}>Delete</button>
            </form>


        </div>
    <ToastContainer/>
    <AnimatePresence>
    {isModal&&<Modals
    cible="db/delete"
    item={{}}
    onBack={()=>setIsModal(false)}
    onDelete={handleSubmit}

    />}   
    </AnimatePresence>

    </>)


};
export default ProdDelete