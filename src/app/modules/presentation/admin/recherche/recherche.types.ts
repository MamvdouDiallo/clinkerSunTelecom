export interface Utilisateur
{
    id: number;
    prenom: string;
    nom: string;
    telephone: number;
    email: string;
    role: number;
    partenaire: number;
}
export interface SAQModel
{
    title: string;
      titre: string;
      titleFile: string;
      sousTitle: string;
      url: string;
      reponse: string;
      typeEntity: string;
      entete: string;
      addButton: boolean;
      code: string;
      exportFile: Array<any>;
      tabHead:  Array<any>;
      tabFileHead: Array<any>;
      fields: Array<any>;
      searchFields: Array<SearchField>;
      tabBody:  Array<string>;
      tabFileBody: Array<string>;
      action: Array<any>;
      taillemodal: Array<any>;
}
export interface SearchField{
    name: string;
    field: string;
    type: string;
    value: string;
}
export interface Privilege
{
    id: number;
    code: string;
    libelle?: string;
    niveau: number;
    icon?: string;
    lien?: string;
    parent_id?: number ;
    isMenu?: boolean ;
}
export interface Parametrages
{
    id: number;
    partenaire: number;
    adresse?: string;
    telephone: number;
    logo?: string;
    couleur?: string;
    nomPrenom?: string ;
    isMenu?: boolean ;
}


export interface ResponseBack{
    code:number,
    message:string,
    data:any
}
