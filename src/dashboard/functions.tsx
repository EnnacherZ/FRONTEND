


export const hideInfos = (infos: any, range: number): string => {
    if (!infos || typeof infos !== 'string') {
        return "Not found";
    }

    if (range >= infos.length) {
        return "*".repeat(infos.length);
    }

    const visiblePart = infos.slice(0, infos.length - range);
    const hiddenPart = "*".repeat(range);
    return visiblePart + hiddenPart;
};


export const dropIn = {
    hidden : {
        y : "-100vh",
        opacity : 0
    },
    visible : {
        y : 0,
        opacity : 1,
        transition:{
            type: "tween",
            duration: 0.8,
            ease: "easeInOut"
        }
    },
    exit : {
        y : "100vh",
        opacity : 0
    },
}

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