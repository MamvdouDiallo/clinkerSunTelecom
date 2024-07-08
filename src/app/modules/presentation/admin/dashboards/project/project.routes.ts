import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProjectComponent } from 'app/modules/presentation/admin/dashboards/project/project.component';
import { ProjectService } from 'app/modules/presentation/admin/dashboards/project/project.service';

export default [
    {
        path     : '',
        component: ProjectComponent,
        resolve  : {
            data: () => inject(ProjectService).getData(),
        },
    },
] as Routes;
