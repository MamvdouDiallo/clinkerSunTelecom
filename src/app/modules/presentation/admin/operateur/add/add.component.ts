import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';
import { CONSTANTES } from '../../model/constantes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { __metadata } from 'tslib';
import { CoreService } from 'app/core/core.service';
import { SnackBarService } from 'app/shared/snackBar.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-add',
    standalone: true,
    imports: [AngularMaterialModule, AddOperateurComponent, CommonModule],
    templateUrl: './add.component.html',
    styleUrl: './add.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddOperateurComponent implements OnInit {
    [x: string]: any;
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
    horizontalStepperForm: UntypedFormGroup;
    verticalStepperForm: UntypedFormGroup;
    ng2TelOptions;
    emailPattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(
        public matDialogRef: MatDialogRef<AddOperateurComponent>,
        @Inject(MAT_DIALOG_DATA) _data,
        private fb: UntypedFormBuilder,
        private CoreService: CoreService,
        private changeDetectorRefs: ChangeDetectorRef,
        private snackbar: SnackBarService,
        private _formBuilder: UntypedFormBuilder
    ) {
        if (_data?.action == 'new') {
            this.initForms();
            this.labelButton = 'Ajouter ';
        } else if (_data?.action == 'edit') {
            // this.getListResponsables();

            this.getListStatutJuridique();
            this.getListPays();
            this.getListNaturePersonnesMorales();
            this.fields = _data.fields;
            console.log('====================================');
            console.log(this.fields);
            console.log('====================================');
            this.labelButton = 'Modifier ';
            this.dataCheck = this.fields;
            // this.id = _data.data.id;
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
        // Initialize the recap fields
        this.recapFields = [
            {
                label: 'Code opérateur du transfert',
                value: this.initForm.get('code').value,
            },
            {
                label: 'Plateforme technique',
                value: this.initForm.get('plateforme').value,
            },
            {
                label: "Labelle de l'opérateur",
                value: this.initForm.get('labelle').value,
            },
            { label: 'Adresse', value: this.initForm.get('adresse').value },
            { label: 'Email', value: this.initForm.get('email').value },
            { label: 'Ville', value: this.initForm.get('ville').value },
            { label: 'Site web', value: this.initForm.get('site').value },
            { label: 'Téléphone', value: this.initForm.get('telephone').value },
            {
                label: 'Code devise',
                value: this.initForm.get('code_devise').value,
            },
            {
                label: "Gestion de l'espace client",
                value: this.initForm.get('gestion').value,
            },
            {
                label: 'Représentant légal',
                value: this.initForm.get('responsable').value,
            },
            { label: 'Pays', value: this.initForm.get('pays').value },
            // Additional recap fields
            {
                label: 'Lancement batch automatique',
                value: this.initForm.get('choix').value,
            },
            {
                label: 'Contact principal',
                value: this.initForm.get('contactPrincipal').value,
            },
            {
                label: 'Email du contact Principal',
                value: this.initForm.get('emailContactPrincipal').value,
            },
            {
                label: 'Téléphone du contact principal',
                value: this.initForm.get('telephoneContactPrincipal').value,
            },
            {
                label: 'Code établissement SMS',
                value: this.initForm.get('codeEtabSms').value,
            },
            {
                label: 'Code service SMS',
                value: this.initForm.get('codeSerSms').value,
            },
            {
                label: 'Activation du cryptage',
                value: this.initForm.get('activationCriptage').value,
            },
        ];
        this.countries = [
            { id: 1, nom: 'France' },
            { id: 2, nom: 'Senegal' },
        ];
    }

    ngOnInit(): void {
        // this.getListResponsables();
        // this.getListStatutJuridique();
        // this.getListPays();
        // this.getListNaturePersonnesMorales();
        this.horizont();
    }

    goToStep(index) {
        this.myStepper.selectedIndex = index;
    }

    initForms(personneMoral?) {
        this.initForm = this.fb.group({
            code: this.fb.control(personneMoral ? personneMoral.code : null, [
                Validators.required,
            ]),
            plateforme: this.fb.control(
                personneMoral ? personneMoral.plateforme_technique : null,
                [Validators.required]
            ),
            labelle: this.fb.control(
                personneMoral ? personneMoral.labelle : null,
                [Validators.required]
            ),
            adresse: this.fb.control(
                personneMoral ? personneMoral.adresse : null,
                [Validators.required]
            ),
            email: this.fb.control(personneMoral ? personneMoral.email : null, [
                Validators.required,
            ]),
            site: this.fb.control(
                personneMoral ? personneMoral.site_web : null,
                [Validators.required]
            ),
            telephone: this.fb.control(
                personneMoral ? personneMoral.téléphone : null,
                [Validators.required]
            ),
            code_devise: this.fb.control(
                personneMoral ? personneMoral.code_devise_alpha : null,
                [Validators.required]
            ),
            gestion: this.fb.control(
                personneMoral ? personneMoral.gestion_espace_client : null,
                [Validators.required]
            ),

            contactPrincipal: this.fb.control(
                personneMoral ? personneMoral.contact_principal : null,
                [Validators.required]
            ),
            emailContactPrincipal: this.fb.control(
                personneMoral ? personneMoral.email_contact_principal : null,
                [Validators.required]
            ),
            telephoneContactPrincipal: this.fb.control(
                personneMoral
                    ? personneMoral.telephone_contact_principal
                    : null,
                [Validators.required]
            ),
            codeEtabSms: this.fb.control(
                personneMoral ? personneMoral.code_etablissement_sms : null,
                [Validators.required]
            ),
            codeSerSms: this.fb.control(
                personneMoral ? personneMoral.code_service_sms : null,
                [Validators.required]
            ),
            activationCriptage: this.fb.control(null, [Validators.required]),
            choix: this.fb.control(null, [Validators.required]),
            dateConstitution: this.fb.control(
                personneMoral ? personneMoral.dateConstitution : null,
                [Validators.required]
            ),

            statutJuridique: this.fb.control(
                personneMoral ? personneMoral?.statutJuridique?.id : null,
                [Validators.required]
            ),
            responsable: this.fb.control(
                personneMoral ? personneMoral?.responsable?.id : null,
                [Validators.required]
            ),
            capital: this.fb.control(
                personneMoral ? personneMoral.capital : null,
                []
            ),
            pays: this.fb.control(personneMoral ? personneMoral.pays : null, [
                Validators.required,
            ]),
            // pays: this.fb.control(
            //     personneMoral ? personneMoral?.pays?.id : null,
            //     [Validators.required]
            // ),
            ville: this.fb.control(personneMoral ? personneMoral.ville : null, [
                Validators.required,
            ]),
            // adresse: this.fb.control(personneMoral ? personneMoral?.adresse : null, [Validators.required] ),
            // phoneCode: this.fb.control(
            //     personneMoral ? personneMoral?.phoneCode : 221,
            //     []
            // ),
            phoneNumber: this.fb.control(
                personneMoral ? personneMoral?.phoneNumber : null,
                [Validators.required]
            ),
            // email: this.fb.control(
            //     personneMoral ? personneMoral?.email : null,
            //     [Validators.pattern(this.emailPattern)]
            // ),
        });
    }

    firstStep() {
        if (
            this.initForm.get('code').invalid ||
            this.initForm.get('plateforme').invalid ||
            this.initForm.get('labelle').invalid ||
            this.initForm.get('adresse').invalid ||
            this.initForm.get('email').invalid ||
            this.initForm.get('ville').invalid ||
            this.initForm.get('telephone').invalid ||
            this.initForm.get('site').invalid ||
            this.initForm.get('code_devise').invalid ||
            this.initForm.get('gestion').invalid

            //  this.initForm.get('statutJuridique').invalid ||
            //   this.initForm.get('siegeSocial').invalid
        ) {
            return false;
        } else {
            return true;
        }
    }

    secondStep() {
        if (
            this.initForm.get('contactPrincipal').invalid ||
            this.initForm.get('emailContactPrincipal').invalid ||
            this.initForm.get('telephoneContactPrincipal').invalid ||
            this.initForm.get('codeSerSms').invalid ||
            this.initForm.get('codeEtabSms').invalid

            //  this.initForm.get('statutJuridique').invalid ||
            //   this.initForm.get('siegeSocial').invalid
        ) {
            return false;
        } else {
            return true;
        }
    }

    // getListResponsables() {
    //     this.CoreService.list('personne-physique', 0, 10000).subscribe(
    //         (response) => {
    //             this.responsables = response['data'] || response;
    //             this.changeDetectorRefs.markForCheck();
    //         }
    //     );
    // }

    getListNaturePersonnesMorales() {
        // this.CoreService.list('nature-personne-morale', 0, 10000)
        //     .subscribe((response) => {
        //         if (response['responseCode'] === this.constantes.HTTP_STATUS.SUCCESSFUL) {
        //             this.naturePersonnesMorales = response['data'];
        //             this.changeDetectorRefs.markForCheck();
        //         }
        //     });
    }

    getListStatutJuridique() {
        this.CoreService.list('statut-juridique', 0, 10000);
        // .subscribe((response) => {
        //     if (response['responseCode'] === this.constantes.HTTP_STATUS.SUCCESSFUL) {
        //         this.statutJuridiques = response['data'];
        //         this.filteredNaturePersonnesMorales = this.statutJuridiques;
        //         this.changeDetectorRefs.markForCheck();
        //     }
        // });
    }

    getListPays() {
        // this.CoreService.list('pays', 0, 10000)
        //     .subscribe((response) => {
        //         if (response['responseCode'] === this.constantes.HTTP_STATUS.SUCCESSFUL) {
        //             this.countries = response['data'];
        //             this.changeDetectorRefs.markForCheck();
        //         }
        //     });
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
        // this.snackbar
        //     .showConfirmation(
        //         'Voulez-vous vraiment ajouter cette personne morale ?'
        //     )
        //     .then((result) => {
        //         if (result['value'] == true) {
        //             this.loader = true;
        //             this.changeDetectorRefs.markForCheck();
        //             const value = this.initForm.value;
        //             if (!this.countryChange) {
        //                 value['phoneCode'] =
        //                     this.initForm.get('phoneCode').value;
        //                 value['phoneNumber'] =
        //                     this.initForm.get('phoneNumber').value;
        //             } else {
        //                 value['phoneCode'] = this.eventNumber;
        //                 value['phoneNumber'] = this.currentValue;
        //             }
        //             this.CoreService.addItem(
        //                 value,
        //                 'personne-morale'
        //             ).subscribe(
        //                 (resp) => {
        //                     if (resp) {
        //                         this.loader = false;
        //                         this.changeDetectorRefs.markForCheck();
        //                         this.matDialogRef.close(resp);
        //                         this.snackbar.openSnackBar(
        //                             'Personne morale ajoutée avec succés',
        //                             'OK',
        //                             ['mycssSnackbarGreen']
        //                         );
        //                     } else {
        //                         this.loader = false;
        //                         this.changeDetectorRefs.markForCheck();
        //                     }
        //                 },
        //                 (error) => {
        //                     this.loader = false;
        //                     this.loader = false;
        //                     this.snackbar.showErrors(error);
        //                 }
        //             );
        //         }
        //     });
    }

    updateItems() {
        this.snackbar
            .showConfirmation(
                'Voulez-vous vraiment modifier cette personne morale ?'
            )
            .then((result) => {
                if (result['value'] == true) {
                    this.loader = true;
                    const value = this.initForm.value;

                    this.CoreService.updateItem(
                        value,
                        this.id,
                        'personne-morale'
                    ).subscribe(
                        (resp) => {
                            if (resp) {
                                this.loader = false;
                                this.matDialogRef.close(resp);
                                this.snackbar.openSnackBar(
                                    'Personne morale modifiée avec succés',
                                    'OK',
                                    ['mycssSnackbarGreen']
                                );
                            } else {
                                this.loader = false;
                                //this.snackbar.openSnackBar(resp['message'],'OK',['mycssSnackbarRed']);
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

    recapFields: { label: string; value: any }[];

    horizont() {
        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
                country: ['', Validators.required],
                language: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                userName: ['', Validators.required],
                about: [''],
            }),
            step3: this._formBuilder.group({
                byEmail: this._formBuilder.group({
                    companyNews: [true],
                    featuredProducts: [false],
                    messages: [true],
                }),
                pushNotifications: ['everything', Validators.required],
            }),
        });

        // Vertical stepper form
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
                country: ['', Validators.required],
                language: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                userName: ['', Validators.required],
                about: [''],
            }),
            step3: this._formBuilder.group({
                byEmail: this._formBuilder.group({
                    companyNews: [true],
                    featuredProducts: [false],
                    messages: [true],
                }),
                pushNotifications: ['everything', Validators.required],
            }),
        });
    }
}
