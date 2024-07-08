import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommunicationService {

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Ajout Message
     */
    addMessages(data: any): Observable<any> {
        return this._httpClient.post(environment.apicomURL + 'messages/group', data);
    }

    addMessage(data: any): Observable<any> {
        return this._httpClient.post(environment.apicomURL + 'messages', data);
    }

    deleteMessage(id: any) {
        return this._httpClient.delete(environment.apicomURL + 'messages/' + id);
    }

    updateMessage(id: any, message: any) {
        return this._httpClient.put(environment.apicomURL + 'messages/' + id, message);
    }

    allMessages(params?: any): Observable<any> {
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
        return this._httpClient.get(environment.apicomURL + 'messages', {params: options}).pipe();
    }


}
