import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { CoreService } from 'app/core/core.service';
import { CONSTANTES } from 'app/modules/presentation//admin/model/constantes';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';
import { SnackBarService } from 'app/shared/snackBar.service';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [AngularMaterialModule],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
    panelOpenState = false;
    dialogTitle: string;
    currentItem: any;
    attributComplementaires: any = [];
    constantes = CONSTANTES;
    dialogRef: any;

    constructor(
        public matDialogRef: MatDialogRef<DetailComponent>,
        @Inject(MAT_DIALOG_DATA) _data,
        private coreService: CoreService,
        private _changeDetectorRef: ChangeDetectorRef,
        private snackbar: SnackBarService,
        private _matDialog: MatDialog
    ) {
        this.dialogTitle = 'Détails de la personne morale';
        this.currentItem = _data.item;
        this.getAttributComplementaireClient(this.currentItem.id);
    }
    ngOnInit(): void {
        console.log(this.currentItem);
    }

    getAttributComplementaireClient(idPersonnePhysique) {
        // const data = {
        //     'natureAttribut': 'PERSONNE_MORALE',
        //     'referenceObjet': idPersonnePhysique
        // };
        // this.coreService.getAttributComplementaire(data, 'attribut-complementaire/mine').subscribe((resp) => {
        //     if (resp[this.constantes.RESPONSE_CODE] === this.constantes.HTTP_STATUS.SUCCESSFUL) {
        //         this.attributComplementaires = resp[this.constantes.RESPONSE_DATA];
        //         this._changeDetectorRef.markForCheck();
        //     }
        // }, (error) => {
        //     this.snackbar.showErrors(error);
        // });
    }
    ajoutAttributComplementaire(): void {
        // this.dialogRef = this._matDialog.open(AjoutAttributComplementaireComponent, {
        //     autoFocus: true,
        //     width: '30rem',
        //     panelClass: 'event-form-dialog',
        //     data: {
        //         action: 'new',
        //         client:  this.currentItem,
        //         listAttribut: this.attributComplementaires,
        //         type: 'PERSONNE_MORALE',
        //         check: true
        //     }
        // });
        // this.dialogRef.afterClosed().subscribe((resp) => {
        //     if (resp) {
        //         this.getAttributComplementaireClient(this.currentItem.id);
        //     }
        // });
    }
    updateAttributComplementaire(attribut): void {
        // this.dialogRef = this._matDialog.open(AjoutAttributComplementaireComponent, {
        //     autoFocus: true,
        //     width: '30rem',
        //     panelClass: 'event-form-dialog',
        //     data: {
        //         action: 'edit',
        //         client: this.currentItem,
        //         attribut: attribut,
        //         type: 'PERSONNE_MORALE',
        //         check: true
        //     }
        // });
        // this.dialogRef.afterClosed().subscribe((resp) => {
        //     if (resp) {
        //         this.getAttributComplementaireClient(this.currentItem.id);
        //     }
        // });
    }
}
