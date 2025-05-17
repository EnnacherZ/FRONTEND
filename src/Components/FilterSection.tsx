import React, { useLayoutEffect, useState } from "react";
import {FaSearch } from "react-icons/fa";
import "../Styles/FilterSection.css"
import {FaArrowUp } from "react-icons/fa6";

export interface DataToFilter {
    product : string,
    category : string,
    ref : string,
    name : string,
}
export interface FilterSectionProps{
    handleFilter : (criteria : DataToFilter) => void;
    productType : string;
    handleReset : ()=>void;
}


const FilterSection: React.FC<FilterSectionProps> = ({handleFilter, productType, handleReset}) =>{
    
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isPhone, setIsPhone] = useState<boolean>(false)
    const [isDroppedFilter, setIsDroppedFilter] = useState<boolean>(false)
    const [dropOn, setDropOn] = useState<boolean>(false)
    const [selectedRef, setSelectedRef] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const selectedCriteria : DataToFilter = {
        product : productType,
        category : selectedCategory,
        ref : selectedRef,
        name : selectedName,
    }

    useLayoutEffect(()=>{
        const isPhone = () =>{
            if(window.innerWidth<=800){setIsPhone(true)}
            else{setIsPhone(false)}
        }
        const isDropped = () =>{
            if(window.innerWidth<=650){setIsDroppedFilter(true)}
            else(setIsDroppedFilter(false))
        }
        isPhone();
        isDropped();
        addEventListener('resize', isPhone);
        addEventListener('resize', isDropped);
        return ()=>{
            window.removeEventListener('resize', isPhone);
            window.removeEventListener('resize', isDropped);
        }

    }, [window.innerWidth])
    

    const CategoryRender = (L:string) =>{
        let itemCategory : string[] = [];
        switch(L){
            case 'Shoe':
                itemCategory = ['Mocassin', 'Basket', 'Classic', 'Medical'];
                break;
            case 'Sandal':
                itemCategory = [''];
                break;
            case 'Pant Sport':
                itemCategory = ['Jeans', 'Toile'];
                break;
            case 'Pant Classic':
                itemCategory = ['Jeans', 'Toile'];
                break;
            case 'Shirt':
                itemCategory = ['Polo Sport', 'Polo décontracté', "T-Shirt", "Sweet"];
                break;
        }
        return itemCategory;  
        }

    const handleSearch = () =>{
        handleFilter(selectedCriteria);
        if(isDroppedFilter){
            setDropOn(false)
        };
        window.scrollTo(-5, -10)
    };
    const handleGlobalReset = () =>{
        handleReset();
        setSelectedCategory("");setSelectedName('');setSelectedRef("")
    }
    return(
        <>
        <div className={`filter-section ${dropOn?"extended":""} px-1 ${isPhone?'':'rounded'} shadow`}>
                <div className="filter-title">
                    <FaSearch /> <span>Search</span>
                </div>            
        {isDroppedFilter?
            (<>
                <div className={`toDropFilter ${dropOn?"closed":""} rounded-circle shadow flex-column`}
                    onClick={()=>setDropOn(true)}>
                    <div className="my-1 d-flex "><FaSearch size={20}/> </div>
                </div>
                <div className={`filter-dropped-inputs ${dropOn?"active":""}`}>
                    <div className={`FDI-S1 ${dropOn?'active':''}`}>
                        <div className={isPhone?'':"mb-3 "}>
                            <label className="label-control">Product</label>
                            <input
                                readOnly
                                disabled
                                className="form-control mt-1 fw-bold"
                                id="autoSizingSelect idProduct"
                                value={productType} />
                        </div>

                        <div className={isPhone?'':"mb-3 "}>
                            <label>Category</label>
                            <select
                                className="form-select me-5 mt-1"
                                id="autoSizingSelect idCategory"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value={""}>select category</option>
                                {CategoryRender(productType).map((it) => (
                                    <option key={it} value={it}>{it}</option>
                                ))}
                            </select>
                        </div>

                        <div className={isPhone?'':"mb-3 "}>
                            <label>Ref</label>
                            <input
                                className="form-control mt-1"
                                id="autoSizingSelect idRef"
                                type="text"
                                placeholder="enter a reference"
                                value={selectedRef}
                                onChange={(e) => setSelectedRef(e.target.value)} />
                        </div>

                    </div>
                    <div className={`FDI-S2 ${dropOn?'active':''}`}>
                        <div className={isPhone?'':"mb-3 "}>
                            <label>Name</label>
                            <input
                                className="form-control mt-1"
                                id="autoSizingSelect idName"
                                type="text"
                                placeholder="enter a name"
                                value={selectedName}
                                onChange={(e) => setSelectedName(e.target.value)} />
                        </div>

                        <div className={isPhone?'':"mb-3 "}>
                            <button onClick={handleSearch} type="submit" className="btn btn-primary inputs-button" >Search</button>
                        </div>

                        <div className={isPhone?'':"mb-3 "}>
                            <button type='reset' className="btn btn-secondary inputs-button"  onClick={handleGlobalReset}>Reset</button>
                        </div>
                    </div>
                    <div className={`closeDrppedFilter ${dropOn?'':'closed'} rounded-circle shadow`}
                        onClick={()=>setDropOn(false)}>
                        <FaArrowUp size={20}/>
                    </div>
                </div>

            </>)
            :(<>
        <div className="filter-inputs">
        
                <div className={isPhone?'':"mb-3 "}>
                    <label className="label-control">Product</label>
                    <div className="input-group">
                    <input
                        readOnly
                        disabled
                        className="form-control mt-1 fw-bold"
                        id="autoSizingSelect idProduct"
                        value={productType} /> 
                    </div>

                </div>

                <div className={isPhone?'':"mb-3 "}>
                    <label>Category</label>
                    <select
                        className="form-select me-5 mt-1"
                        id="autoSizingSelect idCategory"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value={""}>select category</option>
                        {CategoryRender(productType).map((it) => (
                            <option key={it} value={it}>{it}</option>
                        ))}
                    </select>
                </div>

                <div className={isPhone?'':"mb-3 "}>
                    <label>Ref</label>
                    <input
                        className="form-control mt-1"
                        id="autoSizingSelect idRef"
                        type="text"
                        placeholder="enter a reference"
                        value={selectedRef}
                        onChange={(e) => setSelectedRef(e.target.value)} />
                </div>

                <div className={isPhone?'':"mb-3 "}>
                    <label>Name</label>
                    <input
                        className="form-control mt-1"
                        id="autoSizingSelect idName"
                        type="text"
                        placeholder="enter a name"
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)} />
                </div>

                <div className={isPhone?'':"mb-3 "}>
                    <button onClick={handleSearch} type="submit" className="btn btn-primary inputs-button" >Search</button>
                </div>

                <div className={isPhone?'':"mb-3 "}>
                    <button type='reset' className="btn btn-secondary inputs-button"  onClick={handleGlobalReset}>Reset</button>
                </div>

        </div>
            </>)}



    </div>
    </>

    );


};
export default FilterSection;