export interface Compte {
    numero_compte: string;
    intitule_compte: string;
    type_compte: string;
    entite: string;
    date_ouverture: string; // Vous pouvez utiliser un objet Date si nécessaire
    solde: number;
}

export interface Service {
    service: string;
    partie: string;
    partEnvoie: string;
    partReception: string;
    tauxTaxe: string;
    pays: string;
}


export interface Plateforme  {
    codePlateforme: number;
    email: string;
    siteWeb: string;
};
