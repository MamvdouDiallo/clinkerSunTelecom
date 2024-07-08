import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutReseauComponent } from './ajout-reseau.component';

describe('AjoutReseauComponent', () => {
  let component: AjoutReseauComponent;
  let fixture: ComponentFixture<AjoutReseauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutReseauComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutReseauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
