import {
    CUSTOM_ELEMENTS_SCHEMA,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'app/core/core.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ButtonAction,
    TableauComponent,
} from 'app/shared/tableau/tableau.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { EnteteComponent } from 'app/shared/entete/entete.component';
import { ListComponent } from './list/list.component';
import { CONSTANTES } from '../model/constantes';
import { SnackBarService } from 'app/shared/snackBar.service';
import { AjoutComponent } from './ajout/ajout.component';

@Component({
    selector: 'app-plateforme',
    standalone: true,
    providers: [DatePipe],
    templateUrl: './plateforme.component.html',
    styleUrl: './plateforme.component.scss',
    imports: [
        ListComponent,
        EnteteComponent,
        DatePipe,
        TableauComponent,
        CommonModule,
        MatIcon,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PlateformeComponent implements OnInit {
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
        private datePipe: DatePipe,
        private _router: Router,
        private route: ActivatedRoute,
        private fb: UntypedFormBuilder,
        private snackbar: SnackBarService
    ) {}

    ngOnInit(): void {
        this.coreService.data().subscribe((data) => {
            this.datas = data;
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            console.log(this.dataSource);
        });

        this.searchForm = new FormGroup({
            firstName: new FormControl(''),
            lastName: new FormControl(''),
            email: new FormControl(''),
            telephone: new FormControl(''),
        });
    }

    pageChanged(event) {
        this.datas = [];
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.offset = this.pageIndex * this.pageSize;
        //this.getList();
    }

    ajoutUtilisateur(): void {
        this.snackbar.openModal(
            AjoutComponent,
            '36rem',
            'new',
            '',
            '',
            '',
            () => {
                //  this.listeUtilisateur();
            }
        );
    }

    annulerRechercheCritere() {
        this.searchForm.reset();
        this.isCollapsed = !this.isCollapsed;
        //this.listeUtilisateur();
        this.message = '';
    }

    rechercherCritere() {
        this.message = '';
        const value = this.searchForm.value;
        const keys = Object.keys(value);
        let searchFields: any = {};
        keys.forEach((k) => {
            if (value[k]) {
                searchFields = { ...searchFields, ...{ [k]: value[k] } };
            }
        });
        const data = {
            isGlobal: false,
            max: this.pageSize,
            offset: this.pageIndex,
            searchQuery: searchFields,
        };
        this.isSearch2 = true;
        // this.coreService.doRechercher(data, 'users', null).subscribe((response: any) => {
        //         if (response['responseCode'] == this.constantes.HTTP_STATUS.SUCCESSFUL) {
        //             this.isSearch2 = false;
        //             this.datas = response['list'];
        //             this.length = response['total'];
        //             if (this.length == 0) {
        //                 this.datas = [];
        //                 this.message = 'Aucun resultat trouvé';
        //             }
        //             this.dataSource = new MatTableDataSource(this.datas);
        //             this._changeDetectorRef.detectChanges();
        //         }
        //     },
        //     (error) => {
        //         this.isSearch2 = false;
        //         this.snackbar.showErrors(error);
        //     }
        // );
    }
    filterList() {
        this.isCollapsed = !this.isCollapsed;
    }
}
