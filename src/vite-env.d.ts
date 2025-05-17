/// <reference types="vite/client" />
declare class YCPay {
    constructor(publicKey: string, options: {
        formContainer: string;
        locale?: string;
        isSandbox?: boolean;
        errorContainer?: string;
        customCSS?: string;
        token?: string;
    });

    renderCreditCardForm(theme?: string): void;
    pay(token: string): Promise<any>;
    renderAvailableGateways(list? : Array, theme?: string )
}

