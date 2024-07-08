export interface IPrivilege {
    id?: number;
    libelle: string;
    niveau: number;
    code: string;
    uri: string;
    lien: string;
    icon: string;
    isMenu: boolean;
    parent_id: number;
}

export class Privileges implements IPrivilege {
    libelle: string;
    niveau: number;
    code: string;
    uri: string;
    lien: string;
    icon: string;
    isMenu: boolean;
    parent_id: number;

    constructor(public id?: number) {
    }
}
