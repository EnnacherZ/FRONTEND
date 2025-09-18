export const goTo = (ref:string) => {window.location.href = ref}

  export const selectedLang = (l:string) => {
    let a = '';
    switch(l){
        case    'العربية':
            a = 'ar';
            break;
        case 'Français':
            a = 'fr';
            break;
        case 'English':
            a='en';
            break
    }return a
}


export const shoesCategories =  [
    "Mocassins", "Classics", "Baskets", "Medical"
]
export const sandalsCategories = [
    "Cuir", "Sport"
]

export const shirtsCategories = [
    "T-Shirt", "Polo", "Casual", "Chemise"
]

export const pantsCategories = [
    "Classic", "Sport", "Jeans"
]


export const policiesAcceptanceText = (lang:string) => {
    switch(lang){
        case "fr":
            return <p>J’accepte les <a href="/Policies/General-terms-of-use" target="_blank">conditions générales d’utilisation</a> et la <a href="/Policies/Privacy-policy" target="_blank">politique de confidentialité</a>.</p>
        case "en":
            return <p>I agree to the <a href="/Policies/General-terms-of-use" target="_blank">Terms of Service</a> and the <a href="/Policies/Privacy-policy" target="_blank">Privacy Policy</a>.</p>
        case "ar":
            return <p> أوافق على <a href="/Policies/General-terms-of-use" target="_blank">شروط الاستخدام</a> و<a href="/Policies/Privacy-policy" target="_blank">سياسة الخصوصية</a>.</p>
        }   
}


export const cities = [
    "Laayoune"
]