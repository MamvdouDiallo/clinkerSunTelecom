import { Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTES } from '../model/constantes';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from 'app/core/core.service';
import { SnackBarService } from 'app/shared/snackBar.service';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';
import { EnteteComponent } from 'app/shared/entete/entete.component';
import { MatAccordion } from '@angular/material/expansion';
import { ListComponent } from './list/list.component';
import { AddOperateurComponent } from './add/add.component';

@Component({
    selector: 'app-operateur',
    standalone: true,
    imports: [AngularMaterialModule, EnteteComponent, ListComponent],
    providers: [DatePipe],
    templateUrl: './operateur.component.html',
    styleUrl: './operateur.component.scss',
})
export class OperateurComponent implements OnInit {
    rechercherGlobal($event: any) {
        throw new Error('Method not implemented.');
    }
    exportAs($event: any) {
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
        private datePipe: DatePipe,
        private _router: Router,
        private route: ActivatedRoute,
        private fb: UntypedFormBuilder,
        private snackbar: SnackBarService
    ) {}
    ngOnInit(): void {}

    ajoutUtilisateur(): void {
        this.snackbar.openModal(
            AddOperateurComponent,
            '50rem',
            'new',
            '',
            '',
            '',
            () => {
                //  this.listeUtilisateur();
            }
        );
    }
}
