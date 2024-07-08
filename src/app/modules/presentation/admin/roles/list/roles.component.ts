import {DatePipe} from '@angular/common';
import {
    AfterViewInit,
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
import {Router} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {ExportService} from 'app/core/auth/export.service';
import {SnackBarService} from 'app/core/auth/snackBar.service';
//import {RolesService} from 'app/modules/presentation/admin/roles/roles.service';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import {Subject} from 'rxjs';
//import {CoreService} from 'app/core/core/core.service';
import {logo} from 'app/shared/logo';
import {CONSTANTES} from '../../model/constantes';
import {AjoutComponent} from './ajout/ajout.component';
import {PrivilegeComponent} from './privilege/privilege.component';
import {ButtonAction} from 'app/shared/tableau/tableau.component';


@Component({
    selector: 'roles-list',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
    providers: [ExportService, DatePipe],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class RolesListComponent implements OnInit, AfterViewInit, OnDestroy {
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
    Privileges: any;
    displayedColumnsFile: string[] = ['Role', 'Date de création'];
    tabFileBody: string[] = ['authority', 'createdAt'];
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProductForm: UntypedFormGroup;
    searchForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    currentIndex;
    deleteIndex: boolean = false;
    exporter: boolean = false;
    isCollapsed: boolean = false;
    isSearch: boolean = false;
    isSearch2: boolean = false;
    rechercher = '';
    message = '';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    img;
    image;
    offset: number = 0;
    constantes = CONSTANTES;
    privilegeByRole: any; //liste des codes recu de l'api lors de la connexion
    privilegeForPage: number = 1210; //code privilege envoye pour afficher la page
    hasList: boolean; // privilége permettant d'afficher la liste
    hasAdd: boolean; // privilége permettant d'afficher le button ajouter
    hasUpdate: boolean; // privilége permettant d'afficher le button modifier
    hasDelete: boolean; // privilége permettant d'afficher le button  supprimer
    hasAffecter: boolean; // privilége permettant d'afficher le button  affecter
    privilegePage;

    headers: any = [];
    btnActions: any = [];

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private snackbar: SnackBarService,
        private exportService: ExportService,
        public roleService: RolesService,
        private fb: UntypedFormBuilder,
        private datePipe: DatePipe,
        private coreService: CoreService,
        private router: Router
    ) {
        this.privilegeByRole = this.coreService.decriptDataToLocalStorage('CD-1');
        this.privilegePage = this.privilegeByRole.find(el => el == this.privilegeForPage);
        if (!this.privilegePage) {
            this.snackbar.openSnackBar('Vous n\'avez pas accès à cette fonctionnalité. Veuillez contacter votre administrateur', 'OK', ['mycssSnackbarRed']);
            this.router.navigate(['/project']);
        }

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.img = this.coreService.decriptDataToLocalStorage('CD-@--11');
        this.image = 'url(' + this.img + ')';
        this.initform();
        if (this.privilegePage) {
            this.listeRole();
            this.checkCodePrivilegeForRole();
            this.headers = this.createHeader();
            this.btnActions = this.createActions();
        }
    }


    checkCodePrivilegeForRole() {
        if (this.privilegeByRole && Array.isArray(this.privilegeByRole)) {
            this.hasList = this.privilegeByRole.indexOf('0' + (this.privilegeForPage + 1)) !== -1;
            this.hasAdd = this.privilegeByRole.indexOf('0' + (this.privilegeForPage + 2)) !== -1;
            this.hasUpdate = this.privilegeByRole.indexOf('0' + (this.privilegeForPage + 3)) !== -1;
            this.hasDelete = this.privilegeByRole.indexOf('0' + (this.privilegeForPage + 4)) !== -1;
            this.hasAffecter = this.privilegeByRole.indexOf('0' + (this.privilegeForPage + 5)) !== -1;
        } else {
            // Gérer le cas où this.privilegeByRole n'est pas défini ou n'est pas un tableau
            // Par exemple, définir les variables à false ou prendre une autre mesure appropriée
            this.hasList = false;
            this.hasAdd = false;
            this.hasUpdate = false;
            this.hasDelete = false;
            this.hasAffecter = false;
        }
    }


    //cette fonction permet d'initialiser le formulaire de recherche
    initform(): void {
        this.searchForm = this.fb.group({
            authority: [''],
        });
    }

    /**
     * After view init
     */
    ngAfterViewInit() {
        this.listeRole();
    }

    createHeader() {
        return [{th: 'Role', td: 'authority'}, {th: 'Date création', td: 'createdAt', type: 'd'}];
    }

    createActions(): ButtonAction[] {
        return [
            {
                icon: "heroicons_outline:view-grid-add",
                couleur: "text-indigo-800",
                size: "icon-size-5",
                title: "Ajouter un privilège",
                isDisabled: !this.hasAffecter,
                action: (element?) => this.ajoutPrivilege(element)
            }
        ]
    }

    listeRole() {
        this.isLoading = true;
        this.roleService.getRoles({
            sort: 'createdAt',
            order: 'asc',
            offset: this.offset,
            max: this.pageSize
        }).subscribe((resp) => {
            if (resp['responseCode'] == this.constantes.HTTP_STATUS.SUCCESSFUL) {
                this.isLoading = false;
                this.dataSource = new MatTableDataSource(resp[this.constantes.RESPONSE_DATA]);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.datas = resp[this.constantes.RESPONSE_DATA];
                this.length = resp['total'];
                this._changeDetectorRef.markForCheck();
            } else {
                this.isLoading = false;
                this.dataSource = new MatTableDataSource();
            }
        }, (error) => {
            this.snackbar.showErrors(error);
            this.isLoading = false;
        });
    }

    rechercherGlobal(event?) {
        this.rechercher = event;
        if (this.rechercher !== '') {
            const data = {
                'isGlobal': true,
                'typeEntity': 'roles',
                'searchQuery': this.rechercher
            };
            this.isSearch = true;
            this.coreService.doRechercher(data, 'roles').subscribe(response => {
                this.isSearch = false;
                this.datas = response['list'];
                this.dataSource = new MatTableDataSource(this.datas);
                this._changeDetectorRef.markForCheck();
                this.length = response['total'];
                this.isSearch = false;
            });
        } else {
            this.listeRole();
        }
    }

    pageChanged(event) {
        this.datas = [];
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.offset = this.pageIndex * this.pageSize;
        this.listeRole();
    }

    //cette fonction permet d'ajouter un role
    ajoutRole(): void {
        this.snackbar.openModal(AjoutComponent, '36rem', 'new', '', '', '', () => {
            this.listeRole();
        });
    }

    //cette fonction permet de modifier un role
    modifierRole(role): void {
        this.snackbar.openModal(AjoutComponent, '36rem', 'edit', '', role, '', () => {
            this.listeRole();
        });
    }

    //cette fonction permet de supprimer un role
    supprimerRole(role, id) {

        this.snackbar.showConfirmation('Voulez-vous vraiment supprimer ce role ?')
            .then((result) => {
                if (result['value'] == true) {
                    this.currentIndex = role;
                    this.deleteIndex = true;
                    this.roleService.deleteRole(id).subscribe((resp) => {
                        this.snackbar.openSnackBar('role supprimer avec succès !', 'OK', ['mycssSnackbarGreen']);
                        this.roleService.getRoles({offset: this.offset, max: this.pageSize}).subscribe((resp: any) => {
                            this.dataSource = new MatTableDataSource(resp[this.constantes.RESPONSE_DATA]);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.datas = resp[this.constantes.RESPONSE_DATA];
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

    searchFilterLocalCritereGlobal() {
        this.message = '';
        let value: Array<any>;
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
        this.listeRole();
        this.message = '';
    }

    annulerRechercheGloabl() {
        this.listeRole();
        this.message = '';
    }

    ajoutPrivilege(profile): void {
        const data = {'idRole': profile.id};
        this.roleService.getPrivileges(data).subscribe((resp) => {
            this.Privileges = resp;
            this.snackbar.openModal(PrivilegeComponent, '75rem', 'new', 'auto', profile, this.Privileges, () => {
                this.listeRole();
            });
        });
    }

    filterList() {
        this.isCollapsed = !this.isCollapsed;
    }

    //cette fonction permet d'exporter la liste sous format excel ou pdf
    exportAs(format) {
        const nom = 'Liste des rôles';
        let value = [];
        this.exporter = true;
        this.roleService.getRoles({max: 1000000}).subscribe((resp: any) => {
            value = resp[this.constantes.RESPONSE_DATA];
            if (value.length != 0) {
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
                        for (const field of this.tabFileBody) {
                            for (const element of elementKeys) {
                                if (field == element) {
                                    if (field == 'createdAt' || field == 'dateNaiss' || field == 'dateCirculation' || field == 'dateDepart' || field == 'dateDarriver') {
                                        tabField.push(moment(itemCurrent[field]).format('DD/MM/YYYY') || '');
                                    } else {
                                        if (typeof itemCurrent[field] == 'object') {
                                            tabField.push(itemCurrent[field]['libelle'] || '');
                                        } else {
                                            tabField.push(itemCurrent[field] || '');
                                        }
                                    }
                                }
                            }
                        }
                        rows.push(tabField);
                    }
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
                                    if (field == 'createdAt' || field == 'dateNaiss' || field == 'dateCirculation' || field == 'dateDepart' || field == 'dateDarriver') {
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
        const columns = ['                     ', fileName, 'Créé par ' + userName + ' le :' + this.datePipe.transform(toDay, 'dd/MM/yyyy')];
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle product details
     *
     * @param productId
     */

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void {
        // Get the image count and current image index
        const count = this.selectedProductForm.get('images').value.length;
        const currentIndex = this.selectedProductForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if (forward) {
            this.selectedProductForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else {
            this.selectedProductForm.get('currentImageIndex').setValue(prevIndex);
        }
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */

    /**
     * Filter tags input key down event
     *
     * @param event
     */

    /**
     * Create a new tag
     *
     * @param title
     */

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */

    /**
     * Delete the tag
     *
     * @param tag
     */

    /**
     * Add tag to the product
     *
     * @param tag
     */

    /**
     * Remove tag from the product
     *
     * @param tag
     */

    /**
     * Toggle product tag
     *
     * @param tag
     * @param change
     */

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */


    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
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
