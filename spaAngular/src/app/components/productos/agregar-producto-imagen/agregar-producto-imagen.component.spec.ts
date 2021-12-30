import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarProductoImagenComponent } from './agregar-producto-imagen.component';

describe('AgregarProductoImagenComponent', () => {
  let component: AgregarProductoImagenComponent;
  let fixture: ComponentFixture<AgregarProductoImagenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarProductoImagenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarProductoImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
