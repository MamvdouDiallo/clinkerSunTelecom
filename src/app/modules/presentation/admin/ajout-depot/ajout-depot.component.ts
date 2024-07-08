import {CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SnackBarService} from 'app/core/auth/snackBar.service';
import {ActivatedRoute} from "@angular/router";
import {MatStepper} from "@angular/material/stepper";
import { CONSTANTES } from '../model/constantes';
import { CoreService } from 'app/core/core.service';
import { models } from '../model/model';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';


@Component({
    selector: 'ajout-depot',
    templateUrl: './ajout-depot.component.html',
    styleUrls: ['./ajout-depot.component.scss'],
    standalone: true,
    imports:[MatError,MatFormField,MatLabel,MatSelect,CommonModule,MatStepper,MatTooltipModule,MatIcon,MatTooltip,MatTooltipModule,ReactiveFormsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AjoutDepotComponent implements OnInit {
    depotForm: UntypedFormGroup;
    @ViewChild('stepper') private myStepper: MatStepper;
    isLoading: boolean = false;
    action: string;
    dialogTitle: string;
    depot: any;
    data: any;
    infos: any;
    lienBrute: any;
    url: any;
    clients: any;
    soldeCompteClient;
    comptesCourants: any;
    offset: number = 0;
    pageSize: number = 10;
    agenceId: any;
    constantes = CONSTANTES;

    naturePieces: any;
    infosPersonne: any;

    isLoader: boolean = false;
    isLoad: boolean = false;
    listeTypeCompte = [];
    simulateData;
    showField = false;
    isSimulate: boolean = false;
    isHidden: boolean = false;
    isCapital: boolean = false;
    clientId: any;
    loader: boolean = false;
    isdisabled: boolean = false;
    dialogRef: any;
    periodiciteList = [];
    typeDepoList = [];
    clientList = [];
    selectedList = [];
    selectedItem: any = {};
    soldeCompte: any;
    selectedClient: any;
form: FormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,
        public matDialogRef: MatDialogRef<AjoutDepotComponent>, @Inject(MAT_DIALOG_DATA) _data,
        private snackbar: SnackBarService,
        private route: ActivatedRoute,
     //  private clientServive: ClientVueService,
        private _changeDetectorRef: ChangeDetectorRef,
        private coreService: CoreService,
        private _matDialog: MatDialog,
        public changeDetectorRefs: ChangeDetectorRef
    ) {


        // Set the defaults
        this.action = _data.action;
        this.data = _data;
        //@ts-ignore
        this.lienBrute = this.route.snapshot._routerState.url;
        const lien = this.lienBrute.substring(1, this.lienBrute.length);
        const currentLag = 'fr';
        this.infos = models[lien + '-' + currentLag];
        this.clientId = this.coreService.decriptDataToLocalStorage('CD-@--119');
        this.agenceId = this.coreService.decriptDataToLocalStorage('CD-@2');
        if (this.action === this.constantes.TYPEACTION.EDIT) {
            this.dialogTitle = 'Modifier un dépôt';
            if (this.infos?.url ==='depot-terme'){
                this.depot = _data.fields;
            }else{
                this.depot = _data.depot;
            }
            this.depotForm = this.fillForm(this.depot);
        } else if (this.action === this.constantes.TYPEACTION.NEW) {
            this.dialogTitle = 'Ajouter un dépôt';
            this.depotForm = this.initForm();
        }

    }

    ngOnInit(): void {
        // this.initForm();
        // this.getListClient();
        // this.getListNaturePieces();
        // this.getListTypeDepot();
        // this.getListPeriodicite('DAT');
        // this.getTypeCompte();
    }


    initForm(): UntypedFormGroup {

        return this.formBuilder.group({
            typeDepotTerme: ['', [Validators.required]],
            taux: [this.selectedTaux, [Validators.required]],
            client: ['', [Validators.required]],
            soldeCompte: ['', [Validators.required], {disabled: true}],
            periodiciteCalculInteret: ['', [Validators.required]],
            nbreMois: ['', [Validators.required]],
            capitalInitial: ['', [Validators.required]],
            dateDebut: ['', {disabled: true}],
            dateFin: ['', {disabled: true}],
            montantCumuleInteret: ['', {disabled: true}],
            recapitalisationInteret: ['',],
            motifEpargne: ['test',],
        });
    }

    rechercheNumCompte(client) {
        const numClient = client;
        const data = {
            'max': 10,
            'offset': 0,
            'search': numClient
        };
        const clie = numClient.toString();
        const taille = clie.length;

        if (taille >= 3) {
            this.coreService.addItem(data, 'rechercher_client')
                .subscribe((response) => {
                    if (response['responseCode'] === 200) {
                        this.clients = response['data'];
                        this.changeDetectorRefs.markForCheck();
                    }
                });
        }
    }

    // @ts-ignore
    fillForm(depot): UntypedFormGroup {
        this.clients = [depot?.client];
        this.getSolde(depot.client?.id);
        return this.formBuilder.group({
            id: [depot?.id],
            typeDepotTerme: [depot?.typeDepotTerme?.id, Validators.required],
            taux: [depot?.taux, [Validators.required]],
            client: [depot?.client?.id, [Validators.required]],
            soldeCompte: [this.soldeCompte, [Validators.required]],
            periodiciteCalculInteret: [depot?.periodiciteCalculInteret?.code, [Validators.required]],
            nbreMois: [depot?.nbreMois, [Validators.required]],
            capitalInitial: [depot?.capitalInitial, [Validators.required]],
            dateDebut: [depot?.dateDebut, {disabled: true}],
            dateFin: [depot?.dateFin, []],
            montantCumuleInteret: [depot?.montantCumuleInteret,],
            recapitalisationInteret: [depot?.recapitalisationInteret,],
            motifEpargne: [depot?.motifEpargne,],
        });
    }

    simulation(stepper?: MatStepper) {
        this.isLoad = true;

        this.isHidden = true;
        const data = {
            "typeDepotTerme": this.depotForm.get('typeDepotTerme').value,
            "taux": this.depotForm.get('taux').value,
            "nbreMois": this.depotForm.get('nbreMois').value,
            "periodiciteCalculInteret": this.depotForm.get('periodiciteCalculInteret').value,
            "capitalInitial": this.depotForm.get('capitalInitial').value,
            "recapitalisationInteret": false

        }
        this.selectedTaux = data.taux;
        this.coreService.addItem(data, 'depot-terme/simuler')
            .subscribe((response) => {
                if (response) {
                    this.isLoad = false;
                    this.isHidden = false;
                    this.simulateData = response;
                    this.simulateData['taux'] = this.selectedTaux || '';
                    const dateDebutControl = this.depotForm.get('dateDebut');
                    const dateFinControl = this.depotForm.get('dateFin');
                    const montantCumuleInteretControl = this.depotForm.get('montantCumuleInteret');
                    if(dateDebutControl){
                        dateDebutControl.setValue(this.simulateData?.dateDebut);
                        dateDebutControl.disable({onlySelf: true});
                    }
                    if(dateFinControl){
                        dateFinControl.setValue(this.simulateData?.dateFin);
                        dateFinControl.disable({onlySelf: true});
                    }
                    if(montantCumuleInteretControl){
                        montantCumuleInteretControl.setValue(this.simulateData?.montantCumuleInteret);
                        montantCumuleInteretControl.disable({onlySelf: true});
                    }
                    this.changeDetectorRefs.markForCheck();
                    stepper.next();
                }
            }, (error) => {
                this.snackbar.showErrors(error);
                this.isLoad = false;
                this.isSimulate = false;
                this.isHidden = false;
                this.changeDetectorRefs.markForCheck();
            });

    }
    verificationSolde(event?) {
        if (event) {
            const numClient = event['term'] ? event['term'] : event;
            this.rechercheNumCompte(numClient);
        }

    }
    getSolde(evt){
        let foundClient = this.clients.find(clt=> clt.id==evt);
        let idCompte = foundClient && foundClient.comptesCourants ? foundClient.comptesCourants[0].id : null
        if (idCompte){
            this.coreService.getSoldes( 'get-solde?compteId=' + idCompte)
                .subscribe((response) => {
                    if (response['responseCode'] === 200) {
                        this.soldeCompte = response['data']['soldeIndicatif'];
                    }});
        }else{
            this.snackbar.openSnackBar('Ce client n\'a pas de compte courant', 'OK', ['mycssSnackbarRed']);
            this.soldeCompte = 0;
        }

    }

    getListTypeDepot() {
        this.coreService.list('type-depot-terme', 0, 10)
            .subscribe((response) => {
                if (response['data']) {
                    this.typeDepoList = response['data'];
                }
            });
    }

    getListPeriodicite(categorie) {
        this.coreService.listv2('get-periodicites?'+ categorie, 0, 10)
            .subscribe((response) => {
                if (response) {
                    this.periodiciteList = response;
                }
            });
    }

    getCompteCourant(select?) {
        // this.isLoader=true;
        // this.selectedClient = this.clientList.find(item => item.id === select);
        // this.coreService.listv2('comptes?clientId=' + this.selectedClient?.id, this.offset, 10).subscribe((resp) => {
        //     if (resp['responseCode'] == this.constantes.HTTP_STATUS.SUCCESSFUL) {
        //         this.isLoading = false;
        //         this.isLoader=false;
        //         const data = resp[this.constantes.RESPONSE_DATA];
        //         const foundAccount = data.find(el => el.typeCompte?.code === '010' || el.typeCompte?.libelle == 'Compte Courant');
        //         this.selectedList = [foundAccount];
        //         this.soldeCompte = foundAccount?.soldeIndicatif;
        //         this.changeDetectorRefs.detectChanges();
        //     } else {
        //         this.isLoading = false;
        //         this.isLoader=false;
        //     }
        // }, () => {
        //     this.isLoading = false;
        //     this.isLoader=false;
        // });
    }

    //cette fonction permet de verifier si le formulaire est valid ou pas
    checkRecap(type) {
        // if (this.depotForm.invalid) {
        //     this.checkValidity(this.depotForm);
        // } else {
        if (type == 'new') {
            this.ajoutDepot();
        } else if (type == 'edit') {
            this.modifierDepot();
        }
        // }
    }

    onSelectionChange(selectedItemId: any) {
        this.selectedItem = this.typeDepoList.find(item => item.id == selectedItemId);
        const tauxControl = this.depotForm.get('taux');
        if (this.selectedItem) {
            const tauxValue = this.selectedItem['taux'];
            this.selectedTaux = tauxValue;
            if (!this.selectedItem.tauxASaisir) {
                tauxControl.setValue(tauxValue);
                tauxControl.disable({onlySelf: true});
            } else {
                this.selectedTaux = '';
                tauxControl.setValue('');
                tauxControl.enable({onlySelf: true});
                tauxControl.reset();
            }
        }
    }

    retour() {
        this.isHidden = true
    }

    checkingTaux(ev) {
        let taux = ev.target.value
        if (this.selectedItem?.tauxASaisir === true && (taux < this.selectedItem.tauxMin || taux > this.selectedItem.tauxMax)) {
            this.snackbar.openSnackBar('Le taux doit être compris entre ' + this.selectedItem.tauxMin + ' et ' + this.selectedItem.tauxMax, 'OK', ['mycssSnackbarRed']);
        }
    }
    checkNbreMois(ev) {
        let mois = ev.target.value
        if (mois < this.selectedItem.nbreMoisMin || mois > this.selectedItem.nbreMoisMax) {
            this.isdisabled = true;
            this.snackbar.openSnackBar('Le nombre de mois doit être compris entre ' + this.selectedItem.nbreMoisMin + ' et ' + this.selectedItem.nbreMoisMax, 'OK', ['mycssSnackbarRed']);
        }else {
            this.isdisabled = false;
        }
    }

    checkCapital(evt) {
        this.isLoader=true;
        this.isCapital = false
        if (this.depotForm) {
            let min = this.selectedItem?.montantMin;
            let max = this.selectedItem?.montantMax;
            let capital = this.depotForm.get('capitalInitial').value;
                if (capital && capital < min || capital > max) {
                this.snackbar.openSnackBar('Le montant doit être compris entre ' + min + ' et ' + max, 'OK', ['mycssSnackbarRed']);
                this.isCapital = true;
            }
            setTimeout(() => {
                this.isLoader=false;
            }, 2000);
        }
    }

    getTypeCompte() {
        this.isLoading = true;
        this.coreService.list('type-compte', 0, 100)
            .subscribe((response) => {
                if (response['responseCode'] == 200) {
                    this.isLoading = false;
                    this.listeTypeCompte = response['data'].filter(el => el.categorieCompte?.code === 'EPARGNE');
                    this.changeDetectorRefs.markForCheck();
                }
            }, (error) => {
                this.snackbar.showErrors(error);
                this.isLoading = false;
                this.changeDetectorRefs.markForCheck();
            });
    }

    getListClient() {
        if (this.infos?.url === 'depot-terme') {
            this.coreService.list('clients-agence/' + this.agenceId?.id, 0, 100).subscribe((response) => {
                    // if (response['responseCode'] === this.constantes.HTTP_STATUS.SUCCESSFUL) {
                    //     let clients = response['data'].filter(el => el.statut === 'VALIDE');
                    //     this.clientList = clients
                    // }
                },
                (error) => {
                    this.snackbar.showErrors(error);
                }
            );
        } else if (this.infos?.url !== 'depot-terme') {
            this.coreService.list('clients-agence/' + this.agenceId?.id, 0, 100)
                .subscribe(
                    (response) => {
                        // if (response['responseCode'] === this.constantes.HTTP_STATUS.SUCCESSFUL) {
                        //     this.processClientData(response['data']);
                        //     let clients = response['data'].filter(el => el.id === this.clientId?.id);

                        //     this.clientList = clients
                        //     // let clientField = this.depotForm.get('client')
                        //     // if (clientField) {
                        //     //     clientField.setValue(this.clientList[0].id);
                        //     //     // clientField.disable({onlySelf: true});
                        //     //     this.getCompteCourant();
                        //     // }
                        // }
                    },
                    (error) => {
                        this.snackbar.showErrors(error);
                    }
                );
        }
    }

    processClientData(data: any[]) {
        this.clients = data.filter(client => client.typeClient?.typePersonne === 'PP');

        this.changeDetectorRefs.markForCheck();
    }


    //cette fonction permet de verifier les champs obligatoires
    selectedTaux :any;
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


    ajoutDepot(): void {
        this.isLoading = false;
        this.snackbar.showConfirmation('Voulez-vous vraiment ajouter ce dépôt ?').then((result) => {
            if (result['value'] == true) {
                this.isLoading = true;
                let data = this.depotForm.value
                data['taux'] = data['taux'] || this.simulateData?.taux;
                data['nbreMois'] = Number(data['nbreMois']);
                data['periodiciteCalculInteret'] = data['periodiciteCalculInteret'];
                data['dateDebut'] = this.simulateData?.dateDebut
                data['dateFin'] = this.simulateData?.dateFin
                data['montantCumuleInteret'] = this.simulateData?.montantCumuleInteret
                data['recapitalisationInteret'] = false
                data['taux'] = this.depotForm.get('taux').value;

                // this.clientServive.ajouter('depot-terme', data)
                //     .subscribe(
                //         (response) => {
                //             this.isLoading = true;
                //             this.matDialogRef.close(true);
                //             this.snackbar.openSnackBar('Dépôt ajouté avec succés', 'OK', ['mycssSnackbarGreen']);
                //         },
                //         (error) => {
                //             this.isLoading = false;
                //             this.depotForm.enable();
                //             this.snackbar.showErrors(error);
                //         }
                //     );
            }
        });
    }

    modifierDepot(): void {
        this.isLoading = false;
        this.snackbar.showConfirmation('Voulez-vous vraiment modifier ce dépôt ?').then((result) => {
            if (result['value'] == true) {
                this.isLoading = true;
                let data = this.depotForm.value;
                data['nbreMois'] = Number(data['nbreMois']);
                data['periodiciteCalculInteret'] = data['periodiciteCalculInteret'];
                data['dateDebut'] = this.simulateData?.dateDebut
                data['dateFin'] = this.simulateData?.dateFin
                data['montantCumuleInteret'] = this.simulateData?.montantCumuleInteret
                // this.clientServive.modifierDAt(data)
                //     .subscribe(
                //         (response) => {
                //             if (response[this.constantes.RESPONSE_CODE] === this.constantes.HTTP_STATUS.SUCCESSFUL) {
                //                 this.isLoading = true;
                //                 this.matDialogRef.close(true);
                //                 this.snackbar.openSnackBar('Dépôt modifié avec succés', 'OK', ['mycssSnackbarGreen']);
                //             }

                //         },
                //         (error) => {
                //             this.isLoading = false;
                //             this.depotForm.enable();
                //             this.snackbar.showErrors(error);
                //         }
                //     );
            }
        });
    }

    getListNaturePieces() {
        this.coreService.list('nature-piece', 0, 10)
            .subscribe((response) => {
                if (response['responseCode'] === 200) {
                    this.naturePieces = response['data'];
                }
            });
    }


    getInfosPersonne() {
        const naturePiece = this.depotForm.get('naturePiece').value;
        const numeroPiece = this.depotForm.get('numeroPiece').value;
        this.loader = true;
        // this.clientServive.getInfos(naturePiece, numeroPiece)
        //     .subscribe((response) => {
        //         if (response['responseCode'] === 200 && response['data'].length != 0) {
        //             this.infosPersonne = response['data'];
        //             this.showField = true;
        //             this.loader = false;
        //         }
        //     }, (error) => {
        //         this.openModalPersonnePhysique();
        //         this.loader = false;
        //     });
    }


    openModalPersonnePhysique() {
        // this.dialogRef = this._matDialog.open(AjoutPersonnePhysiqueComponent, {
        //     panelClass: 'event-form-dialog',
        //     disableClose: true,
        //     width: '50rem',
        //     height: 'auto',
        //     data: {
        //         canAdd: false,

        //     }
        // });
        this.dialogRef.afterClosed().subscribe((resp) => {
            if (resp) {
                this.depotForm.get('naturePiece').setValue(resp?.naturePiece?.id);
                this.depotForm.get('numeroPiece').setValue(resp?.numeroPiece);
                this.getInfosPersonne();
                this.changeDetectorRefs.detectChanges();
            }
        });
    }


}
