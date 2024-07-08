import {DatePipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {fuseAnimations} from '@fuse/animations';
import {ExportService} from 'app/core/auth/export.service';
import {PrivilegeService} from 'app/modules/presentation/admin/privilege/privilege.service';
import * as moment from 'moment';
import {Subject} from 'rxjs';
import {logo} from 'app/shared/logo';
import {AjoutPrivilegeComponent} from './ajout/ajout.component';
import {Router} from '@angular/router';
import {SnackBarService} from 'app/core/auth/snackBar.service';
import {CoreService} from 'app/core/core/core.service';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import {ButtonAction} from 'app/shared/tableau/tableau.component';

@Component({
    selector: 'privilege-list',
    templateUrl: './privilege.component.html',
    styleUrls: ['./privilege.component.scss'],
    providers: [ExportService, DatePipe],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class PrivilegeListComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) private sort: MatSort;

    dataSource: MatTableDataSource<any>;
    datas: any = [];
    length: number;
    pageSizeOptions = [5, 10, 25, 100, 500, 1000];
    pageIndex: number = 0;
    pageSize: number = 10;
    dialogRef: any;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    productsCount: number = 0;
    privilegeColumns: string[] = ['code', 'uri', 'libelle', 'niveau', 'ordre', 'affichageMenu', 'createdAt', 'action'];
    displayedColumnsFile: string[] = ['Code', 'Uri', 'Libellé', 'Niveau', 'Ordre', 'Affichage menu', 'Date de création'];
    tabFileBody: string[] = ['code', 'uri', 'libelle', 'niveau', 'ordre', 'isMenu', 'createdAt'];
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProductForm: UntypedFormGroup;
    searchForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    currentIndex;
    deleteIndex: boolean = false;
    exporter: boolean = false;
    loadData: boolean = false;
    isCollapsed: boolean = false;
    isSearch: boolean = false;
    isSearch2: boolean = false;
    rechercher = '';
    message = '';
    listNiveaux = [{name: '1', value: 1}, {name: '2', value: 2}, {name: '3', value: 3}, {name: '4', value: 4}];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    img;
    image;
    offset: number = 0;
    privilegePage;

    privilegeByRole: any; //liste des codes recu de l'api lors de la connexion
    privilegeForPage: number = 1310; //code privilege envoye pour afficher la page
    hasList: boolean; // privilége permettant d'afficher la liste
    hasAdd: boolean; // privilége permettant d'afficher le button ajouter
    hasUpdate: boolean; // privilége permettant d'afficher le button modifier
    hasDelete: boolean; // privilége permettant d'afficher le button  supprimer

    headers: any = [];
    btnActions: any = [];

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private snackbar: SnackBarService,
        private exportService: ExportService,
        private privilegeService: PrivilegeService,
        private fb: UntypedFormBuilder,
        private datePipe: DatePipe,
        private coreService: CoreService,
        private _router: Router
    ) {
        this.privilegeByRole = this.coreService.decriptDataToLocalStorage('CD-1');
        this.privilegePage = this.privilegeByRole.find(el => el == this.privilegeForPage);
        if (!this.privilegePage) {
            this.snackbar.openSnackBar('Vous n\'avez pas accés a cette fonctionnalité, Veuillez contacter votre administrateur', 'OK', ['mycssSnackbarRed']);
            this._router.navigate(['/project']);
        }

    }


    ngOnInit(): void {
        this.img = this.coreService.decriptDataToLocalStorage('CD-@--11');
        this.image = 'url(' + this.img + ')';
        this.initform();
        if (this.privilegePage) {
            this.listePrivilege();
            this.checkCodePrivilegeForRole();
            this.headers = this.createHeader();
            this.btnActions = this.createActions();
        }
    }

    checkCodePrivilegeForRole() {
        this.hasList = this.privilegeByRole?.indexOf('0' + (this.privilegeForPage + 1)) != -1;
        this.hasAdd = this.privilegeByRole?.indexOf('0' + (this.privilegeForPage + 2)) != -1;
        this.hasUpdate = this.privilegeByRole?.indexOf('0' + (this.privilegeForPage + 3)) != -1;
        this.hasDelete = this.privilegeByRole?.indexOf('0' + (this.privilegeForPage + 4)) != -1;
    }


    //cette fonction perme d'initialiser le formulaire de recherche
    initform(): void {
        this.searchForm = this.fb.group({
            code: [''],
            libelle: [''],
            niveau: [''],

        });
    }

    createHeader() {
        return [{th: 'Code', td: 'code'}, {th: 'Libelle', td: 'libelle'}, {th: 'Uri', td: 'uri'}, {
            th: 'Niveau',
            td: 'niveau'
        }, {th: 'Ordre', td: 'ordre'}, {
            th: 'Affichage Menu',
            td: 'isMenu',
            badgeClass: [{name: 'oui', value: 'badge-success'}, {name: 'non', value: 'badge-red'}]
        }, {th: 'Date création', td: 'createdAt'}];
    }

    createActions(): ButtonAction[] {
        return [
            {
                icon: "edit",
                couleur: "text-green-400",
                size: "icon-size-4",
                title: "Modifier",
                isDisabled: !this.hasUpdate,
                action: (element?) => this.modifierPrivilege(element)
            },
            {
                icon: "delete_outline",
                couleur: "text-red-400",
                size: "icon-size-4",
                title: "Supprimer",
                isDisabled: !this.hasDelete,
                action: (element?) => this.supprimerPrivilege(element, element.id)
            }
        ]
    }

    listePrivilege() {
        this.isLoading = true;
        this.privilegeService.getPrivilege(this.pageSize, this.offset).subscribe((resp) => {
            if (resp['responseCode'] == 200) {
                this.isLoading = false;
                this.dataSource = new MatTableDataSource(resp['data']);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.datas = resp['data'];
                this.length = resp['total'];
                this._changeDetectorRef.markForCheck();
            } else {
                this.isLoading = false;
                this.dataSource = new MatTableDataSource();
            }
        }, () => {
            this.isLoading = false;
        });
    }

    rechercherGlobal(event?) {
        this.rechercher = event;
        if (this.rechercher !== '') {
            const data = {
                'isGlobal': true,
                'typeEntity': 'privileges',
                'searchQuery': this.rechercher
            };
            this.isSearch = true;
            this.coreService.doRechercher(data, 'privileges').subscribe(response => {
                this.isSearch = false;
                this.datas = response['list'];
                this.dataSource = new MatTableDataSource(this.datas);
                this._changeDetectorRef.markForCheck();
                this.length = response['total'];
                this.isSearch = false;
            });
        } else {
            this.listePrivilege();
        }
    }

    searchFilterLocalCritereGlobal() {
        this.message = '';
        let value: Array<any> = [];
        let dataSearch = [];
        let dataLocal = this.datas;
        const searchField = this.rechercher;
        const dataSearchG = [];
        value = Object.keys(this.searchForm.value);
        if (searchField != '' && searchField != undefined && searchField != null) {
            for (const data of dataLocal) {
                for (const field of value) {
                    if (data[field] != undefined && data[field] != null && data[field].toString().toLowerCase().indexOf(searchField.trim().toLowerCase()) != -1) {
                        dataSearchG.push(data);
                    }
                }
                dataLocal = dataSearchG;
            }
        }
        this.dataSource = new MatTableDataSource(dataLocal);
        if (this.searchForm.value) {
            for (const field of value) {
                dataSearch = [];
                if (field) {
                    for (const data of dataLocal) {
                        if (data[field] != undefined && data[field] != null && data[field].toString().toLowerCase().indexOf(this.searchForm.get(field).value.trim().toLowerCase()) != -1) {
                            dataSearch.push(data);
                        }
                    }
                    dataLocal = dataSearch;
                }
                this.dataSource = new MatTableDataSource(dataLocal);
            }
        }
        if (dataLocal.length == 0) {
            this.datas = [];
            this.message = 'Aucun resultat trouvé';
        }
    }

    annulerRechercheCritere() {
        this.searchForm.reset();
        this.isCollapsed = !this.isCollapsed;
        this.listePrivilege();
        this.message = '';
    }

    pageChanged(event) {
        this.datas = [];
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.offset = this.pageIndex * this.pageSize;
        this.listePrivilege();
    }

    //cette fonction permet d'ajouter un Privilege
    ajoutPrivilege(): void {
        this.snackbar.openModal( AjoutPrivilegeComponent, '38rem', 'new', '', '', '', () => {
            this.listePrivilege();
        });
    }

    //cette fonction permet de modifier un Privilege
    modifierPrivilege(privilege): void {
        this.snackbar.openModal( AjoutPrivilegeComponent, '38rem', 'edit', '', privilege, '', () => {
            this.listePrivilege();
        });
    }

    //cette fonction permet de supprimer un Privilege
    supprimerPrivilege(privilege, id) {
        this.snackbar.showConfirmation('Voulez-vous vraiment supprimer ce privilège ?')
            .then((result) => {
                if (result['value'] == true) {
                    this.currentIndex = privilege;
                    this.deleteIndex = true;

                    this.privilegeService.deletePrivilge(id).subscribe((resp) => {

                        this.snackbar.openSnackBar('Ce privilège a été supprimé avec succès !', 'OK', ['mycssSnackbarGreen']);
                        this.privilegeService.getPrivilege(this.pageSize, this.offset).subscribe((resp: any) => {
                            this.dataSource = new MatTableDataSource(resp['data']);
                            this.datas = resp['data'];
                            this.length = resp['total'];
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this._changeDetectorRef.markForCheck();
                            this._changeDetectorRef.detectChanges();
                            this.deleteIndex = false;
                        });
                    }, (error) => {
                        this.deleteIndex = false;
                        this.snackbar.showErrors(error);
                    });
                }
            });
    }

    filterList() {
        this.listePrivilege();
        this.isCollapsed = !this.isCollapsed;
    }

    exportAs(format) {
        const nom = 'Liste des Priviléges';
        let value = [];

        this.privilegeService.getPrivilege(1000000, 0).subscribe((resp: any) => {
            if (resp['responseCode'] == 200) {
                this.exporter = true;
                value = resp['data'];
                const user = this.coreService.decriptDataToLocalStorage('CD-@--5');
                if (format == 'pdf') {
                    const donne = this.exempleGenPdfHeaderFooter(user.firstName + ' ' + user.lastName, nom);
                    const doc = donne.doc;
                    let col = this.displayedColumnsFile;
                    let rows = [];
                    let itemCurrent;
                    for (let item of value) {
                        itemCurrent = item;
                        const tabField = [];
                        const elementKeys = Object.keys(item);
                        let i = 0;
                        for (const field of this.tabFileBody) {
                            for (const element of elementKeys) {
                                if (field == element) {
                                    if (field == 'createdAt' || field == 'dateNaiss') {
                                        tabField.push(moment(itemCurrent[field]).format('DD/MM/YYYY') || '');
                                    } else {
                                        if (typeof itemCurrent[field] == 'object') {
                                            tabField.push(itemCurrent[field] ? itemCurrent[field]['libelle'] || '' : '');
                                        } else {
                                            tabField.push(itemCurrent[field] || '');
                                        }
                                    }
                                }
                            }
                            i++;
                        }
                        rows.push(tabField);
                    }
                    // let valTable:UserOptions={head:col, body:rows};
                    autoTable(doc, {head: [col], body: rows});
                    doc.save(nom + '.pdf');
                    this.snackbar.openSnackBar('Téléchargement réussi', 'OK', ['mycssSnackbarGreen']);
                    this.exporter = false;
                } else if (format == 'excel') {
                    let col = this.displayedColumnsFile;
                    let rows = [];
                    let itemCurrent;
                    for (let item of value) {
                        itemCurrent = item;
                        const tabField = [];
                        const elementKeys = Object.keys(item);
                        let i = 0;
                        for (const field of this.tabFileBody) {
                            for (const element of elementKeys) {
                                if (element.toString() == field.toString()) {
                                    if (field == 'createdAt' || field == 'dateNaiss') {
                                        tabField.push({[this.displayedColumnsFile[i]]: (moment(itemCurrent[field]).format('DD/MM/YYYY') || '')});
                                    } else {
                                        if (typeof itemCurrent[field] == 'object') {
                                            tabField.push({[this.displayedColumnsFile[i]]: (itemCurrent[field] ? itemCurrent[field]['libelle'] : "" || '')});
                                        } else {
                                            tabField.push({[this.displayedColumnsFile[i]]: (itemCurrent[field] || '')});
                                        }
                                    }
                                }
                            }
                            i++;
                        }
                        rows.push(Object.assign({}, ...tabField));
                    }
                    this.exportService.exportAsExcelFile(this.exportService.preFormatLoanInfo(rows), nom);
                    this.snackbar.openSnackBar('Téléchargement réussi', 'OK', ['mycssSnackbarGreen']);
                    this.exporter = false;
                }
            } else {
                this.snackbar.openSnackBar('La liste est vide!!!', 'OK', ['mycssSnackbarRed']);
                this.exporter = false;
            }
        }, (error) => {
            this.snackbar.showErrors(error);
        });
    }

    exempleGenPdfHeaderFooter(userName, fileName) {
        const toDay = new Date();
        let marginX = 0;
        const doc = new jsPDF();
        const totalPagesExp = '{total_pages_count_string}';
        doc.setFillColor(0, 0, 255);
        const columns = ['                     ', fileName, 'Date du :' + this.datePipe.transform(toDay, 'dd/MM/yyyy')];
        const rows = [];
        autoTable(doc, {
            head: [columns],
            body: rows,
            theme: 'grid',
            margin: {
                top: 10
            },
            didDrawCell: function (data) {
                if (
                    (data.row.section === 'head') &&
                    data.column.index === 1
                ) {
                    data.cell.styles.textColor = [51, 122, 183];
                    data.cell.styles.fontSize = 12;
                    data.cell.styles.valign = 'middle';
                    data.cell.styles.fillColor = [216, 78, 75];
                }
                if (
                    (data.row.section === 'head') &&
                    data.column.index === 0
                ) {
                    doc.addImage(logo, 'JPEG', data.cell.x + 2, data.cell.y + 2, 30, 15);
                }
            },
            didDrawPage: function (data) {
                marginX = data.settings.margin.left;
                // Header
                doc.setFontSize(12);
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
                    doc.setFontSize(12);
                }
            },
        });
        return {doc: doc, marginX: marginX, totalPagesExp: totalPagesExp};
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
}
