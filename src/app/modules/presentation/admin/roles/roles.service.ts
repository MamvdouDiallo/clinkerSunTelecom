import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {Role} from 'app/modules/presentation/admin/roles/roles.types';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RolesService {
    // Private
    private _roles: BehaviorSubject<Role[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------


    /**
     * Getter for Roles
     */
    get roles$(): Observable<Role[]> {
        return this._roles.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Ajout Roles
     */
    ajoutRole(role): Observable<Role[]> {
        return this._httpClient.post(environment.apiURL + 'roles', role).pipe(
            switchMap((response: any) =>
                // Return a new observable with the response
                of(response)
            )
        );
    }

    /**
     * modifier Roles
     */
    modifierRole(role): Observable<Role[]> {
        const headers = new HttpHeaders().append('allow', '*');
        let value;
        value = {
            'authority': role.authority
        };
        return this._httpClient.put(environment.apiURL + 'roles/' + role.id, value, {headers: headers}).pipe(
            switchMap((response: any) =>
                // Return a new observable with the response
                of(response)
            )
        );
    }

    /**
     * Get Roles
     */
    getRoles(params?) {
        let options = new HttpParams();
        if (!params) {
            params = {max: environment.max, offset: environment.offset}
        }
        if (!params['max']) {
            params['max'] = environment.max;
        }
        if (!params['offset']) {
            params['offset'] = environment.offset;
        }
        const keys = Object.keys(params);
        for (const key of keys) {
            options = options.set(key, params[key]);
        }
        return this._httpClient.get(environment.apiURL + 'roles', {params: options}).pipe(response => response);
    }

    /**
     * Delete Roles
     */
    deleteRole(id) {
        return this._httpClient.delete(environment.apiURL + 'roles/' + id);
    }

    /**
     * Get Privileges
     */
    getPrivileges(data): Observable<Role[]> {
        return this._httpClient.post(environment.apiURL + 'privileges/get-roles', data).pipe(
            switchMap((response: any) =>
                // Return a new observable with the response
                of(response)
            )
        );
    }


    /**
     * Get Privileges
     */
    ajoutPrivilegeByrole(data): Observable<Role[]> {
        return this._httpClient.post(environment.apiURL + 'privileges/give-autorisations', data).pipe(
            switchMap((response: any) =>
                // Return a new observable with the response
                of(response)
            )
        );
    }

    listeRolePrivilege(): Observable<Role[]> {
        return this._httpClient.get<Role[]>(environment.apiURL + 'privileges/liste-privileges' + '?max=' + environment.max + '&offset=' + environment.offset).pipe(
            tap((roles) => {
                this._roles.next(roles);
            })
        );
    }


    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */

    /**
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
}
