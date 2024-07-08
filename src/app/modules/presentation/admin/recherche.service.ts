import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
//import {Parametrages, Privilege, Utilisateur} from 'app/modules/presentation/admin/recherche/recherche.types';
import {environment} from 'environments/environment';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { CONSTANTES } from './model/constantes';
//import {CONSTANTES} from '../../modules/presentation/admin/model/constantes';

@Injectable({
    providedIn: 'root'
})
export class RechercheService implements Resolve<any> {
    constantes = CONSTANTES;
    listStatuts: any = [
        {name: 'En cours', value: 'EN_COURS', badge: 'status-success'},
        {name: 'Affecté', value: 'AFFECTE', badge: 'status-yellow'},
        {name: 'Payé', value: 'PAYE', badge: 'status-success'},
        {name: 'Payé attente validation', value: 'PAYE_EN_ATTENTE_VALIDATION', badge: 'status-orange'},
        {name: 'Renouvelé', value: 'RENOUVELLE', badge: 'status-yellow'},
        {name: 'Résilié', value: 'RESILIE', badge: 'status-error'},
        {name: 'Rejeté', value: 'REJETE', badge: 'status-error'},
        {name: 'Renoncé', value: 'RENONCE', badge: 'status-purple'},
        {name: 'Expiré', value: 'EXPIRE', badge: 'status-error'},
        {name: 'En attente', value: 'EN_ATTENTE', badge: 'status-warning'},
        {name: 'Attente visite medical', value: 'ATTENTE_VISITE_MEDICAL', badge: 'status-orange'},
        {name: 'Avec radiation', value: 'AVEC_RADIATION', badge: 'status-primary'},
        {name: 'Radié', value: 'RADIE', badge: 'status-error'},
        {name: 'Non radié', value: 'ASSURE', badge: 'status-info'},
        {name: 'Reglé', value: 'REGLER', badge: 'status-success'},
        {name: 'Valide', value: 'VALIDE', badge: 'status-orange'},
        {name: 'Expire bientot', value: 'EXPIRE_BIENTOT', badge: 'status-info'},
        {name: 'Genere', value: 'GENERE', badge: 'badge-info'},
        {name: 'Cloturé', value: 'CLOTURER', badge: 'badge-purple'},
        {name: 'Planifié', value: 'PLANIFIER', badge: 'badge-warning'},
        {name: 'Démarré', value: 'DEMARRER', badge: 'status-info'},
        {name: 'TERMINÉ', value: 'TERMINER', badge: 'status-success'},
    ];
    // Utilisateur
    // private _utilisateurs: BehaviorSubject<Utilisateur[] | null> = new BehaviorSubject(null);

    // // Privilege
    // private _privileges: BehaviorSubject<Privilege[] | null> = new BehaviorSubject(null);

    // // parametrage
    // private _parametrages: BehaviorSubject<Parametrages[] | null> = new BehaviorSubject(null);
    private _modelLists: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------


    /**
     * Getter for Utilisateurs
     */
    // get utilisateurs$(): Observable<Utilisateur[]> {
    //     return this._utilisateurs.asObservable();
    // }

    get modelLists$(): Observable<any[]> {
        return this._modelLists.asObservable();
    }

    /**
     * Getter for Privileges
     */
    // get privileges$(): Observable<Privilege[]> {
    //     return this._privileges.asObservable();
    // }

    genererEtat(data){
        return this._httpClient.post(environment.apiURL + 'genererEtat', data, {responseType: 'blob'})
            .pipe();
    }

    /**
     * Getter for Parametrages
     */
    // get parametrages$(): Observable<Parametrages[]> {
    //     return this._parametrages.asObservable();
    // }

    uploadFiles(files: any[]) {
        return this._httpClient.post(environment.apiURL + 'documents', files)
            .pipe();

    }

    ajoutDeclarant(data) {
        return this._httpClient.post(environment.apiURL + 'declarant', data)
            .pipe();

    }

    declarerSinistre(data) {
        return this._httpClient.post(environment.apiURL + 'declare-sinister', data)
            .pipe();

    }

    modifierSinistre(data) {
        return this._httpClient.post(environment.apiURL + 'update-sinister', data)
            .pipe();

    }
    // reglementPrestation(data) {
    //     return this._httpClient.put(environment.apiURL + 'reglement-prestation', data)
    //         .pipe();
    //
    // }
    reglementPrestationRachat(item, id): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'rachats' + '/' + id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }
    reglementPrestation(item, id): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'prestations' + '/' + id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }
    getStatut(statut) {
        let tab = this.listStatuts.filter(el => el.value == statut);
        if (tab.length != 0) {
            return tab[0];
        }
    }

    listColonnes() {
        return this._httpClient.get(environment.apiURL + 'colonnes' + '?max=' + environment.max + '&offset=' + environment.offset)
            .pipe(response => response)
    }

    rechercheContrats(data) {
        return this._httpClient.post(environment.apiURL + 'contrats/specific',data)
            .pipe(response => response)
    }

    listPartenaire() {
        return this._httpClient.get(environment.apiURL + 'partenaires' + '?max=' + environment.max + '&offset=' + environment.offset)
            .pipe(response => response)
    }


    parametrageFichier(data, type) {
        if (type == true) {
            return this._httpClient.put(environment.apiURL + 'format-de-fichiers/' + data.id, data)
                .pipe(response => response)
        } else {
            return this._httpClient.post(environment.apiURL + 'format-de-fichiers', data)
                .pipe(response => response)
        }

    }

    getFormatFichier(data) {
        return this._httpClient.get(environment.apiURL + 'get-format-de-fichiers?partenaire=' + data.partenaire + '&produit=' + data.produit+ '&typeFichier=' + data.typeFichier)
            .pipe(response => response)
    }

    //   getFormatFichier(datas) {

    //             let keys = ['partenaire','typeFichier'];
    //             let data={"partenaire" : datas.partenaire,"typeFichier":datas.typeFichier}
    //             let newMap = {};
    //             for (let key of keys) {
    //                     newMap = { ...newMap, ...{ [key]: data[key] } };
    //             }
    //             return this._httpClient.get(environment.apiURL + 'format-de-fichiers' + '?isGlobal=false' + '&searchQuery=' + encodeURIComponent(JSON.stringify(newMap)))
    //                 .pipe(response => response)


    // }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    doRechercher(data, url, type?) {
        if (url && url != 'undefined') {
            if (!type) {
                if (data.isGlobal) {
                    const params = new HttpParams()
                        .set('isGlobal', data.isGlobal)
                        .set('searchQuery', data.searchQuery)
                    return this._httpClient.get(environment.apiURL + url, {params})
                        .pipe(response => response)
                } else {
                    let keys = Object.keys(data.searchQuery);
                    let newMap = {};
                    for (let key of keys) {
                        if (data.searchQuery[key] == '' || data.searchQuery[key] == null) {
                            delete data.searchQuery[key];
                        } else {
                            newMap = {...newMap, ...{[key]: data.searchQuery[key]}};
                        }
                    }
                    return this._httpClient.get(environment.apiURL + url + '?isGlobal=' + data.isGlobal + '&searchQuery=' + encodeURIComponent(JSON.stringify(newMap)))
                        .pipe(response => response)
                }
            } else {
                if (data.isGlobal) {
                    const params = new HttpParams()
                        .set("" + type.name + "", type.value)
                        .set('isGlobal', data.isGlobal)
                        .set('searchQuery', data.searchQuery)
                    return this._httpClient.get(environment.apiURL + url, {params})
                        .pipe(response => response)
                } else {
                    let keys = Object.keys(data.searchQuery);
                    let newMap = {};
                    for (let key of keys) {
                        if (data.searchQuery[key] == '' || data.searchQuery[key] == null) {
                            delete data.searchQuery[key];
                        } else {
                            newMap = {...newMap, ...{[key]: data.searchQuery[key]}};
                        }
                    }
                    return this._httpClient.get(environment.apiURL + url + '?isGlobal=' + data.isGlobal + '&' + type.label + '=' + type.name + '&searchQuery=' + encodeURIComponent(JSON.stringify(newMap)))
                        .pipe(response => response)
                }
            }
        }
    }


    getListItemByCodeItem(code, url) {
        if (url && url != 'undefined')
            return this._httpClient.get(environment.apiURL + url + '/' + code).pipe(response => response)
    }

    listFormulaire(url) {
        if (url && url != 'undefined')
            return this._httpClient.get(environment.apiURL + url + '?max=' + environment.max + '&offset=' + environment.offset)
                .pipe(response => response)
        return (new Observable<[]>())
    }

    addContrat(item): Observable<any[]> {
         return this._httpClient.post(environment.apiURL + 'v2/contrats', item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
        /*  return this._httpClient.post(environment.apiURL + 'create-contrat', item).pipe(
                    switchMap((response: any) => {
                        return of(response);
                    })
                ); */
    }


    updateContrat(item, id): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'contrats' + '/' + id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    clotureCampagne(item, id): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'campagne/terminer' + '/' + id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    demarreCampagne(item, id): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'campagne/demarrer' + '/' + id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    update(item, id): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'appels-a-cotisation' + '/' + id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getMontantTotalContrat(item) {
        return this._httpClient.post(environment.apiURL + 'contrats/get-montant-total ', item).pipe(response => response);
    }

    renouvellerContrat(item): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + 'contrats/renouvellement', item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    remboursementApporteur(item): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + 'demandeDeRemboursement', item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    updateContratStatut(item, id): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'contrats/update-statut' + '/' + id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    envoieDossierMedical(item): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + 'fichiers/envoie-dossier-medical', item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    affectationContrat(item): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + 'contrats/affectToApporteur', item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    addItem(item, url): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + url, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    updateItem(item, id, url): Observable<any[]> {
        if (url && url != 'undefined')
            return this._httpClient.put(environment.apiURL + url + '/' + id, item).pipe(
                switchMap((response: any) => {
                    return of(response);
                })
            );
    }

    updatePartenaireProduit(item,id): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'partenaire-produit/'+id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    // get souscripteurs
    // getContratBySouscripteur(data) {
    //     return this._httpClient.get(environment.apiURL + 'contrats/by-souscripteur' + data.typeFichier)
    //         .pipe(response => response)
    // }
    getContratBySouscripteur() {

        return this._httpClient.get(environment.apiURL + 'contrats/by-souscripteur')
        .pipe((response => response) );
    }

    list(url, offset, max): Observable<any[]> {
        let env;
        if (url == 'workflow' || url==='formulaires' || url==='formulaires/liste-deroulante') {
            env = environment.apiWorkflow;
        }
        else {
            env = environment.apiURL;
        }
        if (url && url != 'undefined')
            return this._httpClient.get<any[]>(env + url + '?max=' + max + '&offset=' + offset + '&order=desc').pipe(
                tap((response) => {
                    this._modelLists.next(response);
                })
        );
    }
    getListImf(url, data) {
        return this._httpClient.post(environment.apiURL + url, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getListContratByApporteur(url, max, offset, sort, order) {
        return this._httpClient.get(environment.apiURL + url + '?max=' + max + '&offset=' + offset+ '&sort=' + sort+ '&order='+ order).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getListCommissionByApporteur(url, max, offset) {
        return this._httpClient.get(environment.apiURL + url + '?max=' + max + '&offset=' + offset).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    listProduits() {
        return this._httpClient.get(environment.apiURL + 'produits' + '?max=100000000&offset=0').pipe(response => response);
    }

    listProduitsByPartenaire(id) {
        return this._httpClient.get(environment.apiURL + 'produits-by-partener/' + id).pipe(response => response);
    }

    listFormules() {
        return this._httpClient.get(environment.apiURL + 'formules' + '?max=100000000&offset=0').pipe(response => response);
    }
    fichierPartenaire(data) {
        return this._httpClient.post(environment.apiURL + 'fichiers/format',data).pipe(response => response);
    }

    listOffres() {
        return this._httpClient.get(environment.apiURL + 'offres' + '?max=100000000&offset=0').pipe(response => response);
    }

    deleteItem(item, url) {
        if (url && url != 'undefined')
            return this._httpClient.delete(environment.apiURL + url + '/' + item, item)
                .pipe(response => response)
    }

    deleteWorkflow(item, url) {
        if (url && url != 'undefined')
            return this._httpClient.delete(environment.apiWorkflow + url + '/' + item, item)
                .pipe(response => response)
    }

    updateWorkflow(id: number, objet: object): Observable<any> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._httpClient.put<any>(environment.apiWorkflow + 'workflow/'+id, objet, {headers: header }).pipe(
            tap((response) => {
                // console.log(response);
            })
        );
    }

    storeWorkflow(objet: object): Observable<any> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._httpClient
            .post<any>(environment.apiWorkflow + 'workflow', objet, { headers: header })
            .pipe(
                tap((response) => {
                    // console.log(response);
                })
            );
    }

    indexFormulaire() : Observable<any>{
        return this._httpClient.get<any>(`${environment.apiWorkflow}formulaires`).pipe(
            tap((response) => {
                // console.log(response);
            })
        );
    }

    indexRole() : Observable<any>{
        return this._httpClient.get<any>(`${environment.apiWorkflow}workflow/roles`).pipe(
            tap((response) => {
                // console.log(response);
            })
        );
    }

    indexRule() : Observable<any>{
        return this._httpClient.get<any>(`${environment.apiWorkflow}workflow/rules`).pipe(
            tap((response) => {
                // console.log(response);
            })
        );
    }

    saveFile(data) {
        return this._httpClient.post(environment.apiURL + "documents", data).pipe(response => response);
    }


    uploadFileAssure(data) {
        if (data.typeFichier == "SOUSCRIPTION") {
            return this._httpClient.post(environment.apiURL + 'contrats/souscription-en-masse', data)
                .pipe(response => response)
        } else if (data.typeFichier == "PAIEMENT") {
            return this._httpClient.post(environment.apiURL + 'contrats/retour-appel-a-cotisation', data)
                .pipe(response => response)
        }

    }

    uploadFileAssureV2(data) {
        if (data.typeFichier == this.constantes.SOUSCRIPTION) {
            return this._httpClient.post(environment.apiURL + 'v2/contrats/souscription-en-masse', data)
                .pipe(response => response)
        } else if (data.typeFichier == this.constantes.PAIEMENT) {
            return this._httpClient.post(environment.apiURL + 'contrats/retour-appel-a-cotisation', data)
                .pipe(response => response)
        }

    }
    save(data){
        return this._httpClient.post(environment.apiURL + 'contrats/paiementcotisation', data)
            .pipe(response => response)

    }
    saveDfc(data){
        return this._httpClient.post(environment.apiURL + 'contrats/paiementcotisation-confirm', data)
            .pipe(response => response)

    }

    appelCotisationAssure(data) {
        return this._httpClient.post(environment.apiURL + 'liste-souscriptions-manuelles', data)
            .pipe(response => response)
    }

    natureFile(data) {
        return this._httpClient.post(environment.apiURL + 'valider-import', data)
            .pipe(response => response)
    }
    validerImport(data) {
        return this._httpClient.post(environment.apiURL + 'v2/contrats/souscription-en-masse-confirm', data)
            .pipe(response => response)
    }

    validerImportPaiement(data) {
        return this._httpClient.post(environment.apiURL + '/contrats/retour-appel-a-cotisation-confirm', data)
            .pipe(response => response)
    }

    retournerPaiement(data) {
        return this._httpClient.post(environment.apiURL + 'rejet-appel-a-cotisation', data)
            .pipe(response => response)
    }

    addTableMortalite(data) {
        return this._httpClient.post(environment.apiURL + 'v2/table-mortalite/import',data)
            .pipe(response => response)
    }


    updateFile(data, id) {
        return this._httpClient.put(environment.apiURL + "documents/" + id, data).pipe(response => response);
    }

    saveOrUpdateFile(data) {
        if (data['id']) {
            return this._httpClient.put(environment.apiURL + "documents/" + data['id'], data).pipe(response => response);
        } else {
            return this._httpClient.post(environment.apiURL + "documents", data).pipe(response => response);
        }

    }

    getFile(id) {
        return this._httpClient.get(environment.apiURL + "documents/" + id).pipe(response => response);
    }

    resilierContrat(data) {
        return this._httpClient.post(environment.apiURL + "contrats/resilier", data).pipe(response => response);
    }

    radierAssure(data) {
        return this._httpClient.post(environment.apiURL + "contrats/radier", data).pipe(response => response);
    }

    detailsContrat(numero) {
        return this._httpClient.get(environment.apiURL + "contrats/by-numero?numero=" + numero,).pipe(response => response);
    }

    allTableMortalite() {
        return this._httpClient.get(environment.apiURL + "v2/table-mortalite",).pipe(response => response);
    }

    getConditionsGenerales(data) {
        return this._httpClient.post(environment.apiURL + "contrats/reporting/conditions-generales", data, {
            observe: 'response',
            responseType: 'blob'
        }).pipe(response => response);
    }

    getConditionsParticulieres(data) {
        let options = {
            headers: new HttpHeaders().set('Content-Type', 'application/pdf')
                .set('responseType', 'blob')
        };
        return this._httpClient.post(environment.apiURL + "contrats/reporting/conditions-particulieres", data, {responseType: 'blob'});
    }

    paiement(data) {
        return this._httpClient.post(environment.apiURL + 'payment/echeance', data)
            .pipe(response => response);

    }

    getPassword(data) {
        return this._httpClient.post(environment.apiURL + 'parametre-ftp/get-password', data)
            .pipe();

    }

    updatePwdParametre(data, id) {
        return this._httpClient.put(environment.apiURL + "parametre-ftp/" + id, data).pipe(response => response);
    }

    // partie NSIA

    ajoutTypeFichier(data) {
        return this._httpClient.post(environment.apiURL + 'v2/type-produits', data)
            .pipe();

    }

    updateTypeFichier(item): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'v2/type-produits' + '/' + item.id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    typeProduit() {
        return this._httpClient.get(environment.apiURL + "v2/type-produits",).pipe(response => response);
    }

    produitConfig(data) {
        return this._httpClient.post(environment.apiURL + 'v2/produit-configs', data)
            .pipe();

    }

    donneesEntrees() {
        return this._httpClient.get(environment.apiURL + "v2/donnees-techniques-globales",).pipe(response => response);
    }

    ajoutDonneesEntrees(data) {
        return this._httpClient.post(environment.apiURL + 'v2/donnees-techniques-globales', data)
            .pipe();
    }

    produit(data) {
        return this._httpClient.post(environment.apiURL + 'produits', data)
            .pipe();

    }

    updateProduit(item): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'produits' + '/' + item.id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    ajoutOption(data) {
        return this._httpClient.post(environment.apiURL + 'option', data)
            .pipe();
    }

    addGroupe(data) {
        return this._httpClient.post(environment.apiURL + 'groupeUtilisateurs', data)
            .pipe();
    }

    updateGroupe(item): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'groupeUtilisateurs' + '/' + item.id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    deleteGroupe(item) {
        return this._httpClient.delete(environment.apiURL + 'groupeUtilisateurs' + '/' + item, item)
            .pipe(response => response)
    }

    updateOption(item): Observable<any[]> {
        return this._httpClient.put(environment.apiURL + 'option' + '/' + item.id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    deleteOption(item) {
        return this._httpClient.delete(environment.apiURL + 'option' + '/' + item, item)
            .pipe(response => response)
    }

    listSms(): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.apiURL + 'messages').pipe(
            tap((response) => {
                this._modelLists.next(response);

            })
        );
    }

    sendSms(data): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + 'send-sms', data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    listEmail(): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.apiURL + 'messages').pipe(
            tap((response) => {
                this._modelLists.next(response);

            })
        );
    }

    getEmail(data): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + 'messages'+ '?max=' + data.max + '&offset=' + data.offset, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getSms(data): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + 'messages'+ '?max=' + data.max + '&offset=' + data.offset, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    sendEmail(data): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + 'send-mail', data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }


    envoiNotification(data): Observable<any[]> {
        let url;
        if (data['emailList']) {
            url = "send-mail";
        } else if (data['phonelList']) {
            url = "send-sms";
        }
        return this._httpClient.post(environment.apiURL + url, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getnotificationByEmail(data) {
        return this._httpClient.post(environment.apiURL + 'search-mail', data)
            .pipe(response => response)
    }

    getnotificationBySms(data) {
        return this._httpClient.post(environment.apiURL + 'search-sms', data)
            .pipe(response => response)
    }

    ajoutActionRecouvrement(data) {
        return this._httpClient.post(environment.apiURL + 'recouvrement', data)
            .pipe();
    }

    listRecouvrement() {
        return this._httpClient.get(environment.apiURL + 'recouvrement').pipe(response => response);
    }

    simulation(item): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + 'v2/simulate-vie', item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getParametres() {
        let value: any = [];
        if (localStorage.getItem('params')) {
            let data: any = localStorage.getItem('params');
            value = data;
        } else {
            value = [];
        }
        return value;
    }

    listParams() {
        return this._httpClient.get(environment.apiURL + 'v2/params-gens').pipe(response => response);
    }

    listFormulesDeCalcul() {
        return this._httpClient.get(environment.apiURL + 'v2/formules-de-calcul?max=100&offset=0').pipe(response => response);
    }

    listParamGeneral() {
        return this._httpClient.get(environment.apiURL + 'v2/donnees-techniques-globales?max=100&offset=0').pipe(response => response);
    }

    listCommutations() {
        return this._httpClient.get(environment.apiURL + 'v2/commutations?max=100&offset=0').pipe(response => response);
    }

    listEntrees() {
        return this._httpClient.get(environment.apiURL + 'v2/inputs?max=100&offset=0').pipe(response => response);
    }

    ajoutFormule(item, id?): Observable<any[]> {
        if (id) {
            return this._httpClient.put(environment.apiURL + `v2/formules-de-calcul/${id}`, item).pipe(
                switchMap((response: any) => {
                    return of(response);
                })
            );
        }
        return this._httpClient.post(environment.apiURL + `v2/formules-de-calcul`, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    displayFormuleCalcul(item): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + 'v2/formules-de-calcul/display-formule', item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }
  deleteFormulaire(id: number, url): Observable<any> {
      if (url && url !== 'undefined'){
          return this._httpClient.delete(environment.apiWorkflow + url +'/' +id )
              .pipe(response=> response);
      }
    }
    changeStatus(item, id): Observable<any> {
        return this._httpClient.put(environment.apiURL +'contrats/update-statut/'+id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    addDynamicFormulaire(form: any): Observable<any> {
        return this._httpClient.post(`${environment.apiWorkflow}formulaires`, form).pipe();
    }
    updateDynamicFormulaire(data: any, id: string): Observable<any> {
        return this._httpClient.patch(`${environment.apiWorkflow}formulaires/${id}`, data);
    }
    getIdFormulaire(id: any): Observable<any> {
        return this._httpClient.get(`${environment.apiWorkflow}formulaires/${id}`);
    }
    addListeDeroulante(liste: any): Observable<any> {
        return this._httpClient.post(`${environment.apiWorkflow}formulaires/liste-deroulante`, liste);
    }
    deleteListDeroulant(id: number, url): Observable<any> {
        if (url && url !== 'undefined'){
            return this._httpClient.delete(environment.apiWorkflow + url +'/' +id )
                .pipe(response => response);
        }
    }
    getIdList(id: any): Observable<any> {
        return this._httpClient.get(`${environment.apiWorkflow}formulaires/liste-deroulante/${id}`).pipe();
    }
    updateListeDeroulant(data: any, id: string): Observable<any> {
        return this._httpClient.patch(`${environment.apiWorkflow}formulaires/liste-deroulante/${id}`, data);
    }

    niveauProduit(niveau) {
        return this._httpClient.get(environment.apiURL + "produit/by-niveau?niveau=" + niveau).pipe(response => response);
    }

    apporteurAndPartenaire(productId) {
        return this._httpClient.get(environment.apiURL + "apporteur-partenaire/by-produit?productId=" + productId).pipe(response => response);
    }

    getContratsCampagne(id) {
        return this._httpClient.get(environment.apiURL + "contrats/campagnes/" + id).pipe(response => response);
    }

    commissionFilter(type?, idApporteur?) {
        let data = {};
        if (type)
            data['type'] = type;
        if (idApporteur)
            data['idApporteur'] = idApporteur;
        let params = new HttpParams()
        let keys = data ? Object.keys(data) : [];
        for (let key of keys) {
            params = params.append(key, data[key])
        }
        return this._httpClient.get(environment.apiURL + 'commission-apporteur/by-niveau', {params});
    }


    updateSoucription(url,item, id): Observable<any[]> {
        return this._httpClient.post(environment.apiURL + url + '/' + id, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    updateFormuleProduit(item, id?): Observable<any[]> {
        if (id) {
            return this._httpClient.put(environment.apiURL + `v2/save-formules-de-calcul-produit/${id}`, item).pipe(
                switchMap((response: any) => {
                    return of(response);
                })
            );
        }
        return this._httpClient.post(environment.apiURL + `v2/save-formules-de-calcul-produit`, item).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }


    formuleCalculeByProduit(idProduit) {
        return this._httpClient.get(environment.apiURL + "v2/fomule-calcul-by-produit?produitId=" + idProduit).pipe(response => response);
    }

    deleteFomuleCalculForProduit(id)
    {
     return this._httpClient.delete(environment.apiURL + 'v2/formules-de-calcul-produit/' + id);
    }

}

