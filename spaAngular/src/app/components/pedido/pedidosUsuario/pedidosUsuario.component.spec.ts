import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosUsuarioComponent } from './pedidosUsuario.component';

describe('PedidosComponent', () => {
  let component: PedidosUsuarioComponent;
  let fixture: ComponentFixture<PedidosUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
