import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useShoesData from '../Server/shoesData';
import { ProductDetail } from './ProductsContext';
import useSandalsData from '../Server/sandalsData';
import useShirtsData from '../Server/shirtsData';
import usePantsData from '../Server/pantsData';


export interface CartItem {
  product: string;
  id: number;
  ref: string;
  category: string;
  name: string;
  price: number;
  size: string;
  image : string;
  promo: number;
  quantity: number;
}

export interface AllItems {
  Shoes:CartItem[];
  Sandals:CartItem[];
  Shirts : CartItem[];
  Pants : CartItem[]
}
export interface AllItemsPrice {
  amountShoes: number;
  amountSandals: number;
  amountShirts : number;
  amountPants : number
}

export interface CartContextType {
  allItems : AllItems;
  successTransItems:AllItems;
  shoesItems: CartItem[];
  sandalsItems : CartItem[];
  shirtsItems : CartItem[];
  pantsItems : CartItem[];
  itemCount: number;
  cartTotalAmount : AllItemsPrice;
  total : number;
  cartChecker : boolean | undefined;
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  clearCart: () => void;
  handlePlusQuantity : (item : CartItem) => void;
  handleMinusQuantity : (item : CartItem) => void;
  setSuccessTransItems : React.Dispatch<React.SetStateAction<AllItems>>; 
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  function quantityFilter(L: ProductDetail[], l: number, size : string) {
    let x = L.filter((p) => p.productId === l && p.size ===size).map((p) => p.quantity);
    return x[0];
  }
  const {shoesDataDetails} = useShoesData();
  const {sandalsDataDetails} = useSandalsData();
  const {shirtsDataDetails} = useShirtsData();
  const {pantsDataDetails} = usePantsData();
  const [cartChecker, setCartChecker] = useState<boolean>()
  const [cartTotalAmount, setCartTotalAmount] = useState<AllItemsPrice>({
    amountShoes: 0,
    amountSandals: 0,
    amountShirts : 0,
    amountPants : 0
  });
  const total = Number((cartTotalAmount.amountShoes + cartTotalAmount.amountSandals + cartTotalAmount.amountPants + cartTotalAmount.amountShirts).toFixed(2));
  const [shoesItems, setShoesItems] = useState<CartItem[]>(() => {
    try {
      const savedShoesItems = localStorage.getItem('CartShoesItems');
      if (savedShoesItems) {
        return JSON.parse(savedShoesItems);
      }
      return [];
    } catch (error) {
      console.error('Error parsing CartItems from localStorage:', error);
      return [];
    }
  });
  const [sandalsItems, setSandalsItems] = useState<CartItem[]>(() => {
    try {
      const savedSandalsItems = localStorage.getItem('CartSandalsItems');
      if (savedSandalsItems) {
        return JSON.parse(savedSandalsItems);
      }
      return [];
    } catch (error) {
      console.error('Error parsing CartItems from localStorage:', error);
      return [];
    }
  });
  const [shirtsItems, setShirtsItems] = useState<CartItem[]>(() => {
    try {
      const savedClothesItems = localStorage.getItem('CartClothesItems');
      if (savedClothesItems) {
        return JSON.parse(savedClothesItems);
      }
      return [];
    } catch (error) {
      console.error('Error parsing CartItems from localStorage:', error);
      return [];
    }
  });
  const [pantsItems, setPantsItems] = useState<CartItem[]>(() => {
    try {
      const savedPantsItems = localStorage.getItem('CartPantsItems');
      if (savedPantsItems) {
        return JSON.parse(savedPantsItems);
      }
      return [];
    } catch (error) {
      console.error('Error parsing CartItems from localStorage:', error);
      return [];
    }
  });

  const allItems = {
    Shoes: shoesItems,
    Sandals: sandalsItems,
    Shirts: shirtsItems,
    Pants: pantsItems,
  };

  const [itemCount, setItemCount] = useState<number>(() => {
    try {
      const savedCount = localStorage.getItem('itemsCounter');
      if (savedCount) {
        return JSON.parse(savedCount);
      }
      return 0;
    } catch (error) {
      console.error('Error parsing itemsCounter from localStorage:', error);
      return 0;
    }
  });
  const [successTransItems, setSuccessTransItems]=useState<AllItems>(()=>{
    try{
      const items = sessionStorage.getItem('ALFirdaousStoreSuccessItems');
      if(items){return JSON.parse(items)}else{return {}}
    }catch(err){return {}}
  });
  useEffect(()=>{
    try{sessionStorage.setItem('ALFirdaousStoreSuccessItems',JSON.stringify(successTransItems))}
    catch(err){}
    },[successTransItems])

  // useEffect(()=>{
  //   if(shoesItems.length>0){setSuccessTransItems((prev)=>({...prev, Shoes:shoesItems}))}else{return}
  // },[shoesItems])
  // useEffect(()=>{
  //   if(sandalsItems.length>0){setSuccessTransItems((prev)=>({...prev, Sandals:sandalsItems}))}else{return}
  // },[sandalsItems])
  // useEffect(()=>{
  //   if(shirtsItems.length>0){setSuccessTransItems((prev)=>({...prev, Shirts:shirtsItems}))}else{return}
  // },[shirtsItems])
  // useEffect(()=>{
  //   if(pantsItems.length>0){setSuccessTransItems((prev)=>({...prev, Pants:pantsItems}))}else{return}
  // },[pantsItems])


  useEffect(() => {
    try {
      localStorage.setItem('CartShoesItems', JSON.stringify(shoesItems));
      const amount:number  = (shoesItems.reduce((acc, item)=>(acc +(item.price*(1-item.promo*0.01)*item.quantity)), 0))
      setCartTotalAmount((prevTotal) => ({
        ...prevTotal,
        amountShoes: Math.round(amount * 100) / 100, 
      }));
    } catch (error) {
      console.error('Error saving CartItems to localStorage:', error);
    }
  }, [shoesItems]);
  useEffect(() => {
    try {
      localStorage.setItem('CartSandalsItems', JSON.stringify(sandalsItems));
      const amount:number  = sandalsItems.reduce((acc, item)=>(acc +(item.price*(1-item.promo*0.01)*item.quantity)), 0)
      setCartTotalAmount((prevTotal) => ({
        ...prevTotal,
        amountSandals: Math.round(amount * 100) / 100, 
      }));
    } catch (error) {
      console.error('Error saving CartItems to localStorage:', error);
    }
  }, [sandalsItems]);
  useEffect(() => {
    try {
      localStorage.setItem('CartClothesItems', JSON.stringify(shirtsItems));
      const amount:number  = shirtsItems.reduce((acc, item)=>(acc +(item.price*(1-item.promo*0.01)*item.quantity)), 0)
      setCartTotalAmount((prevTotal) => ({
        ...prevTotal,
        amountClothes: Math.round(amount * 100) / 100, 
      }));
    } catch (error) {
      console.error('Error saving CartItems to localStorage:', error);
    }
  }, [shirtsItems]);
  useEffect(() => {
    try {
      localStorage.setItem('CartPantsItems', JSON.stringify(pantsItems));
      const amount:number  = pantsItems.reduce((acc, item)=>(acc +(item.price*(1-item.promo*0.01)*item.quantity)), 0)
      setCartTotalAmount((prevTotal) => ({
        ...prevTotal,
        amountPants: Math.round(amount * 100) / 100, 
      }));
    } catch (error) {
      console.error('Error saving CartItems to localStorage:', error);
    }
  }, [pantsItems]);

  useEffect(()=>{
    setItemCount(()=>{
      let cnt =0;
      for(const p of Object.keys(allItems)){
        for(const m of allItems[p as keyof AllItems]){
          cnt+=m.quantity
        }
      }
      return cnt
    })
  }, [allItems])


  useEffect(() => {
    try {
      localStorage.setItem('itemsCounter', JSON.stringify(itemCount));
    } catch (error) {
      console.error('Error saving itemsCounter to localStorage:', error);
    }
  }, [itemCount]);

  const addItem = (item: CartItem) => {
    if(item.product==='Shoe'){

      if(shoesItems.find((it)=>it.id===item.id && it.size ===item.size)){
        setShoesItems((prevItems)=>prevItems.map((it)=>it.id===item.id&&it.size===item.size?
          {...it, quantity :it.quantity+=1}:it))
      }else{
      setShoesItems((prevItems) => [...prevItems, item]);
      }
    }
    if(item.product==='Sandal'){
      if(sandalsItems.find((it)=>it.id===item.id && it.size ===item.size)){
        setSandalsItems((prevItems)=>prevItems.map((it)=>it.id===item.id&&it.size===item.size?
          {...it, quantity :it.quantity+=1}:it))
      }else{
      setSandalsItems((prevItems) => [...prevItems, item]);
      }
    } 
    if(item.product==='Shirt'){
      if(shirtsItems.find((it)=>it.id===item.id && it.size ===item.size)){
        setShirtsItems((prevItems)=>prevItems.map((it)=>it.id===item.id&&it.size===item.size?
          {...it, quantity :it.quantity+=1}:it))
      }else{
      setShirtsItems((prevItems) => [...prevItems, item]);
      }
    }
    if(item.product==='Pant'){
      if(pantsItems.find((it)=>it.id===item.id && it.size ===item.size)){
        setPantsItems((prevItems)=>prevItems.map((it)=>it.id===item.id&&it.size===item.size?
          {...it, quantity :it.quantity+=1}:it))
      }else{
      setPantsItems((prevItems) => [...prevItems, item]);
      }
    }
  };

  const handlePlusQuantity = (item: CartItem) => {
    if (item.product === 'Shoe') {
      const quant = quantityFilter(shoesDataDetails, item.id, item.size);
      setShoesItems((prevItems) =>
        prevItems.map((it) =>
          it.id === item.id && it.size === item.size
            ? quant > it.quantity
              ? { ...it, quantity: it.quantity + 1 }
              : it
            : it
        )
      );
    }
  
    if (item.product === 'Sandal') {
      const quant = quantityFilter(sandalsDataDetails, item.id, item.size); // Assurez-vous d'utiliser la bonne source de données
      setSandalsItems((prevItems) =>
        prevItems.map((it) =>
          it.id === item.id && it.size === item.size
            ? quant > it.quantity
              ? { ...it, quantity: it.quantity + 1 }
              : it
            : it
        )
      );
    }
  
    if (item.product === 'Shirt') {
      const quant = quantityFilter(shirtsDataDetails, item.id, item.size); // Vérification pour Shirt
      setShirtsItems((prevItems) =>
        prevItems.map((it) =>
          it.id === item.id && it.size === item.size
            ? quant > it.quantity
              ? { ...it, quantity: it.quantity + 1 }
              : it
            : it
        )
      );
    }
  
    if (item.product === 'Pant') {
      const quant = quantityFilter(pantsDataDetails, item.id, item.size); // Vérification pour Pant
      setPantsItems((prevItems) =>
        prevItems.map((it) =>
          it.id === item.id && it.size === item.size
            ? quant > it.quantity
              ? { ...it, quantity: it.quantity + 1 }
              : it
            : it
        )
      );
    }
  };
  

const handleMinusQuantity = (item:CartItem) =>{
    if(item.quantity<2){return}
    if(item.product==='Shoe'){
      setShoesItems((prevItems)=>
        prevItems.map((it)=>it.id===item.id&&it.size===item.size?{...it, quantity: it.quantity-1}:it))
    }
    if(item.product==='Sandal'){
      setSandalsItems((prevItems)=>
        prevItems.map((it)=>it.id===item.id&&it.size===item.size?{...it, quantity: it.quantity-1}:it))
    }
    if(item.product==='Shirt'){
      setShirtsItems((prevItems)=>
        prevItems.map((it)=>it.id===item.id&&it.size===item.size?{...it, quantity: it.quantity-1}:it))
    }
    if(item.product==='Pant'){
      setPantsItems((prevItems)=>
        prevItems.map((it)=>it.id===item.id&&it.size===item.size?{...it, quantity: it.quantity-1}:it))
    }

}


  const removeItem = (item: CartItem) => {
    if(item.product=='Shoe'){
      setShoesItems((prevItems) => prevItems.filter((i) => i!==item));
      localStorage.setItem('CartShoesItems', JSON.stringify(shoesItems));
    }
    if(item.product=='Sandal'){
      setSandalsItems((prevItems) => prevItems.filter((i) => i!==item));
      localStorage.setItem('CartSandalsItems', JSON.stringify(shoesItems));
    }
    if(item.product=='Shirt'){
      setShirtsItems((prevItems) => prevItems.filter((i) => i!==item));
      localStorage.setItem('CartClothesItems', JSON.stringify(shoesItems));
    }
    if(item.product=='Pant'){
      setPantsItems((prevItems) => prevItems.filter((i) => i!==item));
      localStorage.setItem('CartPantsItems', JSON.stringify(shoesItems));
    }
  };

  const clearCart = () => {
    setShoesItems([]);
    setSandalsItems([]);
    setShirtsItems([]);
    setPantsItems([]);
    setItemCount(0);
    localStorage.removeItem('CartItems');
    localStorage.removeItem('itemsCounter');
  };

  useEffect(()=>{
    const L = Object.keys(allItems);
    for(const p of L ){
      const k = p as keyof AllItems;
      if(allItems[k].length!==0){setCartChecker(true); break}
      else{setCartChecker(false)}
    }
  },[allItems])

  return (
    <CartContext.Provider value={{allItems, 
                                  successTransItems,
                                  shoesItems, 
                                  sandalsItems, 
                                  shirtsItems, 
                                  pantsItems, 
                                  itemCount, 
                                  cartTotalAmount,
                                  cartChecker,
                                  total,
                                  addItem, 
                                  removeItem, 
                                  clearCart, 
                                  handleMinusQuantity, 
                                  handlePlusQuantity,
                                  setSuccessTransItems   }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};