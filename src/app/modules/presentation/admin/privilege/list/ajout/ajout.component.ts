import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PrivilegeService} from 'app/modules/presentation/admin/privilege/privilege.service';
import {SnackBarService} from 'app/core/auth/snackBar.service';

@Component({
    selector: 'app-ajout',
    templateUrl: './ajout.component.html',
    styleUrls: ['./ajout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AjoutPrivilegeComponent implements OnInit {
    listNiveaux = [{name: '1', value: 1}, {name: '2', value: 2}, {name: '3', value: 3}, {name: '4', value: 4}];
    listIcons = [{name: 'directions_car', value: 'directions_car'}, {
        name: 'airplanemode_active',
        value: 'airplanemode_active'
    }, {name: 'list', value: 'list'}, {name: 'add_circle', value: 'add_circle'}, {
        name: 'check',
        value: 'check'
    }, {name: 'person', value: 'person'}, {name: 'people', value: 'people'}, {
        name: 'local_hospital',
        value: 'local_hospital'
    }, {name: 'email', value: 'email'}, {name: 'add_shopping_cart', value: 'add_shopping_cart'}, {
        name: 'cloud_upload',
        value: 'cloud_upload'
    }, {name: 'engineering', value: 'engineering'}, {name: 'account_tree', value: 'account_tree'}, {
        name: 'settings',
        value: 'settings'
    }, {name: 'warehouse', value: 'warehouse'}, {name: 'maps_home_work', value: 'maps_home_work'}, {
        name: 'home',
        value: 'home'
    }, {name: 'how_to_reg', value: 'how_to_reg'}, {name: 'cancel', value: 'cancel'}, {name: 'lock', value: 'lock'},
        {name: 'calculate', value: 'calculate'}, {name: 'payment', value: 'payment'}, {name: 'move_to_inbox', value: 'move_to_inbox'}, {name: 'credit_score', value: 'credit_score'}];
    userConnecte; // utilisateur actuellement connecté
    displayError = false;
    action: string;
    dialogTitle: string;
    privilege;
    eventForm: UntypedFormGroup;
    desactiverButton = false;
    roles: any = [];
    privileges: any = [];
    currentPrivileges: any = [];
    loader: boolean = false;
    comparMoteur: boolean;
    textPassword: string = '';
    passwordNoMatch: boolean = false;

    constructor(
        private fb: UntypedFormBuilder,
        public matDialogRef: MatDialogRef<AjoutPrivilegeComponent>,
        private privilegeService: PrivilegeService,
        @Inject(MAT_DIALOG_DATA) _data,
        private snackbar: SnackBarService,
    ) {
        {
            // Set the defaults
            this.action = _data.action;

            if (this.action === 'edit') {
                this.dialogTitle = 'Modifier un privilège';
                this.privilege = _data.data;
                this.eventForm = this.fillForm(this.privilege);
            } else if (this.action === 'new') {
                this.dialogTitle = 'Ajouter un privilège';
                this.eventForm = this.initForm();
            }
        }
    }

    fillForm(privilege): UntypedFormGroup {
        return this.fb.group({
            id: privilege['id'],
            code: [privilege.code, Validators.required],
            uri: [privilege.uri],
            libelle: [privilege.libelle, Validators.required],
            niveau: ['' + privilege.niveau, Validators.required],
            lien: [privilege.lien],
            icon: [privilege.icon],
            isMenu: [privilege.isMenu, Validators.required],
            parent_id: [privilege.parent_id],
            ordre: [privilege.ordre],
        });
    }

    ngOnInit(): void {
        this.initForm();
        this.listePrivilege();
    }

    // cette fonction permet d'afficher la liste des privileges dont le niveau est egal a 1 ou 2 ou 3
    listePrivilege(): void {
        const offset = 0;
        const max = 10000000;
        this.privilegeService.getPrivilege(max, offset).subscribe((resp: any) => {
            this.privileges = resp['data'];
            this.privileges = this.privileges.filter(el => el.niveau === 1 || el.niveau === 2 || el.niveau === 3);
            this.checkNiveau();
        });
    }

    // cette fonction permet d'initialiser le formulaire
    initForm(): UntypedFormGroup {
        return this.fb.group({
            code: ['', [Validators.required]],
            libelle: ['', [Validators.required]],
            niveau: ['', [Validators.required]],
            uri: [''],
            lien: [''],
            icon: [''],
            isMenu: ['', [Validators.required]],
            parent_id: [''],
            ordre: ['1']
        });
    }

    // cette fonction permet de verifier si le formulaire est valid ou pas
    checkRecap(type) {
        if (this.eventForm.invalid) {
            this.checkValidity(this.eventForm);
        } else {
            if (type == 'new') {
                this.ajoutPrivilege();
            } else if (type == 'edit') {
                this.modifierPrivilege();
            }
        }
    }

    // cette fonction permet de verifier les champs obligatoires du formulaire
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

    // cette fonction permet d'afficher la liste des privileges selon le niveau choisit
    checkNiveau() {
        const value = parseInt(this.eventForm.get('niveau').value);
        if (value && value != 1) {
            const val = value - 1;
            this.currentPrivileges = this.privileges.filter(elm => elm.niveau == val);
        } else {
            this.currentPrivileges = [];
        }
    }


    // cette fonction permet d'ajouter un privilege
    ajoutPrivilege(): void {
        this.desactiverButton = true;
        if (this.eventForm.valid) {
            this.snackbar.showConfirmation('Voulez-vous vraiment ajouter ce privilège ?').then((result) => {
                if (result['value'] === true) {
                    this.loader = true;
                    const value = this.eventForm.value;
                    value['uri'] = value['uri'] ? !value['uri'].startsWith('/') ? '/' + value['uri'] : value['uri'] : '';
                    this.privilegeService.ajoutPrivilege(value)
                        .subscribe((response) => {
                            if (response) {
                                this.snackbar.openSnackBar('Privilége ajouté avec succés', 'OK', ['mycssSnackbarGreen']);
                                this.loader = false;
                                this.desactiverButton = false;
                                this.matDialogRef.close(true);
                                this.eventForm.reset();
                            } else {
                                this.desactiverButton = false;
                                // this.snackbar.openSnackBar(response['error'][0], 'OK', ['mycssSnackbarRed']);
                                this.loader = false;
                            }
                        }, (error) => {
                            this.desactiverButton = false;
                            this.snackbar.showErrors(error);
                            this.loader = false;
                            this.loader = false;
                        });
                }
            });
        } else {
            this.desactiverButton = false;
            this.loader = false;
        }
    }

    // cette fonction permet de modifier un privilege
    modifierPrivilege(): void {
        if (this.eventForm.valid) {
            this.snackbar.showConfirmation('Voulez-vous vraiment modifier ce privilège ?').then((result) => {
                if (result['value'] === true) {
                    this.loader = true;
                    this.desactiverButton = true;
                    const value = this.eventForm.value;
                    value['uri'] = value['uri'] ? !value['uri'].startsWith('/') ? '/' + value['uri'] : value['uri'] : '';
                    this.privilegeService.modifierPrivilege(value).subscribe(
                        (resp) => {
                            this.loader = false;
                            this.desactiverButton = false;
                            if (resp['responseCode'] === 200) {
                                this.matDialogRef.close(true);
                                this.snackbar.openSnackBar('Privilége modifié avec succés', 'OK', ['mycssSnackbarGreen']);
                            }
                        },
                        (errors) => {
                            this.loader = false;
                            this.desactiverButton = false;
                            this.snackbar.openSnackBar('Eureur survenu lors de la modification d\'un Privilége.', 'OK', ['mycssSnackbarRed']);
                        });
                }
            });
        } else {
            this.displayError = true;
            this.loader = false;
            this.desactiverButton = false;
        }
    }
}
