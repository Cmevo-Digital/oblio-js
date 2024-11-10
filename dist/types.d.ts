import { AccessToken } from './access-token/access-token';
export type InvoiceResponse = {
    seriesName: string;
    number: string;
    link: string;
    documentType?: string;
    text?: string;
};
export type OblioApiResponse = {
    status: number;
    statusMessage: string;
    data: InvoiceResponse;
};
export interface OblioProduct {
    name: string;
    code?: string;
    description?: string;
    price: number;
    measuringUnit?: string;
    currency?: string;
    exchangeRate?: string;
    vatName?: string;
    vatPercentage?: number;
    vatIncluded?: boolean;
    quantity?: number;
    management?: string;
    productType?: 'Marfa' | 'Materii prime' | 'Materiale consumabile' | 'Semifabricate' | 'Produs finit' | 'Produs rezidual' | 'Produse agricole' | 'Animale si pasari' | 'Ambalaje' | 'Obiecte de inventar' | 'Serviciu';
    nameTranslation?: string;
    measuringUnitTranslation?: string;
    save?: boolean;
}
export interface OblioClient {
    cif?: string;
    name: string;
    rc?: string;
    code?: string;
    address?: string;
    state?: string;
    city?: string;
    country?: string;
    iban?: string;
    bank?: string;
    email?: string;
    phone?: string;
    contact?: string;
    vatPayer?: boolean;
    save?: boolean;
    autocomplete?: boolean;
}
export interface OblioProforma {
    cif: string;
    client: OblioClient;
    issueDate?: string;
    dueDate?: string;
    seriesName?: string;
    disableAutoSeries?: boolean;
    number?: string;
    language?: string;
    precision?: number;
    currency?: string;
    exchangeRate?: string;
    products?: OblioProduct[];
    issuerName?: string;
    issuerId?: string;
    noticeNumber?: string;
    internalNote?: string;
    deputyName?: string;
    deputyIdentityCard?: string;
    deputyAuto?: string;
    selesAgent?: string;
    mentions?: string;
    workStation?: string;
    sendEmail?: boolean;
}
export interface OblioInvoice extends OblioProforma {
    deliveryDate?: string;
    collectDate?: string;
    referenceDocument?: {
        type: 'Factura' | 'Proforma' | 'Aviz';
        seriesName: string;
        number: number;
        refund?: boolean;
    };
    collect?: {
        type: 'Chitanta' | 'Bon fiscal' | 'Alta incasare numerar' | 'Ordin de plata' | 'Mandat postal' | 'Card' | 'CEC' | 'Bilet ordin' | 'Alta incasare banca';
        seriesName?: string;
        documentNumber?: string;
        value?: number;
        issueDate?: string;
        mentions?: string;
    };
    useStock?: boolean;
}
export interface Map {
    [key: string]: any;
}
export interface AccessTokenInterface {
    request_time: number;
    expires_in: number;
    token_type: string;
    access_token: string;
}
export interface AccessTokenHandlerInterface {
    get(): AccessToken;
    set(accessToken: AccessToken): void;
}
