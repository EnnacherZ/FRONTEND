import { toast, Zoom } from "react-toastify";

const origin = import.meta.env.VITE_ACTUAL_ORIGIN;

export const hideInfos = (infos: any, range: number): string => {
    if (!infos || typeof infos !== 'string') {
        return "Not found";
    }

    if (range >= infos.length) {
        return "*".repeat(infos.length);
    }

    const visiblePart = infos.slice(0, infos.length - range);
    const hiddenPart = "*".repeat(5);
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
export const goToNewBlank = (ref:string) => {window.open(`${origin.slice(0, -1)}${ref}`, '_blank')}

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

export const showToast = (message:string, event : string) => {
            if(event == "error"){
                toast.error(message,{
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false, 
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  transition: Zoom,
                })
            }else if(event == "success"){
                toast.success(message,{
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false, 
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  transition: Zoom,
                })
            }


}