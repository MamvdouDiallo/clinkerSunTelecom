import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
//import {Utilisateur , Privilege , Parametrages} from 'app/modules/presentation/admin/recherche/recherche.types';
import { environment } from 'environments/environment';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Resolve,
} from '@angular/router';
import { ResponseBack } from './recherche.types';

@Injectable({
    providedIn: 'root',
})
export class RechercheService implements Resolve<any> {
    // Utilisateur
    //private _utilisateurs: BehaviorSubject<Utilisateur[] | null> = new BehaviorSubject(null);

    // Privilege
    // private _privileges: BehaviorSubject<Privilege[] | null> = new BehaviorSubject(null);

    // parametrage
    //private _parametrages: BehaviorSubject<Parametrages[] | null> = new BehaviorSubject(null);
    private _modelLists: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for Utilisateurs
     */
    //   get utilisateurs$(): Observable<Utilisateur[]>
    //   {
    //       return this._utilisateurs.asObservable();
    //   }
    get modelLists$(): Observable<any[]> {
        return this._modelLists.asObservable();
    }

    /**
     * Getter for Privileges
     */
    // get privileges$(): Observable<Privilege[]>
    // {
    //     return this._privileges.asObservable();
    // }
    /**
     * Getter for Parametrages
     */
    //   get parametrages$(): Observable<Parametrages[]>
    //   {
    //       return this._parametrages.asObservable();
    //   }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    // doRechercher(data, url, type?) {
    //     console.log(url);
    //     if (!type) {
    //         if (data.isGlobal) {
    //             const params = new HttpParams()
    //                 .set('isGlobal', data.isGlobal)
    //                 .set('searchQuery', data.searchQuery);
    //             return this._httpClient
    //                 .get(url, { params })
    //                 .pipe((response) => response);
    //         } else {
    //             let keys = Object.keys(data.searchQuery);
    //             let newMap = {};
    //             for (let key of keys) {
    //                 if (data.searchQuery[key] == '') {
    //                     delete data.searchQuery[key];
    //                 } else {
    //                     newMap = {
    //                         ...newMap,
    //                         ...{ [key]: data.searchQuery[key] },
    //                     };
    //                 }
    //             }
    //             return this._httpClient
    //                 .get(
    //                     url +
    //                         '?isGlobal=' +
    //                         data.isGlobal +
    //                         '&searchQuery=' +
    //                         encodeURIComponent(JSON.stringify(newMap))
    //                 )
    //                 .pipe((response) => response);
    //         }
    //     } else {
    //         if (data.isGlobal) {
    //             const params = new HttpParams()
    //                 .set('' + type.name + '', type.value)
    //                 .set('isGlobal', data.isGlobal)
    //                 .set('searchQuery', data.searchQuery);
    //             return this._httpClient
    //                 .get(url, { params })
    //                 .pipe((response) => response);
    //         } else {
    //             let keys = Object.keys(data.searchQuery);
    //             let newMap = {};
    //             for (let key of keys) {
    //                 if (data.searchQuery[key] == '') {
    //                     delete data.searchQuery[key];
    //                 } else {
    //                     newMap = {
    //                         ...newMap,
    //                         ...{ [key]: data.searchQuery[key] },
    //                     };
    //                 }
    //             }
    //             return this._httpClient
    //                 .get(
    //                     url +
    //                         '?isGlobal=' +
    //                         data.isGlobal +
    //                         '&' +
    //                         type.label +
    //                         '=' +
    //                         type.name +
    //                         '&searchQuery=' +
    //                         encodeURIComponent(JSON.stringify(newMap))
    //                 )
    //                 .pipe((response) => response);
    //         }
    //     }
    // }


    doRechercher(data, url,type?) {


        if(!type){

            if (data.isGlobal) {
                const params = new HttpParams()
                    .set('isGlobal', data.isGlobal)
                    .set('searchQuery', data.searchQuery)
                    console.log(params);

                return this._httpClient.get(environment.apiURL + url, { params })
                    .pipe(response => response)
            } else {

                let keys = Object.keys(data.searchQuery);
                let newMap = {};
                for (let key of keys) {
                    if (data.searchQuery[key] == '') {
                        delete data.searchQuery[key];
                    } else {
                        newMap = { ...newMap, ...{ [key]: data.searchQuery[key] } };
                    }
                }

                return this._httpClient.get(environment.apiURL + url + '?isGlobal=' + data.isGlobal + '&searchQuery=' + encodeURIComponent(JSON.stringify(newMap)))
                    .pipe(response => response)
            }
           }else{
          

            if (data.isGlobal) {

                const params = new HttpParams()
                    .set(""+type.name+"",type.value)
                    .set('isGlobal', data.isGlobal)
                    .set('searchQuery', data.searchQuery)
                return this._httpClient.get(environment.apiURL + url, { params })
                    .pipe(response => response)
            } else {
                let keys = Object.keys(data.searchQuery);
                let newMap = {};
                for (let key of keys) {
                    if (data.searchQuery[key] == '') {
                        delete data.searchQuery[key];
                    } else {
                        newMap = { ...newMap, ...{ [key]: data.searchQuery[key] } };
                    }
                }
                return this._httpClient.get(environment.apiURL + url + '?isGlobal=' + data.isGlobal +'&'+type.label+'='+type.name+ '&searchQuery=' + encodeURIComponent(JSON.stringify(newMap)))
                    .pipe(response => response)
            }
           }
    }





    getListItemByCodeItem(code, url) {
        return this._httpClient
            .get(environment.apiURL + url + '/' + code)
            .pipe((response) => response);
    }

    listFormulaire(url) {
        return this._httpClient
            .get(
                environment.apiURL +
                    url +
                    '?max=' +
                    environment.max +
                    '&offset=' +
                    environment.offset
            )
            .pipe((response) => response);
    }
    //   addItem (item, url): Observable<any[]> {
    //     return this._httpClient.post(environment.apiURL + url, item).pipe(
    //                     switchMap((response: any) => {
    //                         return of(response);
    //                     })
    //                 );
    //   }
    updateItem(item, id, url): Observable<any[]> {
        return this._httpClient
            .put(environment.apiURL + url + '/' + id, item)
            .pipe(
                switchMap((response: any) => {
                    return of(response);
                })
            );
    }

    // list(url, offset, max): Observable<any[]>{
    //     return this._httpClient.get<any[]>(environment.apiURL + url+'?max='+max +'&offset=' +offset).pipe(
    //         tap((response) => {
    //             this._modelLists.next(response);

    //         })
    //     );
    // }

    list1(url, max, offset, customBaseUrl?): Observable<any[]> {
        return this._httpClient
            .get<any[]>(
                environment.apiURL + url + '?max=' + max + '&offset=' + offset
            )
            .pipe(
                tap((response) => {
                    this._modelLists.next(response);
                })
            );
    }

    //   deleteItem (item, url) {
    //     return this._httpClient.delete(environment.apiURL + url + '/' + item, item)
    //         .pipe(response => response)
    //   }

    /**
     * Get
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
