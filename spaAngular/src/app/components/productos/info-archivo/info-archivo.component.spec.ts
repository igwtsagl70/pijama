import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoArchivoComponent } from './info-archivo.component';

describe('InfoArchivoComponent', () => {
  let component: InfoArchivoComponent;
  let fixture: ComponentFixture<InfoArchivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoArchivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
