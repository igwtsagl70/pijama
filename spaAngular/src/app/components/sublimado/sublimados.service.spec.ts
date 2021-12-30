import { TestBed } from '@angular/core/testing';

import { SublimadosService } from './sublimados.service';

describe('SublimadosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SublimadosService = TestBed.get(SublimadosService);
    expect(service).toBeTruthy();
  });
});
