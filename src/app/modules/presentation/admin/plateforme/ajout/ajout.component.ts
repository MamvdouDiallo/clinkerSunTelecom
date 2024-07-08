import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseValidators } from '@fuse/validators';
import { SnackBarService } from 'app/core/auth/snackBar.service';
//import {RolesService} from 'app/modules/presentation/admin/roles/roles.service';
//import {UtilisateurService} from 'app/modules/presentation/admin/utilisateur/utilisateur.service';
//import {CONSTANTES} from '../../../model/constantes';
//import {IUtilisateur} from '../../utilisateur.model';
import { NavigationExtras, Router } from '@angular/router';
import { CoreService } from 'app/core/core.service';
import { CONSTANTES } from '../../model/constantes';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
//import {CoreService} from "app/core/core/core.service";

@Component({
    selector: 'app-ajout',
    templateUrl: './ajout.component.html',
    standalone: true,
    imports: [AngularMaterialModule, CommonModule],
    styleUrls: ['./ajout.component.scss'],
})
export class AjoutComponent implements OnInit {
    emailPattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    utilisateurForm: FormGroup;
    isLoading: boolean = false;
    action: string;
    dialogTitle: string;
    utilisateur: any;
    eventNumber: any;
    hasPhoneError: boolean;
    isFocus: unknown;
    hasPhoneError2: boolean;
    isFocus2: unknown;
    roles: Array<any> = [];
    profile;
    constantes = CONSTANTES;
    doubleAuths = [
        { name: 'OUI', value: true },
        { name: 'NON', value: false },
    ];
    ng2TelOptions;
    basicInfoForm: FormGroup;
    fb: any;

    constructor(
        private formBuilder: FormBuilder,
        // private utilisateurService: UtilisateurService,
        public matDialogRef: MatDialogRef<AjoutComponent>,
        @Inject(MAT_DIALOG_DATA) _data,
        private snackbar: SnackBarService,
        private router: Router,
        private coreService: CoreService // private roleService: RolesService
    ) {
        // Set the defaults
        this.ng2TelOptions = { initialCountry: 'sn' };
        this.action = _data.action;
        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier une platforme';
            //this.utilisateur = _data.data;
            //  this.utilisateurForm = this.fillForm(this.utilisateur);
        } else if (this.action === 'new') {
            this.dialogTitle = 'Ajouter une plateforme';
            this.utilisateurForm = this.initForm();
        }
    }

    // ngOnInit(): void {
    //     this.initForm();
    //     this.ListRole();
    // }

    ngOnInit(): void {
        this.basicInfoForm = this.formBuilder.group({
            code: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            site_web: [
                '',
                [Validators.required, Validators.pattern('https?://.+')],
            ],
            libelle: ['', Validators.required],
            logo: ['', Validators.required]
        });
    }
    get code() {
        return this.basicInfoForm.get('code');
    }
    get email() {
        return this.basicInfoForm.get('email');
    }
    get siteWeb() {
        return this.basicInfoForm.get('site_web');
    }
    get libelle() {
        return this.basicInfoForm.get('libelle');
      }

      get logo() {
        return this.basicInfoForm.get('logo');
      }
      imageSrc: string | ArrayBuffer | null = null;
      onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
          const file = input.files[0];
          const reader = new FileReader();

          reader.onload = () => {
            this.imageSrc = reader.result;
            this.basicInfoForm.patchValue({
              logo: file
            });
          };

          reader.readAsDataURL(file);
        }
      }

    initForm(): FormGroup {
        return this.formBuilder.group(
            {
                firstName: ['', [Validators.required]],
                lastName: ['', [Validators.required]],
                telephone: ['', [Validators.required]],
                username: ['', [Validators.required]],
                email: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(this.emailPattern),
                    ],
                ],
                password: [
                    '',
                    [
                        Validators.minLength(12),
                        Validators.required,
                        Validators.pattern(
                            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{11,}'
                        ),
                    ],
                ],
                confirmpassword: [
                    '',
                    [
                        Validators.minLength(12),
                        Validators.required,
                        Validators.pattern(
                            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{11,}'
                        ),
                    ],
                ],
                role: ['', [Validators.required]],
                useOTP: [false, [Validators.required]],
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'confirmpassword'
                ),
            }
        );
    }

    fillForm(utilisateur): UntypedFormGroup {
        return this.formBuilder.group({
            code: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            site_web: [
                '',
                [Validators.required, Validators.pattern('https?://.+')],
            ],
        });
    }

    //cette fonction permet de verifier si le formulaire est valid ou pas
    checkRecap(type) {
        if (this.utilisateurForm.invalid || this.hasPhoneError) {
            this.checkValidity(this.utilisateurForm);
        } else {
            if (type == 'new') {
                this.ajoutUtilisateur();
            } else if (type == 'edit') {
                this.modifierUtilisateur();
            }
        }
    }

    //cette fonction permet de verifier les champs obligatoires
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

    ajoutUtilisateur(): void {
        this.snackbar
            .showConfirmation('Voulez-vous vraiment ajouter cet utilisateur ?')
            .then((result) => {
                if (result['value'] == true) {
                    this.isLoading = true;
                    this.utilisateurForm.disable();
                    delete this.utilisateurForm.value.confirmpassword;
                    const value = { ...this.utilisateurForm.value };
                    delete value.role;
                    // this.utilisateurService.ajoutUtilisateurs(value)
                    //     .subscribe(
                    //         (response) => {
                    //             if (response['responseCode'] == this.constantes.HTTP_STATUS.SUCCESSFUL) {
                    //                 const data = {
                    //                     'user': response[this.constantes.RESPONSE_DATA]['id'],
                    //                     'role': this.utilisateurForm.get('role').value
                    //                 };
                    //                 this.utilisateurService.attacheUserRole(data).subscribe(
                    //                     (response) => {
                    //                         if (response) {
                    //                             this.isLoading = false;
                    //                             this.matDialogRef.close(true);
                    //                             this.snackbar.openSnackBar('Utilisateur ajouté avec succès !', 'OK', ['mycssSnackbarGreen']);

                    //                             this.coreService.encriptDataToLocalStorage('utilisateurInfos', response['data']);
                    //                             const navigationExtras: NavigationExtras = {
                    //                                 state: { 'utilisateur': response['data'] }
                    //                             };
                    //                             this.router.navigate(['admin/profile-utilisateur/'+ response['data']?.id], navigationExtras);
                    //                         }

                    //                     },
                    //                     (error) => {
                    //                         this.isLoading = false;
                    //                         this.utilisateurForm.enable();
                    //                         this.snackbar.showErrors(error);
                    //                     });
                    //             }

                    //         },
                    //         (error) => {
                    //             // Re-enable the form
                    //             this.isLoading = false;
                    //             this.utilisateurForm.enable();
                    //             this.snackbar.showErrors(error);
                    //         }
                    //     );
                }
            });
    }

    modifierUtilisateur(): void {
        this.snackbar
            .showConfirmation('Voulez-vous vraiment modifier cet utilisateur ?')
            .then((result) => {
                if (result['value'] == true) {
                    this.isLoading = true;
                    // Return if the form is invalid
                    if (this.utilisateurForm.invalid) {
                        return;
                    }
                    // Disable the form
                    this.utilisateurForm.disable();
                    // Ajout Role
                    //     this.utilisateurService.modifierUtilisateurs(this.utilisateurForm.value)
                    //         .subscribe(
                    //             (response) => {
                    //                 this.isLoading = false;
                    //                 this.matDialogRef.close(true);
                    //                 this.snackbar.openSnackBar('Cet utilisateur a été modifié avec succès !', 'OK', ['mycssSnackbarGreen']);

                    //                 this.coreService.encriptDataToLocalStorage('utilisateurInfos', response['data']);
                    //                 const navigationExtras: NavigationExtras = {
                    //                     state: { 'utilisateur': response['data'] }
                    //                 };
                    //                 this.router.navigate(['admin/profile-utilisateur/'+ response['data']?.id], navigationExtras);

                    //             },
                    //             (error) => {
                    //                 // Re-enable the form
                    //                 this.isLoading = false;
                    //                 this.utilisateurForm.enable();
                    //                 this.snackbar.showErrors(error);
                    //             }
                    //         );
                }
            });
    }
}
