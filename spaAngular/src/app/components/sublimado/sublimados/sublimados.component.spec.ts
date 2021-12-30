import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SublimadosComponent } from './sublimados.component';

describe('SublimadosComponent', () => {
  let component: SublimadosComponent;
  let fixture: ComponentFixture<SublimadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SublimadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SublimadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
