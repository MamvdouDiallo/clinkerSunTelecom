import { Component, OnInit, ViewChild } from '@angular/core';
import {
    ButtonAction,
    TableauComponent,
} from 'app/shared/tableau/tableau.component';
import { CONSTANTES } from '../../model/constantes';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'app/core/core.service';
import { SnackBarService } from 'app/shared/snackBar.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Operateur } from '../operateur.type';
import { AddOperateurComponent } from '../add/add.component';
import { DetailComponent } from './detail/detail.component';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableauComponent],
    providers: [DatePipe],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
    headers: { th: string; td: string }[];
    btnActions: ButtonAction[];
    pageChanged($event: any) {
        throw new Error('Method not implemented.');
    }
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

    constructor(
        private _matDialog: MatDialog,
        private coreService: CoreService,
        // private changeDetectorRefs: ChangeDetectorRef,
        private snackbar: SnackBarService,
        //  private exportService: ExportService,
        private datePipe: DatePipe,
        private _router: Router,
        private route: ActivatedRoute,
        private fb: UntypedFormBuilder
    ) {}

    data: Operateur[] = [
        {
            code: 1,
            email: 'example1@example.com',
            site_web: 'https://www.example1.com',
            adresse: '123 Example St, City, Country',
            code_devise_alpha: 'USD',
            type: 'Type A',
        },
        {
            code: 2,
            email: 'example2@example.com',
            site_web: 'https://www.example2.com',
            adresse: '456 Example Ave, City, Country',
            code_devise_alpha: 'EUR',
            type: 'Type B',
        },
        {
            code: 3,
            email: 'example3@example.com',
            site_web: 'https://www.example3.com',
            adresse: '789 Example Blvd, City, Country',
            code_devise_alpha: 'GBP',
            type: 'Type C',
        },
        {
            code: 4,
            email: 'example4@example.com',
            site_web: 'https://www.example4.com',
            adresse: '101 Example Dr, City, Country',
            code_devise_alpha: 'JPY',
            type: 'Type D',
        },
        {
            code: 5,
            email: 'example5@example.com',
            site_web: 'https://www.example5.com',
            adresse: '102 Example Pl, City, Country',
            code_devise_alpha: 'AUD',
            type: 'Type E',
        },
        {
            code: 6,
            email: 'example6@example.com',
            site_web: 'https://www.example6.com',
            adresse: '103 Example Ln, City, Country',
            code_devise_alpha: 'CAD',
            type: 'Type F',
        },
        {
            code: 7,
            email: 'example7@example.com',
            site_web: 'https://www.example7.com',
            adresse: '104 Example Ct, City, Country',
            code_devise_alpha: 'CHF',
            type: 'Type G',
        },
        {
            code: 8,
            email: 'example8@example.com',
            site_web: 'https://www.example8.com',
            adresse: '105 Example Rd, City, Country',
            code_devise_alpha: 'NZD',
            type: 'Type H',
        },
    ];

    ngOnInit(): void {
        this.headers = this.createHeader();
        this.btnActions = this.createActions();
    }

    createHeader() {
        return [
            { th: 'Code', td: 'code' },
            { th: 'Email', td: 'email' },
            { th: 'Site Web', td: 'site_web' },
            { th: 'Adresse', td: 'adresse' },
            { th: 'Code devise alpha', td: 'code_devise_alpha' },
            { th: 'Type', td: 'type' },
        ];
    }

    createActions(): ButtonAction[] {
        return [
            {
                icon: 'edit',
                couleur: 'text-green-400',
                size: 'icon-size-4',
                title: 'Modifier',
                isDisabled: false,
                action: (element?) => this.updateItems(element),
            },
            {
                icon: 'delete_outline',
                couleur: 'text-red-400',
                size: 'icon-size-4',
                title: 'Supprimer',
                isDisabled: false,
                action: (element?) => this.supprimer(element.id, element),
            },
            {
                icon: 'list',
                couleur: 'text-blue-600',
                size: 'icon-size-4',
                title: 'Détail de la personne morale',
                isDisabled: false,
                action: (element?) => this.details(element),
            },
        ];
    }


    updateItems(information) {
       this.snackbar.openModal( AddOperateurComponent, '50rem', 'edit', '', information, () => {
           //this.getList();
        });
        console.log('====================================');
        console.log(information);
        console.log('====================================');
    }

    modifier(element: any) {
        throw new Error('Method not implemented.');
    }

    details(el) {
        this.dialogRef = this._matDialog.open(DetailComponent, {
            panelClass: 'event-form-dialog',
            disableClose: true,
            width: '55rem',
            height: 'auto',
            data: {
                item: el
            }
        });
    }

    supprimer(utilisateur, id) {
        this.snackbar
            .showConfirmation(
                'Voulez-vous vraiment supprimer cette opérateur?'
            )
            .then((result) => {
                if (result['value'] == true) {
                    //     this.currentIndex = utilisateur;
                    //    // this.deleteIndex = true;
                    //     this.utilisateurService.deleteUtilisateurs(id).subscribe((resp) => {
                    //         this.snackbar.openSnackBar('Utilisateur supprimé avec succès !', 'OK', ['mycssSnackbarGreen']);
                    //         this.utilisateurService.getUtilisateurs().subscribe((resp: any) => {
                    //             this.dataSource = new MatTableDataSource(resp[this.constantes.RESPONSE_DATA]);
                    //             this._changeDetectorRef.detectChanges();
                    //             this.deleteIndex = false;
                    //         });
                    //     }, (error) => {
                    //         this.deleteIndex = false;
                    //         this.snackbar.showErrors(error);
                    //     });
                }
            });
    }



}
