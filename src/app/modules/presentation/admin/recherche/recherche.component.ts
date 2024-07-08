import * as moment from 'moment';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGeneratorService } from 'app/core/auth/toFormGroup.service';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { models } from '../model/model';
import { ExportService } from 'app/core/auth/export.service';
import { SnackBarService } from 'app/core/auth/snackBar.service';
import { CoreService } from 'app/core/core.service';
import { CONSTANTES } from '../model/constantes';

import { FormulaireComponent } from '../formulaire/formulaire.component';
import { RechercheService } from './recherche.service';
import { EnteteComponent } from 'app/shared/entete/entete.component';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';
import { DetailRechercheComponent } from './detail-recherche/detail-recherche.component';
import { logo } from 'app/shared/logo';
import { ResponseBack } from './recherche.types';
import { AjoutReseauComponent } from '../reseau/ajout-reseau/ajout-reseau.component';
import { AddOperateurComponent } from '../operateur/add/add.component';

import { CommonModule, DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
//declare var jsPDF: any;

@Component({
    selector: 'app-recherche',
    templateUrl: './recherche.component.html',
    standalone: true,
    styleUrls: ['./recherche.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        ReactiveFormsModule,
        EnteteComponent,
        AngularMaterialModule,
        MatPaginatorModule,
        CommonModule,
        FormsModule,
    ],
    providers: [
        ExportService,
        DatePipe,
        {
            provide: MatDialogRef,
            useValue: [],
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RechercheComponent implements OnInit {
    transactionVueService: any;

    addItems(): void {
        let composant;
        if (this.informations?.url == 'reseau') {
            composant = AjoutReseauComponent;
        } else if (this.informations?.url == 'operateur') {
            composant = AddOperateurComponent;
        } else {
            composant = FormulaireComponent;
        }

        this.snackbar.openModalFormDynamique(
            composant,
            this.informations.taillemodal[0].width,
            this.constantes.TYPEACTION.NEW,
            this.informations.typeForm,
            this.informations.fields,
            this.informations,
            this.datas,
            () => {
                this.getList();
            }
        );
    }
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    informations: any;
    displayedColumns: any;
    searchList: any;
    codeEnvoye: number; //code envoye par notre menu
    codeRecu: any; //code recu de l'api lors de la connexion
    hasList: boolean = true;
    hasAdd: boolean;
    hasUpdate: boolean;
    hasDelete: boolean;
    hasDetail: boolean;
    hasBloquer: boolean;
    hasValider: boolean;
    hasAdherer: boolean;
    hasAnnuler: boolean;
    length;
    searchForm: FormGroup;
    hasCriteriaSearch: boolean = true;
    dialogRef: any;
    dataSource: MatTableDataSource<any>;
    datas: any = [];
    dataLocal: any = [];
    deleteUser: boolean = false;
    currentIndex;
    loadData: boolean = false;
    isLoader: boolean = false;
    exporter: boolean = false;
    isCollapsed: boolean = false;
    isSearch2: boolean = false;
    isSearch: boolean = false;
    rechercher = '';
    showLoader = 'isNotShow';
    message = '';
    formules: any = [];
    config: any;
    pageSizeOptions = [5, 10, 25, 100, 500, 1000, 10000, 100000, 1000000];
    pageIndex: number = 0;
    pageSize: number = 10;
    lienBrute = '';
    constantes = CONSTANTES;
    listPrivileges = [];
    utilisateurList = [];
    userConnecter;
    offset: number = 0;
    agenceId: any;
    menuTransactions = [];
    data;
    menuData;
    privilegePage;
    listetemplate: any;
    dateComptable;
    dataRecherche;
    montantAccorde;
    nmbreEcheance;
    differeJour;
    agentCred;
    motifsAnnulationTransactionJour = '';
    dataHistorique;
    motifExtourne;
    datas2;

    constructor(
        public matDialogRef: MatDialogRef<RechercheComponent>,
        private toFormGroupService: FormGeneratorService,
        private coreService: CoreService,
        private changeDetectorRefs: ChangeDetectorRef,
        private snackbar: SnackBarService,
        private rechercheService: RechercheService,
        private _matDialog: MatDialog,
        private route: ActivatedRoute,
        private exportService: ExportService,
        private datePipe: DatePipe,
        private snackBar: MatSnackBar,
        private _changeDetectorRef: ChangeDetectorRef // private cdr: ChangeDetectorRef
    ) {
        //@ts-ignore
        this.lienBrute = this.route.snapshot._routerState.url;
        const lien = this.lienBrute.substring(1, this.lienBrute.length);
        const currentLag = 'fr';
        console.log(lien);
        this.informations = models[lien];
        this.displayedColumns = this.informations.tabBody;
        if (this.displayedColumns.indexOf('action') == -1)
            this.displayedColumns.push('action');
        else {
            if (this.displayedColumns.indexOf('action') != -1)
                this.displayedColumns.splice(
                    this.displayedColumns.indexOf('action')
                );
            this.displayedColumns.push('action');
        }
        console.log('displayedColumns', this.displayedColumns);
        this.searchList = this.informations.searchFields;
        console.log('infos', this.informations.tabHead);
        this.codeRecu = this.informations.code;
    }

    ngOnInit(): void {
        const lien = this.lienBrute.substring(1, this.lienBrute.length);
        this.informations = models[lien];
        this.searchList = this.informations.searchFields;
        this.codeEnvoye = parseInt(this.informations.code);
        console.log('====================================');
        console.log('files', this.informations.fields);
        console.log('infos', this.informations);

        console.log('====================================');
        this.agenceId = this.coreService.decriptDataToLocalStorage('CD-@2');
        this.dateComptable =
            this.coreService.decriptDataToLocalStorage('DC-@--1');
        this.searchForm = this.toFormGroupService.toFormGroup2(this.searchList);
        this.changeDetectorRefs.detectChanges();
        this.getList();
        this.getListFormulaire();
    }

    getList() {
        this.loadData = true;
        this.rechercheService
            .list1(this.informations.url, this.pageSize, this.offset)
            .subscribe(
                (response) => {
                    this.loadData = false;
                    if (response['responseCode'] == 200) {
                        this.loadData = false;
                        this.dataSource = new MatTableDataSource(
                            response['data']
                        );
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.datas = response['data'];
                        console.log('====================================');
                        this.length = response['total'];
                        console.log('length', this.length);
                        console.log('====================================');
                        this._changeDetectorRef.markForCheck();
                    } else {
                        this.loadData = false;
                        this.dataSource = new MatTableDataSource();
                    }
                },
                (error) => {
                    this.loadData = false;
                }
            );
    }

    pageChanged(event) {
        this.datas = [];
        this._changeDetectorRef.markForCheck();
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.offset = this.pageIndex * this.pageSize;
        this.getList();
    }

    updateItems(information, actions): void {
        // this.coreService.encriptDataToLocalStorage('CD-@--121', information);
        console.log(information);

        if (actions.name == 'modifier') {
            let currentItem;
            for (const field of this.informations.fields) {
                if (typeof information[field.name] === 'object') {
                    if (information[field.name] instanceof Array) {
                        field.value = information[field.name].map(
                            (el) => el.id
                        );
                    } else {
                        field.value = information[field.name]?.id
                            ? information[field.name]?.id
                            : information[field.name]?.code
                            ? information[field.name]?.code
                            : '';
                    }
                } else {
                    field.value = information[field.name];
                }
            }
            currentItem = this.informations.fields;
            let composant;
            if (this.informations?.url == 'reseau') {
                currentItem = information;
                composant = AjoutReseauComponent;
            } else if (this.informations?.url == 'operateur') {
                currentItem = information.fields;
                composant = AddOperateurComponent;
            } else {
                composant = FormulaireComponent;
            }
            this.snackbar.openUpdateModal(
                composant,
                this.informations.taillemodal[0].width,
                this.constantes.TYPEACTION.EDIT,
                currentItem,
                this.informations,
                information.id,
                () => {
                    this.getList();
                }
            );
        } else {
            this.supprimerItems(information.id, information);
        }
    }

    //cette fonction permet de supprimer
    supprimerItems(id, information) {
        this.snackbar
            .showConfirmation(
                'Voulez-vous vraiment supprimer ' +
                    this.informations.typeEntity +
                    ' ?'
            )
            .then((result) => {
                if (result['value'] == true) {
                    this.deleteUser = true;
                    this.currentIndex = information;
                    this.showLoader = 'isShow';
                    this.coreService
                        .deleteItem(id, this.informations.url)
                        .subscribe(
                            (resp) => {
                                this.showLoader = 'isNotShow';
                                this.getList();
                            },
                            (error) => {
                                this.showLoader = 'isNotShow';
                                this.deleteUser = false;
                                this.snackbar.showErrors(error);
                            }
                        );
                }
            });
    }

    //cette fonction permet d'afficher les listes deroulantes
    getListFormulaire() {
        for (let item of this.searchList) {
            if (item.type == 'select' && item.url != '') {
                this.rechercheService
                    .listFormulaire(item.url)
                    .subscribe((reponse) => {
                        if (reponse['responseCode'] == 200) {
                            console.log('====================================');
                            console.log('data formaulire ', reponse['data']);
                            console.log('====================================');
                            item.list = reponse['data'];
                        }
                    });
            }
        }
    }

    filterList() {
        this.isCollapsed = !this.isCollapsed;
    }

    //cette fonction permet d'exporter la liste sous format excel ou pdf

    exportAs(format) {
        let nom = this.informations.titleFile;
        let value = [];
        this.rechercheService
            .list1(this.informations.url, 1000000000, 0)
            .subscribe(
                (resp) => {
                    if (resp['responseCode'] == 200) {
                        value = resp['data'];
                        if (value.length != 0) {
                            let user = { prenom: 'admin', nom: 'admin' };
                            if (format == 'pdf') {
                                let donne = this.exempleGenPdfHeaderFooter(
                                    user.prenom + ' ' + user.nom,
                                    nom
                                );
                                var doc = donne.doc;
                                var col = this.informations.tabFileHead;
                                var rows = [];
                                var itemCurrent;
                                // for (let item of value) {
                                //     itemCurrent = item;
                                //     const tabField = [];
                                //     const elementKeys = Object.keys(item);
                                //     let i = 0;
                                //     for (const field of this.informations.tabFileBody) {
                                //         for (const element of elementKeys) {
                                //             if (field == element) {
                                //                 if (field == 'createdAt' || field == 'dateNaiss' || field == 'dateCirculation' || field == 'dateDepart' || field == 'dateTransaction' || field == 'date' || field == 'dateDebut' || field == 'dateFin' || field == 'dateCreated') {
                                //                     tabField.push(moment(itemCurrent[field]).format('DD/MM/YYYY') || '');
                                //                 } else {
                                //                     if (typeof itemCurrent[field] == 'object') {
                                //                         tabField.push(!(itemCurrent[field] instanceof Object) ? itemCurrent[field] : itemCurrent[field]['libelle'] ? itemCurrent[field]['libelle'] : itemCurrent[field]['code'] ? itemCurrent[field]['code'] : itemCurrent[field]['intituleClient'] ? itemCurrent[field]['intituleClient'] : itemCurrent[field]['nom'] ? itemCurrent[field]['intitule'] : itemCurrent[field]['intitule']);
                                //                     } else {
                                //                         tabField.push(itemCurrent[field] || '');
                                //                     }
                                //                 }
                                //             }
                                //         }
                                //         i++;
                                //     }
                                //     rows.push(tabField);
                                // }
                                for (const item of value) {
                                    const itemCurrent = item;
                                    const tabField = [];
                                    const elementKeys = Object.keys(item);
                                    let i = 0;

                                    for (const field of this.informations.tabFileBody) {
                                        for (const element of elementKeys) {
                                            if (field === element) {
                                                if (['createdAt', 'dateNaiss', 'dateCirculation', 'dateDepart', 'dateDarriver'].includes(field)) {
                                                    // Si le champ est une date, formater et ajouter à tabField
                                                    tabField.push(moment(itemCurrent[field]).format('DD/MM/YYYY') || '');
                                                } else {
                                                    if (typeof itemCurrent[field] === 'object' && itemCurrent[field] !== null) {
                                                        // Si c'est un objet non null, ajouter 'libelle' ou 'nom'
                                                        tabField.push(itemCurrent[field]['libelle'] || itemCurrent[field]['nom'] || itemCurrent[field]['description']);
                                                    } else {
                                                        // Sinon, ajouter la valeur ou une chaîne vide
                                                        tabField.push(itemCurrent[field] || '');
                                                    }
                                                }
                                            }
                                        }
                                        i++;
                                    }
                                    // Ajouter tabField au tableau des lignes
                                    rows.push(tabField);
                                }

                                autoTable(doc, { head: [col], body: rows });
                                doc.save(nom + '.pdf');
                                this.snackBar.open(
                                    'Téléchargement réussi',
                                    'OK',
                                    {
                                        verticalPosition: 'bottom',
                                        duration: 5000,
                                        panelClass: ['mycssSnackbarGreen'],
                                    }
                                );
                                this.exporter = false;
                            } else if (format == 'excel') {
                                var col = this.informations.tabFileHead;
                                var rows = [];
                                var itemCurrent;
                                for (var item of value) {
                                    itemCurrent = item;
                                    let tabField = [];
                                    let elementKeys = Object.keys(item);
                                    let i = 0;
                                    for (let field of this.informations
                                        .tabFileBody) {
                                        for (let element of elementKeys) {
                                            if (
                                                element.toString() ==
                                                field.toString()
                                            ) {
                                                if (
                                                    field == 'createdAt' ||
                                                    field == 'dateNaiss' ||
                                                    field ==
                                                        'dateCirculation' ||
                                                    field == 'dateDepart' ||
                                                    field == 'dateDarriver'
                                                )
                                                    tabField.push({
                                                        [this.informations
                                                            .tabFileHead[i]]:
                                                            moment(
                                                                itemCurrent[
                                                                    field
                                                                ]
                                                            ).format(
                                                                'DD/MM/YYYY'
                                                            ) || '',
                                                    });
                                                else {
                                                    if (
                                                        typeof itemCurrent[
                                                            field
                                                        ] === 'object' &&
                                                        itemCurrent[field] !==
                                                            null
                                                    ) {
                                                        let fieldValue =
                                                            itemCurrent[field][
                                                                'libelle'
                                                            ] ||
                                                            itemCurrent[field][
                                                                'nom'
                                                            ] ||
                                                            '';
                                                        let fieldName =
                                                            this.informations
                                                                .tabFileHead[i];

                                                        tabField.push({
                                                            [fieldName]:
                                                                fieldValue,
                                                        });
                                                    } else {
                                                        tabField.push({
                                                            [this.informations
                                                                .tabFileHead[
                                                                i
                                                            ]]:
                                                                itemCurrent[
                                                                    field
                                                                ] || '',
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                        i++;
                                    }
                                    rows.push(Object.assign({}, ...tabField));
                                }
                                this.exportService.exportAsExcelFile(
                                    this.exportService.preFormatLoanInfo(rows),
                                    nom
                                );
                                this.snackBar.open(
                                    'Téléchargement réussi',
                                    'OK',
                                    {
                                        verticalPosition: 'bottom',
                                        duration: 5000,
                                        panelClass: ['mycssSnackbarGreen'],
                                    }
                                );
                                this.exporter = false;
                            }
                        } else {
                            this.snackBar.open('La liste est vide!!!', 'OK', {
                                verticalPosition: 'bottom',
                                duration: 5000,
                                panelClass: ['mycssSnackbarRed'],
                            });
                        }
                    } else {
                        this.loadData = false;
                    }
                },
                (error) => {
                    this.snackBar.open(
                        error['error']['errors'][0]['message'],
                        'OK',
                        {
                            verticalPosition: 'bottom',
                            duration: 5000,
                            panelClass: ['red-snackbar'],
                        }
                    );
                }
            );
    }

    exempleGenPdfHeaderFooter(userName, fileName) {
        const toDay = new Date();
        let marginX = 0;
        const doc = new jsPDF();
        const totalPagesExp = '{total_pages_count_string}';
        doc.setFillColor(0, 0, 255);
        const columns = [
            '                     ',
            fileName,
            ' Date du :' + this.datePipe.transform(toDay, 'dd/MM/yyyy'),
        ];
        const rows = [];
        autoTable(doc, {
            head: [columns],
            body: rows,
            theme: 'grid',
            margin: {
                top: 10,
            },
            didDrawCell: function (data) {
                if (data.row.section === 'head' && data.column.index === 1) {
                    data.cell.styles.textColor = [51, 22, 183];
                    data.cell.styles.fontSize = 10;
                    data.cell.styles.valign = 'middle';
                    data.cell.styles.fillColor = [216, 78, 75];
                }
                if (data.row.section === 'head' && data.column.index === 0) {
                    doc.addImage(
                        logo,
                        'JPEG',
                        data.cell.x + 2,
                        data.cell.y + 2,
                        30,
                        15
                    );
                }
            },
            didDrawPage: function (data) {
                marginX = data.settings.margin.left;
                // Header
                doc.setFontSize(10);
                doc.setTextColor(255);
            },
            styles: {
                lineColor: [0, 0, 0],
                lineWidth: 0.3,
                textColor: [51, 122, 183],
            },
            headStyles: {
                fillColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'normal',
                valign: 'middle',
                textColor: 0,
                minCellHeight: 20,
            },
            willDrawCell: function (data) {
                if (data.row.section === 'head') {
                    doc.setTextColor(51, 122, 183);
                }
                if (data.row.section === 'head' && data.column.index === 1) {
                    doc.setFontSize(10);
                }
            },
        });
        return { doc: doc, marginX: marginX, totalPagesExp: totalPagesExp };
    }

    searchFilter() {
        this.message = '';
        let data = {
            isGlobal: false,
            typeEntity: this.informations.url,
            searchQuery: this.searchForm.value,
        };
        this.isSearch2 = true;
        this.rechercheService
            .doRechercher(data, this.informations.url)
            .subscribe(
                (response: any) => {
                    if (response['responseCode'] == 200) {
                        this.isSearch2 = false;
                        this.loadData = false;
                        let value: any = [];
                        this.dataSource = new MatTableDataSource(
                            response['data']
                        );
                        value = response['data'];
                        this.length = response['total'];
                        if (value.length == 0) {
                            this.datas = [{}];
                            this.message = 'Aucun resultat trouvé';
                        } else this.datas = value;
                        this._changeDetectorRef.markForCheck();
                    } else {
                        this.isSearch2 = false;
                        this.snackBar.open(
                            response['errors'][0]['message'],
                            'OK',
                            {
                                verticalPosition: 'bottom',
                                duration: 5000,
                                panelClass: ['mycssSnackbarRed'],
                            }
                        );
                    }
                },
                (error) => {
                    this.isSearch2 = false;
                    this.snackBar.open(
                        error['error']['errors'][0]['message'],
                        'OK',
                        {
                            verticalPosition: 'bottom',
                            duration: 5000,
                            panelClass: ['mycssSnackbarRed'],
                        }
                    );
                }
            );
    }
    selectList(field, list) {
        if (field === 'produit') {
            this.checkFormule();
        }
    }

    checkFormule() {
        const formule = this.formules.filter(
            (el) => el.produit.nom === this.searchForm.get('produit').value
        );
        if (formule) {
            for (const field of this.searchList) {
                if (field.field === 'formule') {
                    field.list = formule;
                }
            }
        }
    }

    annulerRechercheCritere() {
        this.searchForm = this.toFormGroupService.toFormGroup2(this.searchList);
        this.getList();
        this._changeDetectorRef.markForCheck();
        this.message = '';
    }

    checkValue(value) {
        if (value) {
            return value.toString().toLowerCase();
        }
    }

    //Afficher les details

    details(el) {
        console.log(el);
        console.log('====================================');
        console.log(this.informations.url);
        console.log('====================================');
        this.dialogRef = this._matDialog.open(DetailRechercheComponent, {
            panelClass: 'event-form-dialog',
            disableClose: true,
            width: '55rem',
            height: 'auto',
            data: {
                item: el,
                url: this.informations.url,
            },
        });
    }

    record(item) {}

    getCurrentStatut(statut) {
        return this.coreService.getStatut(statut);
    }

    sortTable(array) {
        array.sort(function (a, b) {
            return +new Date(b.createdAt) - +new Date(a.createdAt);
        });
        return array;
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    rechercherGlobal(event?) {
        this.message = '';
        let data = {
            isGlobal: true,
            typeEntity: this.informations.url,
            searchQuery: event.searchQuery,
        };
        this.isSearch = true;
        this.rechercheService
            .doRechercher(data, this.informations.url)
            .subscribe(
                (response: any) => {
                    if (response) {
                        this.isSearch = false;
                        let value: any = [];
                        console.log('====================================');
                        console.log(response);
                        console.log('====================================');
                        this.dataSource = new MatTableDataSource(
                            response['data']
                        );
                        value = response;
                        this.length = response['total'];
                        if (value.length == 0) {
                            this.datas = [{}];
                            this.message = 'Aucun resultat trouvé';
                        } else this.datas = value.data;
                        this._changeDetectorRef.markForCheck();
                    } else {
                        this.isSearch = false;
                        this.snackBar.open(
                            response['errors'][0]['message'],
                            'OK',
                            {
                                verticalPosition: 'bottom',
                                duration: 5000,
                                panelClass: ['mycssSnackbarRed'],
                            }
                        );
                    }
                },
                (error) => {
                    this.isSearch = false;
                    this.snackBar.open(
                        error['error']['errors'][0]['message'],
                        'OK',
                        {
                            verticalPosition: 'bottom',
                            duration: 5000,
                            panelClass: ['mycssSnackbarRed'],
                        }
                    );
                    console.log(error);
                }
            );
    }
}
