import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRechercheComponent } from './detail-recherche.component';

describe('DetailRechercheComponent', () => {
  let component: DetailRechercheComponent;
  let fixture: ComponentFixture<DetailRechercheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailRechercheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailRechercheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
