import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSublimadoComponent } from './agregar-sublimado.component';

describe('AgregarSublimadoComponent', () => {
  let component: AgregarSublimadoComponent;
  let fixture: ComponentFixture<AgregarSublimadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarSublimadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarSublimadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
