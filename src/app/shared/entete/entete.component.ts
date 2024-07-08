import { CommonModule, DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ExportService } from 'app/core/auth/export.service';
import { info } from 'autoprefixer';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'app/core/core.service';
import { SnackBarService } from 'app/core/auth/snackBar.service';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton } from '@angular/material/radio';
import { models } from 'app/modules/presentation/admin/model/model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'entete',
    templateUrl: './entete.component.html',
    styleUrls: ['./entete.component.scss'],
    standalone: true,
    imports: [MatIcon, CommonModule,MatCheckbox,MatRadioButton,ReactiveFormsModule,FormsModule],
    providers: [ExportService, DatePipe],
    animations: fuseAnimations,
})
export class EnteteComponent implements OnInit {
    @Input() entete: string;
    @Input() hasSearch: boolean;
    @Input() Provision: boolean;
    @Input() typeCredit: boolean;
    @Input() DateCredit: boolean;
    @Input() grandLivre: boolean;
    @Input() isGlobal: boolean;
    @Input() DateComptable: boolean;
    @Input() agence: boolean;
    @Input() isNotAgence: boolean = false;
    @Input() periodeFilter: boolean;
    @Input() hasSearchCritere: boolean;
    @Input() hasExport: boolean;
    @Input() hasExportGL: boolean;
    @Input() hasAjout: boolean;
    @Input() importExtourne: boolean;
    @Input() hasUploadTemplate: boolean;
    @Output() rechercherGlobal = new EventEmitter<any>();
    @Output() isTypecre = new EventEmitter<any>();
    @Output() rechercherCritere = new EventEmitter<any>();
    @Output() exportPDF = new EventEmitter<any>();
    @Output() exportPDFGL = new EventEmitter<any>();
    @Output() addItem = new EventEmitter<any>();
    @Output() doSearchCredit = new EventEmitter<any>();
    @Output() typingResult = new EventEmitter<any>();
    @Output() doSearchCrComp = new EventEmitter<any>();
    isLoading: boolean = false;
    img;
    image;
    rechercher = '';
    numeroCompteGeneral;
    debutCompte;
    finCompte;
    isSearch: boolean = false;
    exporter: boolean = false;
    dateStart = new Date();
    dateEnd = new Date();
    dateComptabl = new Date();
    agenceId;
    dateDebut = new Date();
    minDateDebut = new Date();
    type = 'tous';
    typeCred = 'actif';
    templateDeclaration = 'assets/excel/paiementSalaire.xlsx';
    agences = [];
    informations: any;
    compteGenerales = [];
    lienBrute = '';
    /**
     * Constructor
     */
    constructor(
        private coreService: CoreService,
        private snackbar: SnackBarService,
        private route: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        //@ts-ignore
        this.lienBrute = this.route.snapshot._routerState.url;
        const lien = this.lienBrute.substring(1, this.lienBrute.length);
        const currentLag = 'fr';

        this.informations = models[lien + '-' + currentLag];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this.img = this.coreService.decriptDataToLocalStorage('CD-@--11');
        // this.image = 'url(' + this.img + ')';
        // this.dateStart = this.coreService.decriptDataToLocalStorage('DC-@--1');
        // this.dateEnd = this.coreService.decriptDataToLocalStorage('DC-@--1');
        // this.dateComptabl = this.coreService.decriptDataToLocalStorage('DC-@--1');
        // this.agenceId = this.coreService.decriptDataToLocalStorage('CD-@2');
        // this.myAgences();
        // this.compteGeneral();
        this.img = '';
        this.image = '';
        this.dateStart = new Date('12-12-2015');
        this.dateEnd = new Date('12-12-2015');
        this.dateComptabl = new Date('12-12-2015');
        this.agenceId = new Date('12-12-2015');
        // this.myAgences();
        // this.compteGeneral();
    }

    myAgences() {
        this.coreService.list('agence', 0, 10000).subscribe(
            (response) => {
                if (response['responseCode'] === 200) {
                    this.agences = response['data'];
                    this.agenceId = this.agenceId['id'];
                    this._changeDetectorRef.markForCheck();
                }
            },
            (error) => {}
        );
    }
    compteGeneral() {
        this.coreService.list('compte-general', 0, 10000).subscribe(
            (response) => {
                if (response['responseCode'] === 200) {
                    this.compteGenerales = response['data'];
                }
            },
            (error) => {}
        );
    }

    onFileChange(evt: any) {
        // const target: DataTransfer = <DataTransfer>evt.target;
        // if (target.files.length > 1) {
        //     alert("L'importation multiple n'est pas autorisée");
        //     return;
        // } else {
        //     const reader: FileReader = new FileReader();
        //     reader.onload = (e: any) => {
        //         const bstr: string = e.target.result;
        //         const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        //         const wsname = wb.SheetNames[0];
        //      //   const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        //       //  const data: any[][] = XLSX.utils.sheet_to_json(ws, {
        //             header: 1,
        //         });
        //         const tableHtml = this.generateTableHtml(data);
        //         swal.fire({
        //             title: 'Aperçu des données',
        //             html: `${tableHtml}`,
        //             icon: 'info',
        //             cancelButtonText: 'Annuler',
        //             confirmButtonText: 'Valider',
        //             showCancelButton: true,
        //             // reverseButtons: true,
        //             customClass: {
        //                 container: 'custom-swal-modal',
        //             },
        //         }).then((result) => {
        //             if (result.value) {
        //                 // this.desactiverButton = true;
        //                 const dataFile = new FormData();
        //                 dataFile.append('fichier', target.files[0]);

        //                 // this.id = this.donnees?.id;
        //                 this.coreService.addFileExtourne(dataFile).subscribe(
        //                     (resp) => {
        //                         if (resp['responseCode'] === 200) {
        //                             this.snackbar.openSnackBar(
        //                                 'Fichier importé avec succés !',
        //                                 'OK',
        //                                 ['mycssSnackbarGreen']
        //                             );
        //                         } else {
        //                             this.snackbar.openSnackBar(
        //                                 resp['message'],
        //                                 'OK',
        //                                 ['mycssSnackbarRed']
        //                             );
        //                         }
        //                     },
        //                     (error) => {
        //                         this.snackbar.showErrors(error);
        //                     }
        //                 );
        //             }
        //         });
        //     };
        //     reader.readAsBinaryString(target.files[0]);
        }


    generateTableHtml(data: any[][]): string {
        if (data.length === 0) {
            return '<p>Aucune donnée à afficher.</p>';
        }
        const headers = data[0];
        const rows = data.slice(1);
        const tableHtml = `
        <head>
        <style>
        #customers {
          font-family: Arial, Helvetica, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }

        #customers td, #customers th {
          /*border: 1px solid #ddd;*/
          padding: 8px;
        }

        #customers tr:nth-child(even){background-color: #f2f2f2;}

        #customers tr:hover {background-color: #ddd;}

        #customers th {
          padding-top: 12px;
          padding-bottom: 12px;
          /*text-align: left;*/
          background-color: #1d3a64;
          color: white;
        }
        </style>
        </head>
        <table border="1" id="customers">
            <thead>
                <tr>
                    ${headers
                        .map(
                            (header) =>
                                `<th style="text-transform: capitalize">${header}</th>`
                        )
                        .join('')}
                </tr>
            </thead>
            <tbody>
                ${rows
                    .map(
                        (row, index) =>
                            `<tr><td>${row[0]}</td>${row
                                .slice(1)
                                .map((cell) => `<td>${cell}</td>`)
                                .join('')}</tr>`
                    )
                    .join('')}
            </tbody>
        </table>
    `;

        return tableHtml;
    }

    isTyping(evt) {
        this.typingResult.emit(evt.isTrusted);
    }
    isTypecredit() {
        this.isTypecre.emit(this.typeCred);
    }

    doSearch() {
        if (this.periodeFilter) {

            const data = {
                startDate: this.dateStart,
                endDate: this.dateEnd,
                searchQuery: this.rechercher,
            };
            this.rechercherGlobal.emit(data);
        } else {
            alert('sinon')
            this.rechercherGlobal.emit(this.rechercher);
        }
    }

    doSearchCritere() {
        this.rechercherCritere.emit();
    }

    doExport(type) {
        this.exporter = true;
        this.exportPDF.emit(type);
        this.exporter = false;
    }
    doExportGL(type) {
        this.exporter = true;
        this.exportPDFGL.emit(type);
        this.exporter = false;
    }

    doAddItems() {
        this.addItem.emit();
    }

    InitialDateFin() {
        this.dateDebut = this.dateStart;
        if (!this.dateDebut) {
            this.dateDebut = new Date();
        } else {
            this.minDateDebut = new Date(this.dateDebut);
        }
    }

    filterData() {
        let data;
        if (!this.grandLivre) {
            data = {
                startDate: this.dateStart,
                dateEnd: this.dateEnd,
                type: this.type,
                isNotAgence: this.isNotAgence,
            };
        } else if (this.grandLivre) {
            data = {
                startDate: this.dateStart,
                dateEnd: this.dateEnd,
                debutCompte: this.debutCompte,
                finCompte: this.finCompte,
                isNotAgence: this.isNotAgence,
            };
        }
        this.doSearchCredit.emit(data);
    }

    filterDataComptable() {
        let data = {
            date: this.dateComptabl,
            agence: this.agenceId,
        };
        this.doSearchCrComp.emit(data);
    }

    protected readonly info = info;
    logg(){
        console.log('====================================');
        console.log("hhh");
        console.log('====================================');
    }
}
