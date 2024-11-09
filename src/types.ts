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

  /**
   * Codul produsului
   */
  code?: string;
  description?: string;
  price: number;

  /**
   * Unitatea de masura a produsului, valoarea implicita este "buc"
   */
  measuringUnit?: string;

  currency?: string;

  /**
   * Rata de schimb a monezii in cazul in care aceasta este diferita de moneda documentului
   */
  exchangeRate?: string;

  /**
   * Numele cotei de TVA (se gaseste in nomenclator cote TVA)
   * default 'Normala
   */
  vatName?: string;

  /**
   * Procentul cotei de TVA (se gaseste in nomenclator cote TVA)
   */
  vatPercentage?: number;

  /**
   * TVA-ul este inclus in pretul produsului, ia valorile 0 sau 1, valoarea implicita este 1
   */
  vatIncluded?: boolean;

  /**
   * Cantitatea, valoare implicita este 1
   */
  quantity?: number;

  /**
   * Numele gestiunii din care face parte produsul. Este valabil doar dupa activarea stocurilor pentru produse stocabile (nu este valabil pentru servicii)
   */
  management?: string;

  /**
   *  Tip produs. Trebuie sa fie unul din "Marfa", "Materii prime", "Materiale consumabile", "Semifabricate", "Produs finit", "Produs rezidual",
   *  "Produse agricole", "Animale si pasari", "Ambalaje", "Obiecte de inventar", "Serviciu".
   *  Este valabil doar dupa activarea stocurilor
   */
  productType?:
    | 'Marfa'
    | 'Materii prime'
    | 'Materiale consumabile'
    | 'Semifabricate'
    | 'Produs finit'
    | 'Produs rezidual'
    | 'Produse agricole'
    | 'Animale si pasari'
    | 'Ambalaje'
    | 'Obiecte de inventar'
    | 'Serviciu';
  /**
   * Numele produsului tradus (daca este cazul pentru facturile in alte limbi decat romana)
   */
  nameTranslation?: string;

  /**
   * Unitatea de masura tradusa (daca este cazul pentru facturile in alte limbi decat romana)
   */
  measuringUnitTranslation?: string;

  /**
   * Salveaza pretul de lista. Poate sa fie 0 sau 1.
   * Valoarea implicita este 1
   */
  save?: boolean;
}

export interface OblioClient {
  /**
   * CIF-ul firmei sau CNP-ul clientului
   */
  cif?: string;

  /**
   * Numele (pentru persoanelor fizice) sau a numele firmei (pentru persoane juridice)
   */
  name: string;

  /**
   * Numar Registru Comert
   */
  rc?: string;

  /**
   * Cod client
   */
  code?: string;

  address?: string;

  /**
   * State or County
   */
  state?: string;

  /**
   * City or Locality
   */
  city?: string;
  country?: string;
  iban?: string;
  bank?: string;
  email?: string;
  phone?: string;

  /**
   * Persoana de contact
   */
  contact?: string;

  /**
   * Platitor de TVA, ia valorile 0 sau 1
   */
  vatPayer?: boolean;

  /**
   * Sa schimbe sau nu datele clientului, ia valorile 0 sau 1.
   * Valoarea implicita este 0
   */
  save?: boolean;

  /**
   * Daca este completat parametrul "cif" cu o firma din Romania, datele se preiau automat, ia valorile 0 sau 1.
   * Valoarea implicita este 0
   */
  autocomplete?: boolean;
}

export interface OblioProforma {
  /**
   * CIF-ul firmei de unde se emit facturi. Il gasiti la Oblio.eu > Setari > Date firma
   */
  cif: string;

  /**
   * 	Necesita anumiti parametri. Acestia se gasesc in zona "Parametri client"
   */
  client: OblioClient;

  /**
   * Data emiterii in format AAAA-LL-ZZ, valoare implicita este ziua curenta
   */
  issueDate?: string;

  /**
   * Data scadentei in format AAAA-LL-ZZ
   */
  dueDate?: string;

  /**
   * Nume serie document (se gaseste in nomenclator serii documente)
   * Poate lipsi daca disableAutoSeries = true
   */
  seriesName?: string;

  /**
   * Dezactivare incrementare automata a numarului documentului
   * Poate fi 0 sau 1
   */
  disableAutoSeries?: boolean;

  /**
   * Numarul documentului generat de propriul sistem
   * Se utilizeaza doar impreuna cu proprietatea disableAutoSeries
   */
  number?: string;

  /**
   * Codul de limba in care se emite factura (se gasesc limbile disponibile in nomenclator), valoarea implicita este "RO"
   */
  language?: string;

  /**
   * 	Precizia documentului. Trebuie sa fie un numar intreg cu valoarea intre 2 si 4, valoarea implicita este 2
   */
  precision?: number;

  /**
   * Moneda documentului, valoarea implicita este "RON"
   */
  currency?: string;

  /**
   * Rata de schimb in cazul documentelor in valuta, valoare implicita este cursul setat in setarile companiei
   */
  exchangeRate?: string;

  /**
   * 	Este un tablou cu produse. Parametrii pentru produse se gasesc in zona "Parametri produs"
   */
  products?: OblioProduct[];

  /**
   * Intocmit de
   */
  issuerName?: string;

  /**
   * 	CNP-ul celui care a intocmit documentul
   */
  issuerId?: string;

  /**
   * 	Nr. aviz insotire
   */
  noticeNumber?: string;

  /**
   * Nota interna (nu va fi vizibila pentru client)
   */
  internalNote?: string;

  /**
   * Delegat
   */
  deputyName?: string;

  /**
   * Carte Identitate delegat
   */
  deputyIdentityCard?: string;

  /**
   * 	Auto delegat
   */
  deputyAuto?: string;

  /**
   * Agent vanzari
   */
  selesAgent?: string;

  /**
   * Mentiuni
   */
  mentions?: string;

  /**
   * Punct de lucru. Este valabil doar dupa activarea stocurilor, valoarea implicita este "Sediu"
   */
  workStation?: string;

  /**
   * Daca are valoarea 1 se va trimite email-ul de la Setari > E-mail-uri alarma > Document prin email
   */
  sendEmail?: boolean;
}

export interface OblioInvoice extends OblioProforma {
  /**
   * Data livrarii in format AAAA-LL-ZZ
   */
  deliveryDate?: string;

  /**
   * Data incasarii in format AAAA-LL-ZZ
   */
  collectDate?: string;

  /**
   * Document de referinta in cazul generarii de facturi pe baza de proforma sau de aviz.
   */
  referenceDocument?: {
    /**
     * Tipul documentului de referinta (Factura, Proforma sau Aviz)
     */
    type: 'Factura' | 'Proforma' | 'Aviz';

    /**
     * Numele seriei documentului de referinta
     */
    seriesName: string;

    /**
     * Numarul seriei documentului de referinta
     */
    number: number;

    /**
     * Sterge incasarea asociata cu factura stornata pentru "type" = "Factura". Poate fi 0 sau 1
     */
    refund?: boolean;
  };

  /**
   * Incasare document.
   */
  collect?: {
    /**
     * Tipul de document cu care se face incasarea. Poate fi "Chitanta", "Bon fiscal", "Alta incasare numerar", "Ordin de plata", "Mandat postal", "Card", "CEC", "Bilet ordin", "Alta incasare banca"
     */
    type:
      | 'Chitanta'
      | 'Bon fiscal'
      | 'Alta incasare numerar'
      | 'Ordin de plata'
      | 'Mandat postal'
      | 'Card'
      | 'CEC'
      | 'Bilet ordin'
      | 'Alta incasare banca';

    /**
     * Numele seriei chitantei. Trebuie definita in cazul in care incasarea se face prin chitanta
     */
    seriesName?: string;

    /**
     * Numarul documentului de incasare. Trebuie definit in cazul in care incasarea nu se face prin chitanta
     */
    documentNumber?: string;

    /**
     * Valoarea incasata, valoarea implicita este totalul facturii care urmeaza sa fie incasata
     */
    value?: number;

    /**
     * Data emiterii in format AAAA-LL-ZZ, valoare implicita este ziua curenta (valabil pentru incasare factura)
     */
    issueDate?: string;

    /**
     * Mentiuni
     */
    mentions?: string;
  };

  /**
   * Descarcare pe gestiune (in cazul in care este activat stocul).
   * Poate fi 0 sau 1
   */
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
