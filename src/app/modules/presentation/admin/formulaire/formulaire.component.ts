import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { SnackBarService } from 'app/core/auth/snackBar.service';
import { FormGeneratorService } from 'app/core/auth/toFormGroup.service';
//import {CoreService} from 'app/core/core/core.service';
import * as moment from 'moment';
import { CONSTANTES } from '../model/constantes';
//import {ClientVueService} from "../../client-vue/client-vue.service";
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';
import { CoreService } from 'app/core/core.service';
import { RechercheService } from '../recherche/recherche.service';
//import {CompteInterneService} from "../compte-interne/compte-interne.service";

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

@Component({
    selector: 'app-formulaire',
    templateUrl: './formulaire.component.html',
    styleUrls: ['./formulaire.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularMaterialModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.Emulated,
})
export class FormulaireComponent implements OnInit {
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
        ],
    };
    public isLinear = true;
    // isChecked = true;
    todayExpiration = moment();
    today = new Date();
    ageNormal;
    min;
    max;
    searchForm: UntypedFormGroup;
    formules: any = [];
    searchList: any;
    action: string;
    data: any;
    fileName: string = '';
    fileSelected;
    errorFile = 'Veuillez choisir le logo';
    infos: any;
    listeCompte: any;
    ifosModifs: any;
    url: any;
    clientList: any;
    listePeriodicite = [
        { name: 'Mensuelle', id: '1' },
        { name: 'Trimestrielle', id: '3' },
        {
            name: 'Semestrielle',
            id: '6',
        },
        { name: 'Annuelle', id: '12' },
        { name: 'A Terme', id: '13' },
    ];

    selectedList: any;
    soldeCompte: any;
    selectedClient;
    typeDepotList: any;
    swalTitle: string;
    isFocus: unknown;
    isFocus2: unknown;
    id: number;
    lists: any = [];
    form: any = [];
    dialogTitle: string;
    initialForm: UntypedFormGroup;
    firstFormGroup: UntypedFormGroup;
    hasPhoneError: boolean;
    loader = false;
    isTaux = false;
    loaderss = false;
    listItemToCodeItem: any = [];
    comptes: Array<any> = [];
    comptesDebit: Array<any> = [];
    typeReponse = '';
    dialogRef: any;
    infoClient: any;
    infoClientDebit: any;
    compteList: any;
    constantes = CONSTANTES;
    userConnecter;
    labels;
    eventNumber: any;
    isLoading: boolean = false;
    isSimulate: boolean = false;
    currentValue: any;
    countryChange: boolean = false;
    urlList = ['mutuelle', 'agence', 'institution'];
    showGarantie: boolean = false;
    agenceId;
    typeComptList = [];
    regionList = [];
    listAgence;
    interneList;
    listeTypeCompte = [];
    listeTypeComptes = new BehaviorSubject([]);
    listsLocal = [];
    offset: number = 0;
    selectedItem: any;
    taux: any;
    dateFinVirement;
    listComptes: any;
    listCompte: any;
    infosUpdate;
    dateComptable;
    isCheckMontant: boolean = false;
    isDisabled: boolean = false;
    loaderImg = false;
    noImage = '';
    dateCompt;
    pageSize: number = 10;
    constructor(
        private fb: UntypedFormBuilder,
        public matDialogRef: MatDialogRef<FormulaireComponent>,
        @Inject(MAT_DIALOG_DATA) _data,
        private changeDetectorRefs: ChangeDetectorRef,
        private snackbar: SnackBarService,

        //  private compteInterneService: CompteInterneService,
        private toFormGroupService: FormGeneratorService,
        // private clientService: ClientVueService,
        private coreService: CoreService,
        private _matDialog: MatDialog,
        private rechercheService: RechercheService
    ) {
        {
            // Set the defaults
            this.action = _data.action;
            this.data = _data;
            this.infos = _data.information;
            this.url = this.infos.url;
            this.ifosModifs = _data.fields;
            this.swalTitle = this.infos.entete;
            this.id = _data.id;
            this.agenceId = this.coreService.decriptDataToLocalStorage('CD-@2');
            this.infosUpdate =
                this.coreService.decriptDataToLocalStorage('CD-@--121');
            this.dateComptable =
                this.coreService.decriptDataToLocalStorage('DC-@--1');

            this.lists = this.infos.liste;
            this.listsLocal = this.ifosModifs.liste;
            if (this.action === 'edit') {
                this.dialogTitle = 'Modifier' + ' ' + this.infos.entete;
                this.initialForm = this.toFormGroupService.toFormGroup(
                    this.ifosModifs
                );
                // Readonly du code si nous sommes en cas de modification
                if (
                    this.initialForm.get('code') &&
                    this.url != 'categorie-compte'
                ) {
                    this.initialForm.get('code').disable({ onlySelf: true });
                }

                if (this.url === 'parametre-ftp') {
                    this.initialForm
                        .get('confirmPassword')
                        .setValue(this.initialForm.get('password').value);
                }
                if (this.url === 'condition-adhesion') {
                    this.initialForm
                        .get('type')
                        .setValue(this.infosUpdate.typeProduit.code);
                }

                if (this.url === 'banque' || this.url === 'institution') {
                    this.fileSelected = this.initialForm.get('logo').value;
                }
                if (this.url === 'templates') {
                    if (this.initialForm.get('formatMessageSms').value) {
                        this.initialForm.get('typeMessage').setValue('sms');
                    } else if (
                        this.initialForm.get('formatMessageEmail').value != null
                    ) {
                        this.initialForm.get('typeMessage').setValue('mail');
                    }
                }

                // start
                if (!this.infos.isFeminin) {
                    this.typeReponse = this.infos.reponse + ' modifié ';
                } else {
                    this.typeReponse = this.infos.reponse + ' modifiée ';
                }
                // end

                // typeCompte
                if (this.url === 'type-compte') {
                    for (const field of this.ifosModifs) {
                        if (field.name == 'soldeMinimum' && field.value == 0) {
                            this.initialForm.get('soldeMinimum').setValue(0);
                        }
                    }
                }
                // part social
                if (this.url === 'type-client') {
                    for (const field of this.ifosModifs) {
                        if (field.name == 'partSocial' && field.value == 0) {
                            this.initialForm.get('partSocial').setValue('0');
                        }
                    }
                }

                const typeCompte =
                    this.coreService.decriptDataToLocalStorage('CD-@--121');

                if (this.url === 'get-caisses-by-agence') {
                    this.initialForm
                        .get('typeCompte')
                        .disable({ onlySelf: true });
                    this.initialForm.get('agence').disable({ onlySelf: true });
                    this.initialForm
                        .get('typeCompte')
                        .setValue(typeCompte?.compte?.typeCompte.id);
                }

                if (this.url === 'frais') {
                    for (const field of this.ifosModifs) {
                        if (
                            field.name == 'montantMinFrais' &&
                            field.value == 0
                        ) {
                            this.initialForm.get('montantMinFrais').setValue(0);
                        }
                    }
                }
                if (this.url === 'institution') {
                    this.loaderImg = true;
                    this.noImage = this.initialForm.get('logo').value;
                    setTimeout(() => {
                        this.loaderImg = false;
                        this.changeDetectorRefs.detectChanges();
                    }, 2000);
                }
            } else if (this.action === 'new') {
                this.dialogTitle = 'Ajouter' + ' ' + this.infos.entete;
                this.initialForm = this.toFormGroupService.toFormGroup(
                    this.ifosModifs
                );

                // start
                if (!this.infos.isFeminin) {
                    this.typeReponse = this.infos.reponse + ' ajouté ';
                } else {
                    this.typeReponse = this.infos.reponse + ' ajoutée ';
                }
                // end

                for (const element of this.ifosModifs) {
                    if (element.steppers) {
                        this.firstFormGroup =
                            this.toFormGroupService.toFormGroup3(
                                element.steppers
                            );
                    }
                }

                if (this.url === 'depot-terme') {
                    this.initialForm
                        .get('recapitalisationInteret')
                        .setValue(false);
                }
                if (
                    this.url === 'virements-permanents' &&
                    this.initialForm.get('dateMiseEnPlace')
                ) {
                    this.dateCompt = this.dateComptable;
                }
                if (this.url === 'type-depot-terme') {
                    this.initialForm.get('tauxASaisir').setValue(false);
                }
                this.initialForm.reset();
            }
            this.userConnecter =
                this.coreService.decriptDataToLocalStorage('CD-@--5');
        }
    }

    ngOnInit(): void {
        this.getListFormulaire();
        // this.getCompte();
        // this.getTypeCompte();
        // this.getRegion();
        // // this.listeCompteInterne(this.agenceId.id);
        // this.getAgence();
        // this.listeClient();
        // this.listeTypeDepot();
        // this.todayExpiration = moment().subtract(18, 'years');
        // if(this.initialForm.get('dateMiseEnPlace')) {
        //     this.initialForm.get('dateMiseEnPlace').setValue(this.dateComptable);
        //     this.initialForm.get('dateMiseEnPlace').disable({onlySelf: true})
        // }
    }

    // cette fonction permet de verifier si le formulaire est valid ou pas
    checkRecap(type) {
        if (this.initialForm.invalid || this.hasPhoneError) {
            this.loaderss = true;
            this.checkValidity(this.initialForm);
        } else {
            this.loaderss = false;
            if (type == 'new') {
                this.addItems();
            } else if (type == 'edit') {
                this.updateItems();
            } else if (type == 'simuler') {
                this.updateItems();
            }
        }
    }
    getCompteInterne(evt) {
        this.listeCompteInterne(evt);
    }
    listeCompteInterne(agenceId) {
        // this.isLoading = true;
        // const data = {
        //     'categorieCompte': this.constantes.COMPTE_TYPE.INTERNE,
        //     'agenceId': agenceId,
        //     'max':this.pageSize,
        //     'offset':this.offset
        // };
        // this.compteInterneService.comptes(data).subscribe((resp) => {
        //     if (resp['responseCode'] == this.constantes.HTTP_STATUS.SUCCESSFUL) {
        //         this.isLoading = false;
        //         // this.dataSource = new MatTableDataSource(resp[this.constantes.RESPONSE_DATA]);
        //         this.interneList = resp[this.constantes.RESPONSE_DATA];
        //         // this.length = resp['total'];
        //         // this.dataSource.paginator = this.paginator;
        //         // this.dataSource.sort = this._sort;
        //         // this._changeDetectorRef.markForCheck();
        //     } else {
        //         this.isLoading = false;
        //         // this.dataSource = new MatTableDataSource();
        //         // this._changeDetectorRef.markForCheck();
        //     }
        // }, (error) => {
        //     this.isLoading = false;
        //     this.snackbar.showErrors(error);
        //     // this._changeDetectorRef.markForCheck();
        // });
    }
    selectList(field, list) {
        if (field === 'produit') {
            this.checkFormule();
        }
    }

    listeClient() {
        this.isLoading = true;
        this.coreService
            .list('clients-agence/' + this.agenceId?.id, this.offset, 10)
            .subscribe(
                (resp) => {
                    if (
                        resp['responseCode'] ==
                        this.constantes.HTTP_STATUS.SUCCESSFUL
                    ) {
                        this.isLoading = false;
                        const data = resp[this.constantes.RESPONSE_DATA].filter(
                            (el) => el.statut === 'VALIDE'
                        );
                        this.clientList = data;
                        this.changeDetectorRefs.detectChanges();
                    } else {
                        this.isLoading = false;
                    }
                },
                () => {
                    this.isLoading = false;
                }
            );
    }

    getCompteCourant(select) {
        this.selectedClient = this.clientList.find(
            (item) => item.id === select
        );
        this.coreService
            .listv2(
                'comptes?clientId=' + this.selectedClient.id,
                this.offset,
                10
            )
            .subscribe(
                (resp) => {
                    if (
                        resp['responseCode'] ==
                        this.constantes.HTTP_STATUS.SUCCESSFUL
                    ) {
                        this.isLoading = false;
                        const data = resp[this.constantes.RESPONSE_DATA];
                        this.selectedList = data.filter(
                            (el) => el.typeCompte?.code === '200'
                        );
                        this.soldeCompte = this.selectedList[0].soldeCompte;
                        this.changeDetectorRefs.detectChanges();
                    } else {
                        this.isLoading = false;
                    }
                },
                () => {
                    this.isLoading = false;
                }
            );
    }

    changeLibelle(evt) {
        let selectLib = this.initialForm.get('periodiciteCalculInteret').value;
        if (this.url === 'depot-terme' && selectLib == 1) {
            this.labels = 'Mois';
        } else if (this.url === 'depot-terme' && selectLib == 3) {
            this.labels = 'Mois';
        } else if (this.url === 'depot-terme' && selectLib == 6) {
            this.labels = 'Mois';
        } else if (this.url === 'depot-terme' && selectLib == 12) {
            this.labels = "d'annees";
        }
    }

    onSelectionChange(selectedItemId: any) {
        this.selectedItem = this.typeDepotList.find(
            (item) => item.id === selectedItemId
        );

        if (this.initialForm) {
            if (this.selectedItem.tauxASaisir == false) {
                const tauxValue = this.selectedItem?.taux;
                this.initialForm.get('taux').setValue(tauxValue);
            } else {
                this.initialForm.get('taux').reset();
            }
        }
    }

    checkingTaux(ev) {
        let taux = ev.target.value;
        if (
            this.selectedItem.tauxASaisir == true &&
            (taux < this.selectedItem.tauxMin ||
                taux > this.selectedItem.tauxMax)
        ) {
            this.isTaux = true;
            this.min = this.selectedItem?.tauxMin;
            this.max = this.selectedItem?.tauxMax;
            this.snackbar.openSnackBar(
                'Le taux doit être compris entre ' +
                    this.selectedItem.tauxMin +
                    ' et ' +
                    this.selectedItem.tauxMax,
                'OK',
                ['mycssSnackbarRed']
            );
        } else {
            this.initialForm.get('taux').disable({ onlySelf: true });
        }
    }

    checkCapital(evt) {
        if (this.initialForm) {
            let min = this.selectedItem?.montantMin;
            let max = this.selectedItem?.montantMax;
            let capital = this.initialForm.get('capitalInitial').value;
            if ((capital && capital < min) || capital > max) {
                this.snackbar.openSnackBar(
                    'Le montant doit être compris entre ' + min + ' et ' + max,
                    'OK',
                    ['mycssSnackbarRed']
                );
            }
        }
    }

    checkDateFin(evt) {}

    listeTypeDepot() {
        this.isLoading = true;
        this.coreService.list('type-depot-terme', this.offset, 10).subscribe(
            (resp) => {
                if (resp['data']) {
                    this.isLoading = false;
                    const dataType = resp['data'];
                    this.typeDepotList = dataType;
                    this.changeDetectorRefs.detectChanges();
                } else {
                    this.isLoading = false;
                }
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    getCompte() {
        this.isLoading = true;
        this.changeDetectorRefs.markForCheck();
        this.coreService.list('compte-general', 0, 1000).subscribe(
            (response) => {
                if (response['responseCode'] === 200) {
                    this.isLoading = false;
                    this.listeCompte = response['data'];
                    this.changeDetectorRefs.markForCheck();
                }
            },
            (error) => {
                this.snackbar.showErrors(error);
                this.isLoading = false;
                this.changeDetectorRefs.markForCheck();
            }
        );
    }

    getTypeCompte() {
        this.isLoading = true;
        this.coreService.list('type-compte', 0, 10000).subscribe(
            (response) => {
                if (response['responseCode'] == 200) {
                    this.isLoading = false;
                    this.listeTypeComptes.next(
                        response['data'].filter(
                            (el) => el.categorieCompte?.code === 'EPARGNE'
                        )
                    );
                    this.typeComptList = response['data'];
                    this.changeDetectorRefs.markForCheck();
                }
            },
            (error) => {
                this.snackbar.showErrors(error);
                this.isLoading = false;
                this.changeDetectorRefs.markForCheck();
            }
        );
    }
    getRegion() {
        this.isLoading = true;
        this.coreService.list('region', 0, 100).subscribe(
            (response) => {
                if (response['responseCode'] == 200) {
                    this.isLoading = false;
                    this.regionList = response['data'];
                    this.changeDetectorRefs.markForCheck();
                }
            },
            (error) => {
                this.snackbar.showErrors(error);
                this.isLoading = false;
                this.changeDetectorRefs.markForCheck();
            }
        );
    }
    getAgence() {
        this.isLoading = true;
        this.coreService.list('agence', 0, 100).subscribe(
            (response) => {
                if (response['responseCode'] == 200) {
                    this.isLoading = false;
                    this.listAgence = response['data'];
                    this.changeDetectorRefs.markForCheck();
                }
            },
            (error) => {
                this.snackbar.showErrors(error);
                this.isLoading = false;
                this.changeDetectorRefs.markForCheck();
            }
        );
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

    // cette fonction permet de checker les champs obligatoires du formulaire
    checkValue(e, formcontrol, list) {
        const type = this.initialForm.get(formcontrol) as UntypedFormArray;
        if (e.target.checked) {
            type.push(new UntypedFormControl(e.target.value));
            list.forEach((elm) => {
                if (elm.value == e.target.value) {
                    elm['checked'] = true;
                }
            });
        } else {
            const index = type.controls.findIndex(
                (x) => x.value === e.target.value
            );
            type.removeAt(index);
            list.forEach((elm) => {
                if (elm.value == e.target.value) {
                    elm['checked'] = false;
                }
            });
        }
    }

    selectOnFile(evt, type, name) {
        this.fileSelected = evt.target.files[0].name;
        let file = evt.target.files[0];

        let accept = [];
        let extension = '';
        if (type === 'logo') {
            accept = ['.png', '.PNG', '.jpg', '.JPG'];
            extension = 'une image';
        }
        for (const file of evt.target.files) {
            const index = file.name.lastIndexOf('.');
            const strsubstring = file.name.substring(index, file.name.length);
            const ext = strsubstring;
            // Verification de l'extension du ficihier est valide
            if (accept.indexOf(strsubstring) === -1) {
                this.snackbar.openSnackBar(
                    'Ce fichier ' + file.name + " n'est " + extension,
                    'OK',
                    ['mycssSnackbarRed']
                );
                return;
            } else {
                // recuperation du fichier et conversion en base64
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    if (type === 'logo') {
                        const img = new Image();
                        img.src = e.target.result;

                        img.onload = () => {
                            const docBase64Path = e.target.result;

                            if (
                                ext === '.png' ||
                                ext === '.PNG' ||
                                ext === '.jpg' ||
                                ext === '.JPG' ||
                                ext === '.jpeg' ||
                                ext === '.JPEG'
                            ) {
                                this.saveFile(file, type, name);
                            }
                        };
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }
    saveFile(file, type, name) {
        let formData = new FormData();
        formData.append('file', file);

        this.loaderImg = true;
        this.changeDetectorRefs.detectChanges();
        const dataFile = { file: file };
        // this.clientService.saveStoreFile('store-file', formData).subscribe((resp) => {
        //     if (resp) {
        //         this.noImage = resp['urlprod'];
        //         this.initialForm.get(name).setValue(this.noImage);
        //         this.loaderImg = false;
        //         this.changeDetectorRefs.detectChanges();
        //         this.snackbar.openSnackBar('Fichier chargé avec succès', 'OK', ['mycssSnackbarGreen']);
        //     }
        // }, (error) => {
        //     this.loaderImg = false;
        //     this.snackbar.showErrors(error);
        // });
    }

    // cette fonction permet de verifier les champs obligatoire
    checkValidity(g: UntypedFormGroup) {
        Object.keys(g.controls).forEach((key) => {
            g.get(key).markAsDirty();
        });
        Object.keys(g.controls).forEach((key) => {
            g.get(key).markAsTouched();
        });
        Object.keys(g.controls).forEach((key) => {
            g.get(key).updateValueAndValidity();
        });
    }

    getListFormulaire(change?, urlChange?) {
        if (change && urlChange) {
            this.rechercheService
                .getListItemByCodeItem(change, urlChange)
                .subscribe((reponse) => {
                    if (reponse['responseCode'] == 200) {
                        for (let item of this.data.fields) {
                            if (
                                item.type == 'select' ||
                                item.type == 'selectMultiple'
                            ) {
                                if (item.dependancy == true) {
                                    item.list = reponse['data'];
                                }
                            }
                        }
                    }
                });
        } else {
            for (let item of this.data.fields) {
                if (item.type == 'select' || item.type == 'selectMultiple') {
                    if (item.dependancy == true) {
                        item.list = this.listItemToCodeItem;
                    } else if (item.title) {
                        for (let field of item.formulaire) {
                            if (field.url != '') {
                                this.rechercheService
                                    .listFormulaire(field.url)
                                    .subscribe((reponse) => {
                                        if (reponse['responseCode'] == 200) {
                                            field.list = reponse['data'];
                                        }
                                    });
                            }
                        }
                    } else {
                        if (item.url != '') {
                            this.rechercheService
                                .listFormulaire(item.url)
                                .subscribe((reponse) => {
                                    if (reponse['responseCode'] == 200) {
                                        item.list = reponse['data'];
                                    }
                                });
                        }
                    }
                }
                if (
                    item.type == 'select-by-linkField' ||
                    item.type == 'selectMultiple'
                ) {
                    let nom = item.linked;
                } else if (item.type == 'select-by-dependance') {
                    if (item.url != '') {
                        this.rechercheService
                            .listFormulaire(item.url)
                            .subscribe((reponse) => {
                                if (reponse['responseCode'] == 200) {
                                    item.list = reponse['data'];
                                }
                            });
                    }
                    // if (item.departementUrl != ''){
                    //   this.rechercheService.listFormulaire(item.dependanceUrl).subscribe(reponse => {
                    //     if (reponse['responseCode'] == 200) {
                    //       let name = item.dependanceName;
                    //       for(let field of this.ifosModifs){
                    //           if(field.name == name){
                    //             field.list = reponse['data'];
                    //           }
                    //       }

                    //     }
                    //   });
                    // }
                }
            }
        }
    }

    checkMontant() {
        this.isCheckMontant = false;
        if (
            this.infos.url == 'penalite-param' &&
            this.initialForm.get('montantMinCredit').value &&
            this.initialForm.get('montantMaxCredit').value
        ) {
            const min = this.initialForm.get('montantMinCredit').value;
            const max = this.initialForm.get('montantMaxCredit').value;

            if (max < min) {
                this.isCheckMontant = true;
                this.snackbar.openSnackBar(
                    'Le montant max doit être superieur au montant min',
                    'OK',
                    ['mycssSnackbarRed']
                );
            } else {
                this.isCheckMontant = false;
                this.loader = false;
            }
        }
        if (this.infos.url == 'type-depot-terme') {
            const minMnt = this.initialForm.get('montantMin').value;
            const maxMnt = this.initialForm.get('montantMax').value;

            if (maxMnt && maxMnt < minMnt) {
                this.snackbar.openSnackBar(
                    'Le montant max doit être superieur au montant min',
                    'OK',
                    ['mycssSnackbarRed']
                );
            } else {
                this.loader = false;
            }
        }
    }

    checkTaux() {
        if (this.infos.url === 'type-depot-terme') {
            const tauxMin = this.initialForm.get('tauxMin').value;
            const tauxMax = this.initialForm.get('tauxMax').value;
            if (tauxMax && tauxMax < tauxMin) {
                this.snackbar.openSnackBar(
                    'Le taux max doit être superieur au taux min',
                    'OK',
                    ['mycssSnackbarRed']
                );
            } else {
                this.loader = false;
            }
        }
    }

    private _filter(value: any): string[] {
        const filterValue = value.toLowerCase();

        return this.listItemToCodeItem.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    toggleGarantie(change: any): void {
        this.showGarantie = !this.showGarantie;
        if (this.url == 'type-depot-terme') {
            const taux = this.initialForm?.get('tauxASaisir')?.value == true;
            if (!taux) {
                this.initialForm.get('tauxMin')?.setValue('');
                this.initialForm.get('tauxMax')?.setValue('');
                // this.clearValidatorsMethode(this.initialForm, ['tauxMin','tauxMax']);
            } else {
                this.initialForm.get('taux')?.setValue('');
            }
        }
    }

    checkToggle() {
        const taux = this.initialForm?.get('tauxASaisir')?.value;
        if (!taux) {
            this.clearValidatorsMethode(this.initialForm, [
                'tauxMin',
                'tauxMax',
            ]);
        } else {
            this.setValidatorsMethode(this.initialForm, ['tauxMin', 'tauxMax']);
        }
    }

    clearValidatorsMethode(form, tab) {
        for (const key in form.controls) {
            if (tab.indexOf(key) != -1) {
                form.get(key).clearValidators();
                form.get(key).updateValueAndValidity();
            }
        }
    }

    // cette fonction de checker les champs obligatoires du formulaire
    setValidatorsMethode(form, tab) {
        for (const key in form.controls) {
            if (tab.indexOf(key) != -1) {
                form.get(key).setValidators(Validators.required);
                form.get(key).updateValueAndValidity();
            }
        }
    }

    getCompteEmet(evt?) {
        if (this.comptes.length != 0) {
            this.infoClient = this.comptes.filter((el) => el.id == evt);
            this.compteList = this.infoClient[0].comptesCourants;
        }
    }

    verification(event?) {
        if (event) {
            const numCompte = event['term'];
            this.rechercheNumCompte(numCompte);
        }
    }
    verifications(event?) {
        if (event) {
            const numCompte = event['term'];
            this.rechercheNumComptes(numCompte);
        }
    }

    getCompteRecep(evt?) {
        if (this.comptes.length != 0) {
            this.infoClient = this.comptes.filter((el) => el.id == evt);
            this.listCompte = this.infoClient[0].comptesCourants;
            // this.initialForm.get('clientDebiteur').reset()
        }
    }
    getCompteDebit(evt?) {
        if (this.comptesDebit.length != 0) {
            this.infoClientDebit = this.comptesDebit.filter(
                (el) => el.id == evt
            );
            this.listComptes = this.infoClientDebit[0].comptesCourants;
        }
    }

    rechercheNumCompte(comptes) {
        const numCompte = comptes;
        const data = {
            max: 10,
            offset: 0,
            search: numCompte,
        };
        const compte = numCompte.toString();
        const taille = compte.length;

        if (taille >= 3) {
            this.coreService
                .getElement(this.agenceId?.id, 'clients-agence')
                .subscribe((response) => {
                    if (response['responseCode'] === 200) {
                        this.comptesDebit = response['data'];
                        this.changeDetectorRefs.markForCheck();
                    }
                });
        }
    }
    rechercheNumComptes(comptes) {
        const numCompte = comptes;
        const data = {
            max: 10,
            offset: 0,
            search: numCompte,
        };
        const compte = numCompte.toString();
        const taille = compte.length;

        if (taille >= 3) {
            this.coreService
                .getElement(this.agenceId?.id, 'clients-agence')
                .subscribe((response) => {
                    if (response['responseCode'] === 200) {
                        this.comptes = response['data'];
                        this.changeDetectorRefs.markForCheck();
                    }
                });
        }
    }

    // cette fonction permet d'ajouter
    addItems() {
        this.snackbar
            .showConfirmation(
                'Voulez-vous vraiment ajouter ' + this.infos.typeEntity + ' ?'
            )
            .then((result) => {
                if (result['value'] == true) {
                    this.loader = true;
                    const value = this.initialForm.value;
                    this.coreService.addItem(value, this.url).subscribe(
                        (resp) => {
                            if (resp) {
                                this.loader = false;
                                this.matDialogRef.close(resp);
                                this.snackbar.openSnackBar(
                                    this.typeReponse + 'avec succés',
                                    'OK',
                                    ['mycssSnackbarGreen']
                                );
                            } else {
                                this.loader = false;
                                this.snackbar.openSnackBar(
                                    resp['cause']['message'],
                                    'OK',
                                    ['mycssSnackbarRed']
                                );
                            }
                        },
                        (error) => {
                            this.loader = false;
                            this.loader = false;
                            this.snackbar.showErrors(error);
                        }
                    );
                }
            });
    }

    // cette fonction permet de modifier
    updateItems() {
        if (this.infos.url == 'type-attribut') {
            if (!this.initialForm.get('estObligatoire').value) {
                this.initialForm.get('estObligatoire').setValue(false);
            }
        }

        if (this.infos.url == 'get-caisses-by-agence') {
            this.url = 'creer-caisse';
        }
        if (this.infos.url == 'programme') {
            if (
                this.initialForm.get('tauxEntree').value == 0 ||
                this.initialForm.get('tauxEntree').value == undefined
            ) {
                this.initialForm.get('tauxEntree').setValue(null);
            }
            if (
                this.initialForm.get('tauxSortie').value == 0 ||
                this.initialForm.get('tauxSortie').value == undefined
            ) {
                this.initialForm.get('tauxSortie').setValue(null);
            }
        }
        this.snackbar.showConfirmation(
            'Voulez-vous vraiment modifier ' + this.infos.typeEntity
        )
        .then((result) => {
            if (result['value'] == true) {
                this.loader = true;
                const value = this.initialForm.value;
                this.coreService.updateItem(value, this.id, this.url).subscribe(
                    (resp) => {
                        if (resp) {
                            this.loader = false;
                            this.matDialogRef.close(resp);

                            this.snackbar.openSnackBar(this.typeReponse + 'avec succés', 'OK', ['mycssSnackbarGreen']);
                        } else {
                            this.loader = false;

                            this.snackbar.openSnackBar(this.infos.reponseUpdate + ' ' + resp['message'], 'OK', ['mycssSnackbarRed']);
                        }
                    },
                    (error) => {
                        this.loader = false;
                        this.loader = false;
                        this.snackbar.showErrors(error);
                    });
        }
        });
    }

    simulation() {
        this.isSimulate = true;
        const data = {
            typeDepotTerme: this.initialForm.get('typeDepoTerme').value,
            taux: this.initialForm.get('taux').value,
            nbreMois: this.initialForm.get('nbreMois').value,
            periodiciteCalculInteret: this.initialForm.get(
                'periodiciteCalculInteret'
            ).value,
            capitalInitial: this.initialForm.get('capitalInitial').value,
            recapitalisationInteret: this.initialForm.get(
                'recapitalisationInteret'
            ).value,
        };
        this.coreService.addItem(data, 'depot-terme/simuler').subscribe(
            (response) => {
                if (response['responseCode'] == 200) {
                    this.isLoading = false;
                    this.isSimulate = false;
                    this.listeTypeCompte = response['data'];
                    this.changeDetectorRefs.markForCheck();
                }
            },
            (error) => {
                this.snackbar.showErrors(error);
                this.isLoading = false;
                this.isSimulate = false;
                this.changeDetectorRefs.markForCheck();
            }
        );
    }

    // cette fonction permet de donner une liste selon un code
    getListItemByCodeItem(item, url, name) {
        const value = this.initialForm.get(item).value;
        this.coreService
            .getListItemByCodeItem(value, url)
            .subscribe((reponse) => {
                if (reponse['responseCode'] == 200) {
                    for (const field of this.ifosModifs) {
                        if (field.name === name) {
                            field.list = reponse['data'];
                        }
                    }
                }
            });
    }

    telInputObject(ev) {}

    getNumber(ev, field, form) {
        this[form].get(field).setValue(ev);
    }

    hasError(ev, field, form) {
        this.hasPhoneError = !ev ? true : false;
        this.currentValue = this[form].get(field).value;
    }

    onCountryChange(event): void {
        this.countryChange = true;
        this.eventNumber = event['dialCode'];
    }

    nextStep(formulaire, stepper: MatStepper, name) {
        let valid = true;
        for (const field of formulaire) {
            if (
                field.isRequired &&
                this.firstFormGroup.controls[name].get(field.name).value == ''
            ) {
                valid = false;
            }
        }
        if (valid == true) {
            stepper.next();
        }
    }

    checkDate(event) {
        if (this.infos.url === 'depot-terme') {
            let debut = this.initialForm.get('dateDebut').value;
            let fin = this.initialForm.get('dateFin').value;
            if (fin && fin < debut) {
                this.snackbar.openSnackBar(
                    'La date de fin doit être supérieure à la date de debut',
                    'OK',
                    ['mycssSnackbarRed']
                );
            }
        }

        const dat: any = moment(event.value).format('YYYY');
        const anneeEnCours = new Date().getFullYear();
        const dateDif = anneeEnCours - dat;
        if (dateDif < 18) {
            this.ageNormal =
                'La date de naissance doit être supérieur ou égale à 18 ans';
        } else {
            this.ageNormal = '';
        }
    }
    checkDateVirement(event) {
        let dateEcheance = moment(
            this.initialForm.get('datePremierEcheance').value,
            'DD/MM/YYYY'
        ).toDate();
        let nombreMois = this.initialForm.get('dureeEnMois').value;
        let dateFin = this.initialForm.get('dateFinVirement');
        let dateMiseEnPlace = moment(this.dateComptable).format('DD/MM/YYYY');
        if (dateEcheance && nombreMois && dateEcheance) {
            this.dateFinVirement = moment(dateEcheance).add(
                Number(nombreMois),
                'month'
            );
            dateFin.setValue(
                moment(this.dateFinVirement, 'DD/MM/YYYY').toDate()
            );
            dateFin.disable({ onlySelf: true });
            this.isDisabled = false;
            if (dateEcheance < moment(dateMiseEnPlace, 'DD/MM/YYYY').toDate()) {
                this.isDisabled = true;
                this.snackbar.openSnackBar(
                    'La date écheance doit être supérieure à la date de mise en place',
                    'OK',
                    ['mycssSnackbarRed']
                );
                dateFin.reset();
                dateFin.enable({ onlySelf: true });
            } else {
                this.isDisabled = false;
            }
        }
    }
}
