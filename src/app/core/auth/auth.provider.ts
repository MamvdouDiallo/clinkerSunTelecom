import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { authInterceptor } from 'app/core/auth/interceptors/auth.interceptor';
import { AuthService } from 'app/core/services/auth.service';

export const provideAuth = (): Array<Provider | EnvironmentProviders> =>
{
    return [
        provideHttpClient(withInterceptors([authInterceptor])),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(AuthService),
            multi   : true,
        },
    ];
};
