import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';

@Component({
    selector: 'app-detail-recherche',
    standalone: true,
    imports: [AngularMaterialModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './detail-recherche.component.html',
    styleUrl: './detail-recherche.component.scss',
})
export class DetailRechercheComponent {
    readonly panelOpenState = signal(false);
    data: any;

    constructor(
        public matDialogRef: MatDialogRef<DetailRechercheComponent>,
        @Inject(MAT_DIALOG_DATA) _data
    ) {
        this.data = _data;
        console.log('====================================');
        console.log("data",this.data.item);
        console.log('====================================');
        console.log('Received data:', _data.url);
    }
}
