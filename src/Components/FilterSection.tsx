import React, { useLayoutEffect, useState } from "react";
import {FaSearch } from "react-icons/fa";
import "../Styles/FilterSection.css"
import {FaArrowUp } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useLangContext } from "../Contexts/languageContext";
import { selectedLang } from "./functions";
import { useParametersContext } from "../dashboard/Contexts/ParametersContext";

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
    const {t} = useTranslation();
    const {categories} = useParametersContext();
    const {currentLang} = useLangContext();
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
        <div className={`filter-section ${dropOn?"extended":""} px-1 ${isPhone?'':'rounded'} shadow ${selectedLang(currentLang)=='ar'&&'rtl'}`}>
                <div className="filter-title">
                    <FaSearch /> <span>{t('search')}</span>
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
                            <label className="label-control">{t("productType")}</label>
                            <input
                                readOnly
                                disabled
                                className="form-control mt-1 fw-bold"
                                id="autoSizingSelect idProduct"
                                value={t(productType)} />
                        </div>

                        <div className={isPhone?'':"mb-3 "}>
                            <label>{t('catgory')}</label>
                            <select
                                className="form-select mt-1"
                                id="autoSizingSelect idCategory"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value={""}>{t('selectCategory')}</option>
                        {(categories[productType] as any[])?.length>0?(categories[productType] as any[]).map((cat, index) => (
                            <option value={cat} key={index}>
                                {cat}
                            </option>
                        )):
                        <option value={undefined} disabled></option>}
                            </select>
                        </div>

                        <div className={isPhone?'':"mb-3 "}>
                            <label>{t('ref')}</label>
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
                            <label>{t('name')}</label>
                            <input
                                className="form-control mt-1"
                                id="autoSizingSelect idName"
                                type="text"
                                placeholder="enter a name"
                                value={selectedName}
                                onChange={(e) => setSelectedName(e.target.value)} />
                        </div>

                        <div className={isPhone?'':"mb-3 "}>
                            <button onClick={handleSearch} type="submit" className="btn btn-primary inputs-button" >{t('search')}</button>
                        </div>

                        <div className={isPhone?'':"mb-3 "}>
                            <button type='reset' className="btn btn-secondary inputs-button"  onClick={handleGlobalReset}>{t('reset')}</button>
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
                    <label className="label-control">{t('productType')}:</label>
                    <div className="input-group">
                    <input
                        readOnly
                        disabled
                        className="form-control mt-1 fw-bold"
                        id="autoSizingSelect idProduct"
                        value={t(productType)} /> 
                    </div>

                </div>

                <div className={isPhone?'':"mb-3 "}>
                    <label>{t('category')}:</label>
                <select className="form-select" aria-label="Default select example">
                    <option value={""} className="text-muted" aria-placeholder="hjhvj">{t('selectCategory')} </option>
                        {(categories[productType] as any[])?.length>0?(categories[productType] as any[]).map((cat, index) => (
                            <option value={cat} key={index}>
                                {cat}
                            </option>
                        )):
                        <option value={undefined} disabled></option>}
                </select>
                </div>

                <div className={isPhone?'':"mb-3 "}>
                    <label>{t('ref')}:</label>
                    <input
                        className="form-control mt-1"
                        id="autoSizingSelect idRef"
                        type="text"
                        placeholder= {t('enterRef')}
                        value={selectedRef}
                        onChange={(e) => setSelectedRef(e.target.value)} />
                </div>

                <div className={isPhone?'':"mb-3 "}>
                    <label>{t('name')}:</label>
                    <input
                        className="form-control mt-1"
                        id="autoSizingSelect idName"
                        type="text"
                        placeholder={t('enterName')}
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)} />
                </div>

                <div className={isPhone?'':"mb-3 "}>
                    <button onClick={handleSearch} type="submit" className="btn btn-primary inputs-button" >{t('search')}</button>
                </div>

                <div className={isPhone?'':"mb-3 "}>
                    <button type='reset' className="btn btn-secondary inputs-button"  onClick={handleGlobalReset}>{t('reset')}</button>
                </div>

        </div>
            </>)}



    </div>
    </>

    );


};
export default FilterSection;