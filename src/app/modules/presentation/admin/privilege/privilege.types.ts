export interface Privilege
{
    id: number;
    libelle: string;
    niveau: number;
    code: string;
    lien: string;
    icon: string;
    isMenu: boolean;
    parent_id: number;
    createdAt: Date;
}
