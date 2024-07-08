// cette fonction permet d'ajouter de modifier de supprimer et de lister ces composants
//import {environment} from '../../../../../environments/environment';

import { list } from 'postcss';

export const models = {
    'admin/operateurs': {
        title: 'Opérateur',
        titre: "Ajout 'un opérateur",
        titleFile: 'Liste des événements communication',
        sousTitle: 'un événement communication',
        // url: 'evenement-communication',
        url: 'operateur',
        reponse: 'événement communication',
        typeEntity: 'cet événement communication', //
        entete: 'un opérateur',
        addButton: false,
        code: '07410',
        filterType: 'local',
        exportFile: ['excel', 'pdf'],
        tabHead: [
            'Code opérateur',
            'Email',
            'Site web',
            'Adresse',
            'Code Devise Alpha',
        ],
        tabFileHead: [
            'Code opérateur',
            'Email',
            'Site web',
            'Adresse',
            'Code Devise Alpha',
        ],
        fields: [
            {
                fxFlex: '50',
                label: 'Code',
                name: 'code',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Libelle',
                name: 'libelle',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Activer',
                name: 'isActive',
                type: 'matSlideToggle',
                isRequired: false,
                validations: [],
            },
        ],
        searchFields: [],

        tabBody: ['code', 'email', 'site_web', 'adresse', 'code_devise_alpha'],
        tabFileBody: [
            'code',
            'email',
            'site_web',
            'adresse',
            'code_devise_alpha',
        ],
        action: [
            { name: 'modifier', icon: 'edit', color: 'primary' },
            { name: 'supprimer', icon: 'delete', color: 'red' },
            { name: 'detail', icon: 'eyes', color: 'green' },
        ],
        taillemodal: [{ width: '50rem', height: 'auto' }],
    },
    'admin/caisses': {
        title: 'Caisse',
        titre: "Ajout 'une caisse",
        titleFile: 'Liste des caisses ',
        sousTitle: 'une caisse',
        //url: 'caisse',
        url: 'caisse',
        reponse: 'caisses',
        typeEntity: 'cette caisse', //
        entete: 'une caisse',
        addButton: true,
        code: '07410',
        filterType: 'local',
        exportFile: ['excel', 'pdf'],
        tabHead: ['Code', 'Intitulé', 'Agences rattachés'],
        //pour le telechargelment
        tabFileHead: ['code', 'intitule', 'Agences rattachés'],
        //chap formulaire
        fields: [
            {
                fxFlex: '50',
                label: 'Intitulé',
                name: 'description',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Agences rattachés',
                name: 'agence',
                type: 'select',
                list: [],
                url: 'agence',
                displayName: 'description',
                displayValue: 'id',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
        ],
        //champ de recherche
        searchFields: [
            { name: 'Code', field: 'code', type: 'text', value: '' },
            { name: 'Agence', field: 'agence', type: 'text', value: '' },
            { name: 'Intitulé', field: 'description', type: 'text', value: '' },
        ],
        //les données backend
        tabBody: ['code', 'description', 'agence'],
        //files a expter
        tabFileBody: ['code', 'description', 'agence'],
        action: [
            { name: 'modifier', icon: 'edit', color: 'primary' },
            { name: 'supprimer', icon: 'delete', color: 'red' },
            { name: 'detail', icon: 'eyes', color: 'green' },
        ],
        taillemodal: [{ width: '40rem', height: 'auto' }],
    },

    'admin/distributeurs': {
        title: 'Distributeur',
        titre: 'Ajout distributeur',
        titleFile: 'Liste des distributeurs',
        sousTitle: 'un distributeur',
        url: 'distributeur',
        reponse: 'distributeur',
        typeEntity: 'ce distributeur',
        entete: 'un  distributeur',
        addButton: true,
        code: '07410',
        filterType: 'local',
        exportFile: ['excel', 'pdf'],
        tabHead: ['Code', 'Intitulé', 'Réseau rattaché', 'Adresse'],
        tabFileHead: ['Code', 'Intitulé', 'Réseau rattaché', 'Adresse'],
        fields: [
            {
                fxFlex: '50',
                label: 'Intitulé',
                name: 'description',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Adresse',
                name: 'adresse',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '100',
                label: 'Réseau rattaché',
                name: 'reseau',
                type: 'select',
                displayName: 'description',
                displayValue: 'id',
                isRequired: true,
                list: [],
                url: 'reseau',
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },

            {
                fxFlex: '50',
                label: 'Découverte',
                name: 'decouvert',
                type: 'number',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Plafond',
                name: 'plafond',
                type: 'number',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '100',
                label: 'Contact Principal',
                name: 'contactPrincipal',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },

            {
                fxFlex: '50',
                label: 'Email Contact Principal',
                name: 'emailContactPrincipal',
                type: 'email',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                    {
                        name: 'email',
                        value: 'Validators.pattern',
                        message: "L'email n'est pas valide",
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Téléphone Contact Principal',
                name: 'telephoneContactPrincipal',
                type: 'tel',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
        ],
        searchFields: [
            { name: 'Intitulé', field: 'description', type: 'text', value: '' },
            {
                name: 'Réseau rattaché',
                field: 'reseau',
                type: 'text',
                value: '',
            },
            {
                name: 'Adresse',
                field: 'adresse',
                type: 'text',
                value: '',
            },
        ],
        tabBody: ['code', 'description', 'reseau', 'adresse'],
        tabFileBody: ['code', 'description', 'reseau', 'adresse'],
        action: [
            { name: 'modifier', icon: 'edit', color: 'primary' },
            { name: 'supprimer', icon: 'delete', color: 'red' },
            { name: 'detail', icon: 'eyes', color: 'green' },
        ],
        taillemodal: [{ width: '40rem', height: 'auto' }],
    },

    //agences
    'admin/agences': {
        title: 'Agence',
        titre: "Ajout 'une agence",
        titleFile: 'Liste des gens',
        sousTitle: 'une agence',
        url: 'agence',
        reponse: 'agence',
        typeEntity: 'cette agence', //
        entete: 'une agence',
        addButton: true,
        code: '07410',
        filterType: 'local',
        exportFile: ['excel', 'pdf'],
        tabHead: [
            'Code',
            'Description',
            'Adresse',
            'Distributeur',
            'Ville',
            'Contact Principal',
            'Téléphone Contact Principal',
        ],
        tabFileHead: [
            'Code',
            'Description',
            'Adresse',
            'Distributeur',
            'Ville',
            'Contact Principal',
            'Téléphone Contact Principal',
        ],
        fields: [
            {
                fxFlex: '50',
                label: 'Distributeur',
                name: 'distributeur',
                isRequired: true,
                type: 'select',
                displayName: 'description',
                displayValue: 'id',
                value: '',
                list: [],
                url: 'distributeur',
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Description',
                name: 'description',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },

            {
                fxFlex: '50',
                label: 'Adresse',
                name: 'adresse',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Téléphone',
                name: 'telephone',
                type: 'tel',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Réference Externe',
                name: 'referenceExterne',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Ville',
                name: 'ville',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '100',
                label: 'Contact Principal',
                name: 'contactPrincipal',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Téléphone Contact Principal',
                name: 'telephoneContactPrincipal',
                type: 'tel',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Email Contact Principal',
                name: 'emailContactPrincipal',
                type: 'email',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Decouverte',
                name: 'decouvert',
                type: 'number',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Plafond',
                name: 'plafond',
                type: 'number',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
        ],
        searchFields: [
            {
                name: 'Description',
                field: 'description',
                type: 'text',
                value: '',
            },
            {
                name: 'telephoneContactPrincipal',
                field: 'telephoneContactPrincipal',
                type: 'tel',
                value: '',
            },
            { name: 'Ville', field: 'ville', type: 'text', value: '' },
            { name: 'Adresse', field: 'adresse', type: 'text', value: '' },
            {
                name: 'Distributeur',
                field: 'distributeur',
                type: 'text',
                value: '',
            },
            {
                name: 'contactPrincipal',
                field: 'contactPrincipal',
                type: 'text',
                value: '',
            },
        ],
        tabBody: [
            'code',
            'description',
            'adresse',
            'distributeur',
            'ville',
            'contactPrincipal',
            'telephoneContactPrincipal',
        ],
        tabFileBody: [
            'code',
            'description',
            'adresse',
            'distributeur',
            'ville',
            'contactPrincipal',
            'telephoneContactPrincipal',
        ],
        action: [
            { name: 'modifier', icon: 'edit', color: 'primary' },
            { name: 'supprimer', icon: 'delete', color: 'red' },
            { name: 'detail', icon: 'eyes', color: 'green' },
        ],
        taillemodal: [{ width: '45rem', height: 'auto' }],
    },
    //plateformes
    'admin/plateformes': {
        title: 'Plateforme',
        titre: 'Ajout plateforme',
        titleFile: 'Liste des plateformes',
        sousTitle: 'une platefome',
        url: 'plateforme',
        reponse: 'palteforme',
        typeEntity: 'cette plateforme', //
        entete: 'une plateforme',
        addButton: false,
        //code: '07410',
        filterType: 'local',
        exportFile: ['excel', 'pdf'],
        tabHead: ['Code Plateforme', 'Email', 'Site Web'],
        tabFileHead: ['Code Plateforme', 'Email', 'Site Web', 'Labelle'],
        fields: [
            {
                fxFlex: '100',
                label: 'Label de la plateforme',
                name: 'descriptionEntite',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Email',
                name: 'email',
                type: 'email',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Site web',
                name: 'siteWeb',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
        ],
        searchFields: [
            { name: 'Labelle', field: 'labelle', type: 'text', value: '' },
            { name: 'Email', field: 'email', type: 'text', value: '' },
            { name: 'Site web', field: 'site_web', type: 'text', value: '' },
        ],
        tabBody: ['code', 'email', 'siteWeb'],
        tabFileBody: ['code', 'siteWeb', 'email'],
        action: [
            { name: 'modifier', icon: 'edit', color: 'primary' },
            { name: 'supprimer', icon: 'delete', color: 'red' },
            { name: 'detail', icon: 'eyes', color: 'green' },
        ],
        taillemodal: [{ width: '40rem', height: 'auto' }],
    },

    //reseaux
    'admin/reseaux': {
        title: 'Réseaux',
        titre: 'Ajout ',
        titleFile: 'Liste des réseaux',
        sousTitle: 'un résau',
        url: 'reseau',
        reponse: 'reseau',
        typeEntity: 'ce reseau', //
        entete: 'un réseau',
        addButton: true,
        code: '07410',
        filterType: 'local',
        exportFile: ['excel', 'pdf'],
        tabHead: ['Code', 'Intitulé', 'Pays', 'Devise', 'Adresse'],
        tabFileHead: ['Code', 'Intitulé', 'Pays', 'Devise', 'Adresse'],
        fields: [
            {
                fxFlex: '50',
                label: 'Intitulé',
                name: 'intitule',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Adresse',
                name: 'adresse',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '100',
                label: 'Pays',
                name: 'pays',
                type: 'select',
                list: [],
                url: 'pays',
                displayName: 'libellePays',
                displayValue: 'id',
                value: '',
                isRequired: true,
                //  list: [],
                // url: 'type-attribut',
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Prise en compte des horaires:',
                name: 'prise_en_compte_des_horaires:',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '100',
                label: 'Préfix réseaux:',
                name: 'prefix:',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },

            {
                fxFlex: '50',
                label: 'Decouverte',
                name: 'decouvert',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Plafond:',
                name: 'plafond:',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
        ],
        searchFields: [
            { name: 'Code', field: 'code', type: 'text', value: '' },
            { name: 'Intitulé', field: 'description', type: 'text', value: '' },
            { name: 'Dévise', field: 'codeDeviseAlpha', type: 'text', value: '' },
        ],
        tabBody: [
            'code',
            'description',
            'paysOperation',
            'codeDeviseAlpha',
            'adresse',
        ],
        tabFileBody: [
            'code',
            'description',
            'paysOperation',
            'codeDeviseAlpha',
            'adresse',
        ],
        action: [
            { name: 'modifier', icon: 'edit', color: 'primary' },
            { name: 'supprimer', icon: 'delete', color: 'red' },
            { name: 'detail', icon: 'eyes', color: 'green' },
        ],
        // taillemodal: [{ width: '40rem', height: 'auto' }],
        taillemodal: [{ width: '50rem', height: '27rem' }],
    },

    //terminaux

    'admin/terminaux': {
        title: 'Términaux',
        titre: 'Ajout ',
        titleFile: 'Liste des terminaux',
        sousTitle: 'un terminal',
        url: 'http://localhost:3000/terminaux',
        reponse: 'terminal',
        typeEntity: 'ce termianl', //
        entete: 'un réseau',
        addButton: true,
        code: '07410',
        filterType: 'local',
        exportFile: ['excel', 'pdf'],
        tabHead: [
            'Code',
            'Intitulé',
            'Agence',
            'Statut',
            'Derniére connexion',
            'Dernier Utilisateur',
        ],
        tabFileHead: [
            'Code',
            'Intitulé',
            'Agence',
            'Statut',
            'Derniére connexion',
            'Dernier Utilisateur',
        ],
        fields: [
            {
                fxFlex: '50',
                label: 'Intitulé',
                name: 'intitule',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Réference  externe',
                name: 'reference_externe',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'N° Tél SIM1',
                name: 'sim1',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'N° Tél SIM2',
                name: 'sim2:',
                type: 'text',
                isRequired: true,
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
            {
                fxFlex: '50',
                label: 'Entité de rattachement',
                name: 'entite:',
                type: 'select',
                displayName: 'name',
                displayValue: 'value',
                value: '',
                isRequired: true,
                list: [
                    { name: 'oui', value: 1 },
                    { name: 'non', value: 0 },
                ],
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },

            {
                fxFlex: '50',
                label: 'Entité de rattachementA',
                name: 'entiteA',
                type: 'select',
                displayName: 'name',
                displayValue: 'value',
                value: '',
                isRequired: true,
                list: [
                    { name: 'La finao back office', value: 'back office' },
                    { name: 'La finao back ', value: 'back' },
                ],
                validations: [
                    {
                        name: 'required',
                        value: 'Validators.required',
                        message: 'Ce champ est obligatoire',
                    },
                ],
            },
        ],
        searchFields: [],
        tabBody: [
            'code',
            'intitule',
            'agence',
            'statut',
            'derniere_connexion',
            'dernier_utilisateur',
        ],
        tabFileBody: [
            'code',
            'intitule',
            'agence',
            'statut',
            'derniere_connexion',
            'dernier_utilisateur',
        ],
        action: [
            { name: 'modifier', icon: 'edit', color: 'primary' },
            { name: 'supprimer', icon: 'delete', color: 'red' },
            { name: 'detail', icon: 'eyes', color: 'green' },
        ],
        // taillemodal: [{ width: '40rem', height: 'auto' }],
        taillemodal: [{ width: '50rem', height: '27rem' }],
    },
};
