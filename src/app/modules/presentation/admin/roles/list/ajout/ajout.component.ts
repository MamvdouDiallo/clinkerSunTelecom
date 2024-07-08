import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RolesService } from 'app/modules/presentation/admin/roles/roles.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  IRole } from '../../role.model';
import { CONSTANTES } from '../../../model/constantes';
import { SnackBarService } from 'app/core/auth/snackBar.service';

@Component({
  selector: 'app-ajout',
  templateUrl: './ajout.component.html',
  styleUrls: ['./ajout.component.scss']
})
export class AjoutComponent implements OnInit {
  roleForm: UntypedFormGroup;
  isLoading: boolean = false;
  action: string;
  dialogTitle: string;
  role: IRole;
  constantes = CONSTANTES;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private roleService: RolesService,
    public matDialogRef: MatDialogRef<AjoutComponent>, @Inject(MAT_DIALOG_DATA) _data,
    private snackbar: SnackBarService,
  ) {
    // Set the defaults
    this.action = _data.action;
    if (this.action === this.constantes.TYPEACTION.EDIT) {
      this.dialogTitle = 'Modifier un role';
      this.role = _data.data;
      this.roleForm = this.fillForm(this.role);
    } else if (this.action === this.constantes.TYPEACTION.NEW) {
      this.dialogTitle = 'Ajouter un role';
      this.roleForm = this.initForm();
    }
  }

  ngOnInit(): void {
    this.initForm();

  }
  initForm(): UntypedFormGroup {
    return this.formBuilder.group({
      authority: ['', [Validators.required]]
    });
  }
  fillForm(role: IRole): UntypedFormGroup {
    return this.formBuilder.group({
      id: role['id'],
      authority: [role.authority, Validators.required]
    });
  }

  //cette fonction permet de verifier si le formulaire est valid ou pas
  checkRecap(type) {
    if (this.roleForm.invalid) {
      this.checkValidity(this.roleForm);
    } else {
      if (type == 'new') {
        this.ajoutRole();
      } else if (type == 'edit') {
        this.modifierRole();
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

  ajoutRole(): void {
    this.snackbar.showConfirmation('Voulez-vous vraiment ajouter ce rôle?')
    .then((result) => {
      if (result['value'] == true) {
        // Return if the form is invalid
        if (this.roleForm.invalid) {
          return;
        }
        this.isLoading = true;
        // Disable the form
        this.roleForm.disable();

        // Ajout Role
        this.roleService.ajoutRole(this.roleForm.value)
          .subscribe(
            (response) => {
              if (response['responseCode'] === this.constantes.HTTP_STATUS.SUCCESSFUL) {
                this.isLoading = false;
                this.matDialogRef.close(true);
                this.snackbar.openSnackBar('Rôle ajouté avec succés','OK',['mycssSnackbarGreen']);
              } else {
                this.snackbar.openSnackBar(response['message'],'OK',['mycssSnackbarRed']);
              }

            },
            (error) => {
              // Re-enable the form
              this.isLoading = false;
              this.roleForm.enable();
                this.snackbar.showErrors(error);
            }
          );
      }
    });
  }

  modifierRole(): void {
    this.snackbar.showConfirmation('Voulez-vous vraiment modifier ce role ?').then((result) => {

      if (result['value'] == true) {
        this.isLoading = true;
        // Return if the form is invalid
        if (this.roleForm.invalid) {
          return;
        }

        // Disable the form
        this.roleForm.disable();

        this.roleService.modifierRole(this.roleForm.value)
          .subscribe(
            (response) => {
              if (response['responseCode'] === this.constantes.HTTP_STATUS.SUCCESSFUL) {
                this.isLoading = false;
                this.matDialogRef.close(true);
                this.snackbar.openSnackBar('role modifié avec succès !','OK',['mycssSnackbarGreen']);
              }

            },
            (error) => {
              // Re-enable the form
              this.isLoading = false;
              this.roleForm.enable();
                this.snackbar.showErrors(error);
            }
          );
      }
    });
  }


}
