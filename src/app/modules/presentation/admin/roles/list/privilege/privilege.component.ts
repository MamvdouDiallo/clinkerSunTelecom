import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackBarService } from 'app/core/auth/snackBar.service';
import { RolesService } from 'app/modules/presentation/admin/roles/roles.service';
import { CONSTANTES } from '../../../model/constantes';


@Component({
    selector: 'app-privilege',
    templateUrl: './privilege.component.html',
    styleUrls: ['./privilege.component.scss']
})
export class PrivilegeComponent implements OnInit {
    profilForm: UntypedFormGroup;
    privilegeOld: boolean = false;
    privilegesOld: any = [];
    dialogTitle: string;
    profiles: any;
    roleName: any;
    privileges: any = [];
    loaderVisiblerole: boolean = false;
    desactiverButton: boolean = false;
    constantes = CONSTANTES;


    constructor(
        public matDialogRef: MatDialogRef<PrivilegeComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: UntypedFormBuilder,private router: Router,
        private _inventoryService: RolesService,
        private snackbar: SnackBarService
        ) {
        this.roleName = _data.data.authority;
        if (_data.dataOther.data.length != 0) {
            this.privilegeOld = true;
            this.privilegesOld = _data.dataOther.data[0].privileges;
            this.dialogTitle = 'Modifier les priviléges pour  '+ this.roleName;
        } else {
            this.privilegeOld = false;
            this.dialogTitle = 'Ajouter des priviléges pour '+ this.roleName;
        }
        this.profiles = _data.data;
        this.profilForm = this.fillForm(this.profiles);

    }

    ngOnInit(): void {
        this.getRolePrivilege();
    }

    // cette fonction permet d'initier le formulaire
    initForm(): UntypedFormGroup {
        return this._formBuilder.group({
            role: ['', [Validators.required]]
        });
    }


    fillForm(profil): UntypedFormGroup {
        return this._formBuilder.group({
            role: profil.id,
        });
    }

    //cette fonction permet d'afficher les privileges de niveau 1
    PrivilegesNiveau1(privilege, event) {
        privilege.selected = event.target.checked;

        privilege.children.forEach((children) => {
            children.selected = event.target.checked;

            children.children.forEach((child) => {
                child.selected = event.target.checked;

                child.children.forEach((grandchild) => {
                    grandchild.selected = event.target.checked;
                });

            });
        });
    }

    //cette fonction permet d'afficher les privileges de niveau 2
    privilegesNiveau2(child, parent, event) {
        if (event.target.checked) {
            parent.selected = true;
            child.selected = true;
        } else {
            child.selected = event.target.checked;

            let parentCanCheck = false;
            parent.children.forEach((c) => {
                if (c.selected)
                    {parentCanCheck = true;}
            });
            parent.selected = parentCanCheck;
        }
        child.children.forEach((child) => {
            child.selected = event.target.checked;

            child.children.forEach((child) => {
                child.selected = event.target.checked;
            });
        });

    }

    //cette fonction permet d'afficher les privileges de niveau 3
    privilegesNiveau3(grandchild, child, parent, event) {
        if (event.target.checked) {
            grandchild.selected = event.target.checked;
            child.selected = event.target.checked;
            parent.selected = event.target.checked;
        } else {
            grandchild.selected = event.target.checked;

            let childCanCheck = false;
            child.children.forEach((c) => {
                if (c.selected)
                    {childCanCheck = true;}
            });
            child.selected = childCanCheck;

            let mainParentSelected = false;
            parent.children.forEach((c) => {
                if (c.selected)
                    {mainParentSelected = true;}
            });
            parent.selected = mainParentSelected;
        }
        grandchild.children.forEach((children) => {
            children.selected = event.target.checked;
        });
    }

    //cette fonction permet d'afficher les privileges de niveau 4
    privilegesNiveau4(grandchild2, grandchild, parent, mainParent, event) {
        if (event.target.checked) {
            grandchild2.selected = event.target.checked;
            grandchild.selected = event.target.checked;
            parent.selected = event.target.checked;
            mainParent.selected = event.target.checked;
        } else {
            grandchild2.selected = event.target.checked;

            let grandchildCanCheck = false;
            grandchild.children.forEach((c) => {
                if (c.selected)
                    {grandchildCanCheck = true;}
            });
            grandchild.selected = grandchildCanCheck;

            let parentCanCheck = false;
            parent.children.forEach((c) => {
                if (c.selected)
                    {parentCanCheck = true;}
            });
            parent.selected = parentCanCheck;

            let mainParentSelected = false;
            mainParent.children.forEach((c) => {
                if (c.selected)
                    {mainParentSelected = true;}
            });
            mainParent.selected = mainParentSelected;
        }
    }

    //cette fonction permet d'ajouter des privileges pour un role donné
    ajoutPrivilegeByrole(type) {
        let title = '';
        let statut = '';
        if (type == 'edit') {
            title = 'modifier';
            statut = 'modifié';
        } else {
            title = 'ajouter';
            statut = 'ajouté';
        }
        if (this.profilForm.valid) {
            this.snackbar.showConfirmation('Voulez-vous vraiment ' + title + ' les privilèges pour ce rôle').then((result) => {
                if (result['value'] == true) {
                    this.desactiverButton = true;
                    const p = [];
                    p['privileges'] = this.extractPrivilegsIds();
                    const data = {
                        ...this.profilForm.value,
                        ...p
                    };
                    this._inventoryService.ajoutPrivilegeByrole(data).subscribe((response) => {
                        if (response['responseCode'] === 200) {
                            this.desactiverButton = false;
                            this.snackbar.openSnackBar('Profil ' + statut + ' avec succès','OK',['mycssSnackbarGreen']);
                            this.matDialogRef.close();
                        } else {
                            this.desactiverButton = false;
                            this.snackbar.openSnackBar(response['error'][0]['message'],'OK',['mycssSnackbarRed']);
                        }
                    }, (error) => {
                        this.desactiverButton = false;
                        this.snackbar.showErrors(error);
                    });
                }
            });
        } else {
            this.desactiverButton = false;
        }
    }

    //cette fonction permet d'afficher les children
    doTheJob(priv) {
        priv.selected = true;
        priv.children.map((p) => {
            p.selected = true;
            this.doTheJob(p);
        });
    }

    //cette fonction permet de checker les children selectionner
    checkPrivilege(src, ids) {
        src.map((el) => {
            if (ids.includes(el.id)) {
                el.selected = true;
                this.checkPrivilege(el.children, ids);
            }
        });
    }

    //cette fonction permet de recenser l'ensemble privileges checker
    JobForPrivilege(old, tabIDS) {
        old.map((el) => {
            if (!tabIDS.includes(el.id)) {
                tabIDS.push(el.id);
                this.JobForPrivilege(el.children, tabIDS);
            }
        });
    }

    //cette fonction permet de gerer les permissions
    dumpSql() {
        const req = [];
        const d1 = [
            ...this.privileges
        ];
        d1.forEach((p) => {
            req.push('INSERT INTO permissions (id, name, parent_id) VALUES (' + p.id + ', ' + p.name + ', null)');
            p.children.forEach((child) => {
                req.push('INSERT INTO permissions (id, name, parent_id) VALUES (' + child.id + ',' + child.name + ',' + p.id + ' )');
                child.child.forEach((c) => {
                    req.push('INSERT INTO permissions (id, name, parent_id) VALUES (' + c.id + ',' + c.name + ', ' + child.id + ')');
                });
            });
        });
    }

    //cette fonction permet de gerer les children
    extractPrivilegsIds() {
        const privilges = [];
        this.privileges.forEach(function(p) {
            if (p.selected)
                {privilges.push(p.id);}

            if (p && p.children != null && p.children != undefined) {
                p.children.forEach((c) => {
                    if (c.selected)
                        {privilges.push(c.id);}

                    if (c && c.children != null && c.children != undefined) {
                        c.children.forEach((ch) => {
                            if (ch.selected)
                                {privilges.push(ch.id);}

                            if (ch && ch.children != null && ch.children != undefined) {
                                ch.children.forEach((chd) => {
                                    if (chd.selected)
                                        {privilges.push(chd.id);}
                                });
                            }
                        });

                    }
                });
            }
        });

        return privilges;
    }

    //cette fonction permet d'afficher les privileges pour un role
    getRolePrivilege() {
        let result = [];
        this.loaderVisiblerole = true;
        this._inventoryService.listeRolePrivilege().subscribe((resp: any) => {
            if (resp['responseCode'] === this.constantes.HTTP_STATUS.SUCCESSFUL) {

                result = resp[this.constantes.RESPONSE_DATA];

                // result.sort((a, b) => a.libelle.localeCompare(b.libelle));
                result.sort((a, b) => (a.ordre) + (b.ordre));

                if (this.privilegeOld == true) {
                    this.privileges = this.privilegesOld;
                    for (let i = 0; i < this.privileges.length; i++) {
                        this.doTheJob(this.privileges[i]);
                    }
                    const tabIDS = [];
                    const oldTabIDS = [];
                    this.JobForPrivilege(this.privileges, tabIDS);
                    this.JobForPrivilege(resp[this.constantes.RESPONSE_DATA], oldTabIDS);
                    const oldWithFilter = resp[this.constantes.RESPONSE_DATA];
                    this.checkPrivilege(oldWithFilter, tabIDS);
                    this.privileges = [...oldWithFilter];
                    this.loaderVisiblerole = false;
                } else {
                    this.privileges = resp[this.constantes.RESPONSE_DATA];
                    this.loaderVisiblerole = false;
                }

            }
        }, () => {
            this.privileges = result;
            this.loaderVisiblerole = false;
        });
    }

    logout() {
        this.snackbar.openSnackBar('Vous etes déconnecté pour tenir en compte ses privilèges','OK',['mycssSnackbarGreen']);
        localStorage.removeItem('access_token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('la3m');
        localStorage.removeItem('userInfos');
        localStorage.removeItem('CD-1');
        this.router.navigate(['/sign-out']);
      }
}
