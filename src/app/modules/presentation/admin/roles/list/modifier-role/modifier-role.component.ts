import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'app/core/auth/snackBar.service';
import { RolesService } from 'app/modules/presentation/admin/roles/roles.service';
import { UtilisateurService } from 'app/modules/presentation/admin/utilisateur/utilisateur.service';
import { CONSTANTES } from '../../../model/constantes';

@Component({
  selector: 'app-modifier-role',
  templateUrl: './modifier-role.component.html',
  styleUrls: ['./modifier-role.component.scss']
})
export class ModifierRoleComponent implements OnInit {
  roleForm: UntypedFormGroup;
  isLoading: boolean = false;
  action: string;
  dialogTitle: string;
  role: any;
  constantes = CONSTANTES;
  roles: Array<any> = [];
  data;
  utilisateur;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private roleService: RolesService,
    public matDialogRef: MatDialogRef<ModifierRoleComponent>,
    @Inject(MAT_DIALOG_DATA) _data,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private utilisateurService: UtilisateurService,
    private snackbar: SnackBarService,
  ) {
      // Set the defaults
      this.action = _data.action;
      this.dialogTitle = 'Modifier le role';
      this.role = _data.data;

      this.roleForm = this.fillForm(this.role);
      this.route.params.subscribe((params) => {
      this.utilisateur = params['id'];
      });
  }

  ngOnInit(): void {
    this.ListRole();

  }
  fillForm(role): UntypedFormGroup {
    return this.formBuilder.group({
      role: [role.roles.id, Validators.required]
    });
  }

  //cette fonction permet de verifier si le formulaire est valid ou pas
  checkRecap(type) {
    if (this.roleForm.invalid) {
      this.checkValidity(this.roleForm);
    } else {
        this.modifierRole();
    }
  }
   //cette fonction permet d'afficher la liste des roles
   ListRole() {
    this.roleService.getRoles().subscribe((response) => {
      this.roles = response[this.constantes.RESPONSE_DATA];
    });
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

  modifierRole(): void {
    this.snackbar.showConfirmation('Voulez-vous vraiment modifier le role de cet utilisateur ?')
    .then((result) => {

      if (result['value'] == true) {
        this.isLoading = true;
        // Return if the form is invalid
        if (this.roleForm.invalid) {
          return;
        }

        // Disable the form
        this.roleForm.disable();

        const data = {
          'user': this.role.id,
          'role': this.roleForm.get('role').value
        };
        this.utilisateurService.attacheUserRole(data)
          .subscribe(
            (response) => {

              if (response['responseCode'] === this.constantes.HTTP_STATUS.SUCCESSFUL) {
                this.isLoading = false;
                this.matDialogRef.close(response);
                // Set the alert
                this.snackBar.open('role modifié avec succès !', 'OK', {
                  verticalPosition: 'bottom',
                  duration: 2000,
                  panelClass: ['mycssSnackbarGreen']
                });
                // location.reload();
              }

            },
            (error) => {
              // Re-enable the form
              this.isLoading = false;
              this.roleForm.enable();
              // Set the alert
                this.snackbar.showErrors(error);
            }
          );
      }
    });
  }


}
