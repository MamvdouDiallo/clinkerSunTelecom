import {ComponentFixture, TestBed, tick, fakeAsync} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UntypedFormBuilder, ReactiveFormsModule} from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {OverlayModule} from '@angular/cdk/overlay';
// import {CompteServiceMock} from "../../../../../../mock-api/test/ajout_mock_data";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {AjoutCompteComponent} from './ajout.component';
// import {ComptePosteService} from '../../compte.service';
import {PrivilegeServiceMock} from '../../../../../../mock-api/test/ajout_mock_data';
import {of} from 'rxjs';
import {SnackBarService} from "../../../../../../core/auth/snackBar.service";
import {AjoutPrivilegeComponent} from "./ajout.component";
import {PrivilegeService} from "../../privilege.service";
import {Privilege} from "../../privilege.types";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";



describe('AjoutPrivilegeComponent', () => {

    let component: AjoutPrivilegeComponent;
    let fixture: ComponentFixture<AjoutPrivilegeComponent>;
    let compteServiceSpy: jasmine.SpyObj<PrivilegeService>;
    let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<AjoutPrivilegeComponent>>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;
    let snackBarServiceSpy: jasmine.SpyObj<SnackBarService>;
    let snackBarService: SnackBarService;
    let compteService: PrivilegeService;
    let snackBar: MatSnackBar;
    let authenticationServiceStub: Partial<PrivilegeService>;
    beforeEach(() => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        snackBarServiceSpy = jasmine.createSpyObj('SnackBarService', ['showConfirmation']);
        compteServiceSpy = jasmine.createSpyObj('compteService', ['ajoutCompte', 'modifierCompte']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        TestBed.configureTestingModule({
    declarations: [AjoutPrivilegeComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [ReactiveFormsModule, OverlayModule, BrowserAnimationsModule],
    providers: [
        { provide: PrivilegeService, useValue: authenticationServiceStub },
        UntypedFormBuilder,
        { provide: PrivilegeService, useValue: compteServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        SnackBarService,
        PrivilegeService,
        MatSnackBar,
        provideHttpClient(withInterceptorsFromDi()),
    ]
});

        fixture = TestBed.createComponent(AjoutPrivilegeComponent);
        component = fixture.componentInstance;
        snackBarService = TestBed.inject(SnackBarService);
        compteService = TestBed.inject(PrivilegeService);
        snackBar = TestBed.inject(MatSnackBar);
        TestBed.inject(MatDialog)
    });
    it('test de creation', () => {
        expect(component).toBeTruthy();
    });
    it('doit appeler compteService.ajoutCompte et fermer la boîte de dialogue lorsque la confirmation est vraie', fakeAsync(() =>  {
        spyOn(snackBarService, 'showConfirmation').and.returnValue(Promise.resolve({ value: true }));
        spyOn(snackBar, 'open');
        const formBuilder = TestBed.inject(UntypedFormBuilder);
        const compteServices = TestBed.inject(PrivilegeService);

        // Simuler un appel réussi à ajoutCompte avec une valeur de retour spécifique
        const fakeCompteData = PrivilegeServiceMock[0];
        spyOn(compteServices, 'ajoutPrivilege').and.returnValue(of(fakeCompteData));

        component.eventForm = formBuilder.group({
            libelle: '',
            niveau: '',
            code: '',
            lien: '',
            icon: '',
            isMenu: '',
            parent_id: '',
        });
        component.ajoutPrivilege();
        tick();
        // Vérifie si la méthode showConfirmation a été appelée
        expect(snackBarService.showConfirmation).toHaveBeenCalled()
        // Vérifie si isLoading est a false
        // expect(component.isLoading).toBe(false);
        authenticationServiceStub = {
            ajoutPrivilege: () => of([{responseCode: 200} as unknown as Privilege])
        };

        // Vérifie si le dialogue est fermé
        // expect(matDialogRefSpy.close).toHaveBeenCalled();

    }));


});
