import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CONSTANTES } from '../../model/constantes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'app/core/core.service';
import { SnackBarService } from 'app/shared/snackBar.service';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ajout-reseau',
    standalone: true,
    imports: [AngularMaterialModule, CommonModule, ReactiveFormsModule],
    templateUrl: './ajout-reseau.component.html',
    styleUrl: './ajout-reseau.component.scss',
})
export class AjoutReseauComponent implements OnInit {
    panelOpenState = false;
    @ViewChild('stepper') private myStepper: MatStepper;
    dialogTitle: string;
    id: string;
    initForm: UntypedFormGroup;
    labelButton: string;
    suffixe: string = 'une personne morale';
    responsables: any;
    naturePersonnesMorales: any;
    statutJuridiques: any;
    countries: any;
    loader: boolean;
    action: string;
    canAdd: boolean;
    constantes = CONSTANTES;
    fields: any;
    dataCheck;
    hasPhoneError: boolean;
    currentValue: any;
    countryChange: boolean = false;
    eventNumber: any;
    isFocus: unknown;
    filteredNaturePersonnesMorales: [];
    ng2TelOptions;
    emailPattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(
        public matDialogRef: MatDialogRef<AjoutReseauComponent>,
        @Inject(MAT_DIALOG_DATA) _data,
        private fb: UntypedFormBuilder,
        private CoreService: CoreService,
        private changeDetectorRefs: ChangeDetectorRef,
        private snackbar: SnackBarService
    ) {
        if (_data?.action == 'new') {
            this.initForms();
            this.labelButton = 'Ajouter ';
        } else if (_data?.action == 'edit') {
            //this.getListResponsables();
            // this.getListStatutJuridique();
            //  this.getListPays();
            // this.getListNaturePersonnesMorales();
            console.log('====================================');
            console.log('log', _data);
            console.log('====================================');
            this.fields = _data.fields;
            console.log('diogs', this.fields);

            this.labelButton = 'Modifier ';
            this.dataCheck = this.fields;
            this.id = _data.fields.id;
            this.initForms(this.fields);
        } else if (_data?.canAdd == false) {
            this.labelButton = 'Ajouter ';
            this.dataCheck = _data.donnees;
            this.initForms();
        }
        this.action = _data?.action;
        this.canAdd = _data.canAdd;
        this.fields = _data.data;
        this.dialogTitle = this.labelButton + this.suffixe;
        this.ng2TelOptions = { initialCountry: 'sn' };
    }

    ngOnInit(): void {
        // this.getListResponsables();
        //this.getListStatutJuridique();
        this.getListPays();
        //this.getListNaturePersonnesMorales();
    }

    goToStep(index) {
        this.myStepper.selectedIndex = index;
    }

    initForms(personneMoral?) {
        this.initForm = this.fb.group({
            description: this.fb.control(
                personneMoral ? personneMoral.description : null,
                [Validators.required]
            ),
            plafond: this.fb.control(
                personneMoral ? personneMoral.plafond : null,
                [Validators.required]
            ),
            decouvert: this.fb.control(
                personneMoral ? personneMoral.decouvert : null,
                [Validators.required]
            ),
            prefix: this.fb.control(
                personneMoral ? personneMoral.prefix : null,
                [Validators.required]
            ),
            isHoraireHandled: this.fb.control(
                personneMoral ? personneMoral?.isHoraireHandled : false,
                [Validators.required]
            ),
            paysOperation: this.fb.control(
                personneMoral ? personneMoral?.paysOperation?.id : null,
                [Validators.required]
            ),
            adresse: this.fb.control(
                personneMoral ? personneMoral?.adresse : null,
                [Validators.required]
            ),
            emailContactPrincipal: this.fb.control(
                personneMoral ? personneMoral?.emailContactPrincipal : null,
                [Validators.required, Validators.email]
            ),

            telephoneContactPrincipal: this.fb.control(
                personneMoral ? personneMoral?.telephoneContactPrincipal : null,
                [Validators.required]
            ),
            emailDoubleValidationUser: this.fb.control(
                personneMoral ? personneMoral?.emailDoubleValidationUser : null,
                [Validators.required, Validators.email]
            ),
            emailDoubleValidationDecouvert: this.fb.control(
                personneMoral
                    ? personneMoral?.emailDoubleValidationDecouvert
                    : null,
                [Validators.required, Validators.email]
            ),
            emailDoubleValidationPlafond: this.fb.control(
                personneMoral
                    ? personneMoral?.emailDoubleValidationPlafond
                    : null,
                [Validators.required, Validators.email]
            ),
            contactPrincipal: this.fb.control(
                personneMoral ? personneMoral?.contactPrincipal : null,
                [Validators.required]
            ),
            isVisibleForWallet: this.fb.control(
                personneMoral ? personneMoral?.isVisibleForWallet : false,
                [Validators.required]
            ),
            isPlancherAuthorised: this.fb.control(
                personneMoral ? personneMoral?.isPlancherAuthorised : false,
                [Validators.required]
            ),
        });
    }

    firstStep() {
        if (
            this.initForm.get('description').invalid ||
            this.initForm.get('adresse').invalid ||
            this.initForm.get('prefix').invalid ||
            this.initForm.get('plafond').invalid ||
            this.initForm.get('isHoraireHandled').invalid ||
            this.initForm.get('paysOperation').invalid ||
            this.initForm.get('decouvert').invalid
        ) {
            return false;
        } else {
            return true;
        }
    }

    getListResponsables() {
        // this.CoreService.list('personne-physique', 0, 10000)
        //     .subscribe((response) => {
        //         this.responsables = response['data'] || response;
        //         this.changeDetectorRefs.markForCheck();
        //     });
    }

    getListNaturePersonnesMorales() {
        this.CoreService.list('nature-personne-morale', 0, 10000).subscribe(
            (response) => {
                if (
                    response['responseCode'] ===
                    this.constantes.HTTP_STATUS.SUCCESSFUL
                ) {
                    this.naturePersonnesMorales = response['data'];
                    this.changeDetectorRefs.markForCheck();
                }
            }
        );
    }

    getListStatutJuridique() {
        this.CoreService.list('statut-juridique', 0, 10000).subscribe(
            (response) => {
                if (
                    response['responseCode'] ===
                    this.constantes.HTTP_STATUS.SUCCESSFUL
                ) {
                    this.statutJuridiques = response['data'];
                    this.filteredNaturePersonnesMorales = this.statutJuridiques;
                    this.changeDetectorRefs.markForCheck();
                }
            }
        );
    }

    getListPays() {
        this.CoreService.list('pays', 0, 10000).subscribe((response) => {
            if (
                response['responseCode'] ===
                this.constantes.HTTP_STATUS.SUCCESSFUL
            ) {
                this.countries = response['data'];
                this.changeDetectorRefs.markForCheck();
            }
        });
    }

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

    addItems() {
        this.snackbar
            .showConfirmation('Voulez-vous vraiment ajouter ce réseau ?')
            .then((result) => {
                if (result['value'] == true) {
                    this.loader = true;
                    this.changeDetectorRefs.markForCheck();
                    const value = this.initForm.value;

                    this.CoreService.addItem(value, 'reseau').subscribe(
                        (resp) => {
                            console.log(resp);

                            if (resp) {
                                this.loader = false;
                                this.changeDetectorRefs.markForCheck();
                                this.matDialogRef.close(resp);
                                this.snackbar.openSnackBar(
                                    'Réseau  ajouté avec succés',
                                    'OK',
                                    ['mycssSnackbarGreen']
                                );
                            } else {
                                this.loader = false;
                                this.changeDetectorRefs.markForCheck();
                            }
                        },
                        (error) => {
                            this.loader = false;
                            this.loader = false;
                            this.snackbar.showErrors(error);
                            console.log('====================================');
                            console.log(error);
                            console.log('====================================');
                        }
                    );
                }
            });
    }

    updateItems() {
        this.snackbar
            .showConfirmation('Voulez-vous vraiment modifier ce réseau ?')
            .then((result) => {
                if (result['value'] == true) {
                    this.loader = true;
                    const value = this.initForm.value;

                    this.CoreService.updateItem(
                        value,
                        this.id,
                        'reseau'
                    ).subscribe(
                        (resp) => {
                            if (resp) {
                                this.loader = false;
                                this.matDialogRef.close(resp);
                                this.snackbar.openSnackBar(
                                    'Réseau modifié avec succés',
                                    'OK',
                                    ['mycssSnackbarGreen']
                                );
                            } else {
                                this.loader = false;
                                this.snackbar.openSnackBar(
                                    resp['message'],
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

    checkRecap(type) {
        if (this.initForm.invalid) {
            this.checkValidity(this.initForm);
        } else {
            if (this.canAdd == false) {
                this.addItems();
            }
            if (type == 'new') {
                this.addItems();
            } else if (type == 'edit') {
                this.updateItems();
            }
        }
    }

    displayField(id, list, champ, isResponsable?) {
        if (isResponsable == true) {
            return (
                id &&
                list?.find((el: any) => el?.id == id)['prenom'] +
                    ' ' +
                    list?.find((el: any) => el?.id == id)['nom']
            );
        } else {
            return id && list?.find((el: any) => el?.id == id)[champ];
        }
    }

    checkListStatutJuridique($event) {
        const code = this.naturePersonnesMorales.find(
            (nature) => nature?.id == $event?.value
        )?.code;

        this.filteredNaturePersonnesMorales = this.statutJuridiques.filter(
            (statut) => statut?.naturePersonneMorale == code
        );
    }
}
