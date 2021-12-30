import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarProductoComponent } from './asignar-producto.component';

describe('AsignarProductoComponent', () => {
  let component: AsignarProductoComponent;
  let fixture: ComponentFixture<AsignarProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
