import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ButtonAction, TableauComponent } from 'app/shared/tableau/tableau.component';
import { CONSTANTES } from '../../model/constantes';
import { Compte, Service } from '../plateformes.type';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [AngularMaterialModule, TableauComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
    comptes: Compte[] = [
        {
            numero_compte: '001',
            intitule_compte: 'Compte courant',
            type_compte: 'Courant',
            entite: 'Entité A',
            date_ouverture: '2023-01-15',
            solde: 5000,
        },
        {
            numero_compte: '002',
            intitule_compte: 'Livret A',
            type_compte: 'Épargne',
            entite: 'Entité B',
            date_ouverture: '2022-08-20',
            solde: 10000,
        },
        {
            numero_compte: '003',
            intitule_compte: 'Compte chèques',
            type_compte: 'Courant',
            entite: 'Entité A',
            date_ouverture: '2023-03-10',
            solde: 2500,
        },
        {
            numero_compte: '004',
            intitule_compte: 'PEL',
            type_compte: 'Épargne',
            entite: 'Entité C',
            date_ouverture: '2021-12-05',
            solde: 15000,
        },
        {
            numero_compte: '005',
            intitule_compte: 'Compte professionnel',
            type_compte: 'Courant',
            entite: 'Entité D',
            date_ouverture: '2023-02-28',
            solde: 8000,
        },
        {
            numero_compte: '006',
            intitule_compte: 'Livret de développement durable',
            type_compte: 'Épargne',
            entite: 'Entité B',
            date_ouverture: '2022-11-12',
            solde: 5000,
        },
        {
            numero_compte: '007',
            intitule_compte: 'Compte joint',
            type_compte: 'Courant',
            entite: 'Entité A',
            date_ouverture: '2023-04-01',
            solde: 12000,
        },
        {
            numero_compte: '008',
            intitule_compte: 'PEA',
            type_compte: 'Épargne',
            entite: 'Entité C',
            date_ouverture: '2022-05-25',
            solde: 7000,
        },
        {
            numero_compte: '009',
            intitule_compte: 'Compte à terme',
            type_compte: 'Épargne',
            entite: 'Entité D',
            date_ouverture: '2023-06-18',
            solde: 20000,
        },
        {
            numero_compte: '010',
            intitule_compte: 'Compte salaire',
            type_compte: 'Courant',
            entite: 'Entité B',
            date_ouverture: '2021-09-30',
            solde: 3000,
        },
        {
            numero_compte: '011',
            intitule_compte: 'Livret jeune',
            type_compte: 'Épargne',
            entite: 'Entité A',
            date_ouverture: '2022-04-14',
            solde: 4000,
        },
    ];

    services: Service[] = [
        {
            service: "Transfert d'argent bf",
            partie: 'beneficiaire',
            partEnvoie: '15%',
            partReception: '12%',
            tauxTaxe: '18%',
            pays: 'Senegal',
        },
        {
            service: 'Paiement de factures',
            partie: 'emetteur',
            partEnvoie: '10%',
            partReception: '8%',
            tauxTaxe: '15%',
            pays: "Côte d'Ivoire",
        },
        {
            service: 'Achat de crédits téléphoniques',
            partie: 'beneficiaire',
            partEnvoie: '20%',
            partReception: '18%',
            tauxTaxe: '12%',
            pays: 'Mali',
        },
        {
            service: "Transfert d'argent bf",
            partie: 'emetteur',
            partEnvoie: '13%',
            partReception: '10%',
            tauxTaxe: '20%',
            pays: 'Guinée',
        },
        {
            service: 'Paiement de factures',
            partie: 'beneficiaire',
            partEnvoie: '18%',
            partReception: '15%',
            tauxTaxe: '16%',
            pays: 'Burkina Faso',
        },
        {
            service: 'Achat de crédits téléphoniques',
            partie: 'emetteur',
            partEnvoie: '17%',
            partReception: '13%',
            tauxTaxe: '14%',
            pays: 'Niger',
        },
        {
            service: "Transfert d'argent bf",
            partie: 'beneficiaire',
            partEnvoie: '22%',
            partReception: '19%',
            tauxTaxe: '10%',
            pays: 'Togo',
        },
        {
            service: 'Paiement de factures',
            partie: 'emetteur',
            partEnvoie: '12%',
            partReception: '9%',
            tauxTaxe: '17%',
            pays: 'Bénin',
        },
        {
            service: 'Achat de crédits téléphoniques',
            partie: 'beneficiaire',
            partEnvoie: '21%',
            partReception: '17%',
            tauxTaxe: '11%',
            pays: 'Ghana',
        },
        {
            service: "Transfert d'argent bf",
            partie: 'emetteur',
            partEnvoie: '16%',
            partReception: '14%',
            tauxTaxe: '13%',
            pays: 'Sénégal',
        },
        {
            service: 'Paiement de factures',
            partie: 'beneficiaire',
            partEnvoie: '14%',
            partReception: '12%',
            tauxTaxe: '18%',
            pays: "Côte d'Ivoire",
        },
        {
            service: 'Achat de crédits téléphoniques',
            partie: 'emetteur',
            partEnvoie: '19%',
            partReception: '15%',
            tauxTaxe: '15%',
            pays: 'Mali',
        }

    ];

    horizontalStepperForm: UntypedFormGroup;
    verticalStepperForm: UntypedFormGroup;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    informations: any;
    displayedColumns: any;
    searchList: any;
    codeEnvoye: number; //code envoye par notre menu
    hasList: boolean;
    hasAdd: boolean;
    hasUpdate: boolean;
    hasDelete: boolean;
    hasDetail: boolean;
    length = 100;
    searchForm: UntypedFormGroup;
    dialogRef: any;
    dataSource: MatTableDataSource<any>;
    datas: any = [];
    deleteUser: boolean = false;
    currentIndex;
    loadData: boolean = false;
    exporter: boolean = false;
    isCollapsed: boolean = false;
    isSearch2: boolean = false;
    isSearch: boolean = false;
    rechercher = '';
    showLoader = 'isNotShow';
    message = '';
    formules: any = [];
    config: any;
    isLoading: boolean = false;
    totalItems = 0;
    nbPage: number;
    pageSizeOptions = [5, 10, 25, 100, 500, 1000];
    pageIndex: number = 0;
    pageSize: number = 10;
    lienBrute = '';
    constantes = CONSTANTES;
    listPrivileges = [];
    userConnecter;
    offset: number = 0;
    title: string = 'Plateforme';
    url: string = 'plateforme';
    img;
    image;
    headersComptes: any = [];
    headersCommissions: any = [];
    btnActions: any = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}
    ngOnInit(): void {
        // Vertical stepper form
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                code_plateforme: ['001', [Validators.required]],
                site_web: ['sun.com', Validators.required],
                email: ['salioufereya19@gmail.com', Validators.required],
                labelle: ['plateforme', Validators.required],
            }),
            step2: this._formBuilder.group({
                auteur: ['', Validators.required],
                modifie_le: ['', Validators.required],
                date_creation: ['', Validators.required],
                modifie_par: ['', Validators.required],
            }),
            // step3: this._formBuilder.group({
            //     byEmail: this._formBuilder.group({
            //         companyNews: [true],
            //         featuredProducts: [false],
            //         messages: [true],
            //     }),
            //     pushNotifications: ['everything', Validators.required],
            // }),
        });

        this.headersComptes = this.createHeader();
        this.headersCommissions = this.createHeaderCommissions();
        this.btnActions = this.createActions();
    }

    createHeader() {
        return [
            { th: 'Numero compte', td: 'numero_compte' },
            { th: 'Intitulé compte', td: 'intitule_compte' },
            { th: 'Type compte', td: 'type_compte' },
            { th: 'Entité', td: 'entite' },
            { th: "Date d'ouverture", td: 'date_ouverture' },
            { th: 'Solde', td: 'solde' },

            // { th: 'Email', td: 'email' },
            // { th: 'Date de création', td: 'dateCreated', type: 'd' },
        ];
    }

    createHeaderCommissions() {
        return [
            { th: 'service', td: 'service' },
            { th: 'partie', td: 'partie' },
            { th: 'partEnvoie', td: 'partEnvoie' },
            { th: 'partReception', td: 'partReception' },
            { th: "tauxTaxe", td: 'tauxTaxe' },
            { th: 'pays', td: 'pays' },

            // { th: 'Email', td: 'email' },
            // { th: 'Date de création', td: 'dateCreated', type: 'd' },
        ];
    }

    createActions(): ButtonAction[] {
        return [
            {
                icon: 'info',
                couleur: 'text-blue-400',
                size: 'icon-size-4',
                title: 'Historique',
                isDisabled: false,
                action: (element?) => this.updateItems(element),
            },
        ];
    }
    supprimerItems(id: any, element: any) {
        throw new Error('Method not implemented.');
    }
    details(element: any) {
        this._router.navigate(['admin/plateforme/list']);
    }
    updateItems(information) {}
    pageChanged(event) {
        this.datas = [];
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.offset = this.pageIndex * this.pageSize;
        //this.getList();
    }
}
