import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Privilege } from "./privilege.types";

@Injectable({
    providedIn: 'root'
})
export class PrivilegeService
{
    // Private
    private _privileges: BehaviorSubject<Privilege[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------


     /**
      * Getter for Privilege
      */
      get privileges$(): Observable<Privilege[]>
      {
          return this._privileges.asObservable();
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

     /**
      * Ajout Privilege
      */
      ajoutPrivilege(privilege): Observable<Privilege[]>
         {
            return this._httpClient.post(environment.apiURL + 'privileges', privilege).pipe(
                switchMap((response: any) =>
                    // Return a new observable with the response
                     of(response)
                )
            );
         }
          /**
           * modifier Privilege
           */
      modifierPrivilege(privilege): Observable<Privilege[]>
      {
         return this._httpClient.put(environment.apiURL + 'privileges/'+privilege.id, privilege).pipe(
             switchMap((response: any) =>
                 // Return a new observable with the response
                  of(response)
             )
         );
      }
      /**
       * Get Privilege
       */
       getPrivilege(max,offset)
       {
           return this._httpClient.get(environment.apiURL + 'privileges'+'?max='+max +'&offset=' +offset).pipe(response=>response);
       }

  /**
   * Delete Privilege
   */
       deletePrivilge(id)
       {
        return this._httpClient.delete(environment.apiURL + 'privileges/' + id);
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
