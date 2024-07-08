import { Routes } from '@angular/router';
import { FormsFieldsComponent } from 'app/modules/presentation//admin/ui/forms/fields/fields.component';
import { FormsLayoutsComponent } from 'app/modules/presentation//admin/ui/forms/layouts/layouts.component';
import { FormsWizardsComponent } from 'app/modules/presentation//admin/ui/forms/wizards/wizards.component';

export default [
    {
        path     : 'fields',
        component: FormsFieldsComponent,
    },
    {
        path     : 'layouts',
        component: FormsLayoutsComponent,
    },
    {
        path     : 'wizards',
        component: FormsWizardsComponent,
    },
] as Routes;
