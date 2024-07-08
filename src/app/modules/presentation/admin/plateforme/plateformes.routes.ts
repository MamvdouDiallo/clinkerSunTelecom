import { Routes } from '@angular/router';
import { PlateformeComponent } from './plateforme.component';
import { ListComponent } from './list/list.component';

export default [
    {
        path: '',
        component: ListComponent,
        children: [
            {
                path: '',
                component: PlateformeComponent,
            },
        ],
    },
] as Routes;
