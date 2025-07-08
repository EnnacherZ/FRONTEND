import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import DbHeader from "../DbHeader";
import "../Styles/settings.css";
import Accordion from "react-bootstrap/esm/Accordion";
import apiInstance, { USER_ROLE } from "../api";
import { useTranslation } from "react-i18next";
import { useLangContext } from "../../Contexts/languageContext";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { GiSettingsKnobs } from "react-icons/gi";
import { selectedLang } from "../functions";


const connecter = apiInstance;



const Settings : React.FC = () => {
    const {t} = useTranslation();
    const {currentLang} = useLangContext();
    const [productTypes, setProductTypes] = useState<string[]>();

    useEffect(()=>{
      const getTypes = async () => {
        const response = await connecter.get('db/products/getTypes');
        setProductTypes(response.data.types || [""]);
      };
      getTypes();
    },[])


return(<>

        <Sidebar/>
        <div className={`db-settings ${selectedLang(currentLang)=='ar'&&'rtl'}`} >
            <DbHeader/>
            <hr/>
            <div className="Prod-manage-title m-4 fw-bold">
              <GiSettingsKnobs  size={20}/> <span className="mx-3">{t('productSettings')} </span>
            </div>           
            <Accordion>
              <Accordion.Item eventKey="0" className="my-3 rounded card shadow ">
                <ProductTypes />
              </Accordion.Item>
              <Accordion.Item eventKey="1" className="my-3 rounded card shadow ">
                <ProductParameters productType={productTypes?productTypes:[""]} param="categories"/>
              </Accordion.Item>


{localStorage.getItem(USER_ROLE)=='admin'?
<>
            <hr/>
            <div className="Prod-manage-title m-4 fw-bold">
              <GiSettingsKnobs  size={20}/> <span className="mx-3">{t('usersManager')} </span>
            </div>        

              <Accordion.Item eventKey="2" className="my-3 rounded card shadow ">
                <Accordion.Header><span className="fw-bold mx-2">{t('addUser')}</span></Accordion.Header>
                <Accordion.Body>
                  <AddUser/>
                </Accordion.Body>
              </Accordion.Item>
</>
:<></>
}
            </Accordion>
        </div>
        


</>)

}







const ProductParameters : React.FC<{productType:string[], param:string}> = ({productType, param}) => {
  const {t} = useTranslation();
  const capitalize = (str:string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const [valuesText, setValuesText] = useState("");
  const [selectedType, setSelectedType] = useState<string>();
  //const [productsCategories, setProductsCategories] = useState<string[]>([]);
  const handlePostParameters = async (e: React.FormEvent) => {
    e.preventDefault();

    const values = valuesText
      .split(",")
      .map((v) => capitalize(v.trim()))
      .filter((v) => v.length > 0);

    try {
      if(!selectedType){
            toast.error('Please select a product type',{
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false, 
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  transition: Zoom,
                })
      }else{
      const response = await connecter.post("db/products/parameters", 
        {
          productType: selectedType, param: param, values : values
        }
      )

      if (response.status ==201) {
        window.location.reload()
      }
    } }catch (error) {
    }
  };


return(<>
      <Accordion.Header> <span className="fw-bold mx-2">{t('addProductCategories')}</span> </Accordion.Header>
        <Accordion.Body>
          <form onSubmit={handlePostParameters}>
        <div className="mb-3">
            <label htmlFor="ref" className="form-label"> {t('productType')} :</label>
            {productType.length>0?(<>
            <select name="" id="" className="form-select" aria-placeholder="Choose a product type" onChange={(e)=>{setSelectedType(e.target.value)}}>
            <option value={undefined}>{t('selectProductType')} </option>
            {productType.map((type,index)=>(
                <option value={type} key={index}>{type}</option>
            ))}
            </select>
            </>)
            :(<>
            <input
              type="text"
              className="form-control"
              id="category"
              value={"There is no product type in database"}
              disabled
            />
            </>)}
          </div>
        <div className="mb-3">
            <label htmlFor="ref" className="form-label">{t('category')} :</label>
            <input
              className="form-control"
              id="category"
              type="text"
              value={valuesText}
              onChange={(e) => setValuesText(e.target.value)}
              placeholder="ex: val1, val2, val3"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">{t('submit')} </button>
          </form>
        </Accordion.Body>
<ToastContainer/>
</>)

};


const ProductTypes : React.FC = () => {
  const {t} = useTranslation();
  const [productTypes, setProductTypes] = useState("");
  //const [productsCategories, setProductsCategories] = useState<string[]>([]);
  const handlePostParameters = async (e: React.FormEvent) => {
    e.preventDefault();

    const values = productTypes
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    try {
      const response = await connecter.post("db/products/setTypes", 
        {
          values : values
        }
      )

      if (response.status ==201) {
        window.location.reload()
      }
    } catch (error) {
    }
  };


return(<>
      <Accordion.Header> <span className="fw-bold mx-2">{t('addProductTypes')}</span> </Accordion.Header>
        <Accordion.Body>
          <form onSubmit={handlePostParameters}>
        <div className="mb-3">
            <label htmlFor="ref" className="form-label">{t('productType')} :</label>
            <input
              className="form-control"
              id="category"
              type="text"
              value={productTypes}
              onChange={(e) => setProductTypes(e.target.value)}
              placeholder="ex: val1, val2, val3"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">{t('submit')} </button>
          </form>
        </Accordion.Body>
</>)

};


const AddUser = () => {
    const {t} = useTranslation();
    const [username, setUsername] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [image, setImage] = useState<File>();
    const [loading, setLoading] = useState<boolean>(false);

    const users_roles = ['admin', 'manager', 'delivery']

        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                setImage(e.target.files[0]);
            }
        };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(role == ''){
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
        setLoading(true);
        const formData = new FormData();
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('role', role);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await connecter.post('db/user/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response);
            if (response.status === 201) {
                window.location.reload();
            }
        } catch (error) {
          console.log(error);
            alert(`Erreur lors de la création du produit: ${error}`);
        }
        setLoading(false);
    }};

return(<form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">{t('firstN')} :</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">{t('lastN')} :</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">{t('userName')} :</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">{t('password')} :</label>
                    <input
                        type="password"
                        className="form-control"
                        id="name"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">{t('role')} :</label>
                    <select
                        id="category"
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value={''}>{t('selectUserRole')} </option>
                        
                        {users_roles.map((cat, index) => (
                            <option value={cat} key={index}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="mainImage" className="form-label">{t('image')} :</label>
                    <input
                        type="file"
                        className="form-control"
                        id="mainImage"
                        onChange={handleImageChange}
                        required
                    />
                </div>

                <button className="btn btn-primary" type="submit">{loading ? 'Ajout en cours...' : t('submit')}</button>

</form>)

}

















export default Settings



