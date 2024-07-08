import { Component, OnInit, ViewChild } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';
import { Compte, Plateforme, Service } from '../plateformes.type';
import { CONSTANTES } from '../../model/constantes';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {
    ButtonAction,
    TableauComponent,
} from 'app/shared/tableau/tableau.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'app/core/core.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { EnteteComponent } from 'app/shared/entete/entete.component';
import { AjoutComponent } from '../ajout/ajout.component';
import { SnackBarService } from 'app/shared/snackBar.service';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        AngularMaterialModule,
        TableauComponent,
        ListComponent,
        EnteteComponent,
        DatePipe,
        CommonModule,
        MatIcon,
        MatIconModule,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
    // Créer un tableau d'objets du type défini
    tableauxObjets: Plateforme[] = [
        {
            codePlateforme: 1,
            email: 'user1@example.com',
            siteWeb: 'https://www.site1.com',
        },
        {
            codePlateforme: 2,
            email: 'user2@example.com',
            siteWeb: 'https://www.site2.com',
        },
        {
            codePlateforme: 3,
            email: 'user3@example.com',
            siteWeb: 'https://www.site3.com',
        },
        {
            codePlateforme: 4,
            email: 'user4@example.com',
            siteWeb: 'https://www.site4.com',
        },
        {
            codePlateforme: 5,
            email: 'user5@example.com',
            siteWeb: 'https://www.site5.com',
        },
        {
            codePlateforme: 6,
            email: 'user6@example.com',
            siteWeb: 'https://www.site6.com',
        },
        {
            codePlateforme: 7,
            email: 'user7@example.com',
            siteWeb: 'https://www.site7.com',
        },
        {
            codePlateforme: 8,
            email: 'user8@example.com',
            siteWeb: 'https://www.site8.com',
        },
    ];

    headers: any = [];
    btnActions: any = [];
    test: boolean = false;
    rechercherGlobal($event: any) {
        throw new Error('Method not implemented.');
    }
    exportAs($event: any) {
        throw new Error('Method not implemented.');
    }
    addItems() {
        throw new Error('Method not implemented.');
    }
    filterList() {
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

    ngOnInit(): void {
        this.headers = this.createHeader();
        this.btnActions = this.createActions();
    }

    createHeader() {
        return [
            { th: 'codePlateforme', td: 'codePlateforme' },
            { th: 'email', td: 'email' },
            { th: 'siteWeb', td: 'siteWeb' },
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
                action: (element?) => this.modifier(element),
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
    //cette fonction permet de supprimer un utilisateur
    supprimer(utilisateur, id) {
        this.snackbar
            .showConfirmation(
                'Voulez-vous vraiment supprimer cette plateforme?'
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
    details(element: any) {
        this._router.navigate(['admin/plateforme/detail']);
    }

    modifier(utilisateur) {
        this.snackbar.openModal(
            AjoutComponent,
            '36rem',
            'edit',
            '',
            utilisateur,
            '',
            () => {
                // this.listeUtilisateur();
            }
        );
    }

    pageChanged(event) {
        this.datas = [];
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.offset = this.pageIndex * this.pageSize;
        //this.getList();
    }
}
