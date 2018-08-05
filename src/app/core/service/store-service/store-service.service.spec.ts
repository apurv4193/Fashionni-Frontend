import { TestBed, inject } from '@angular/core/testing';

import { StoreServiceService } from './store-service.service';

describe('StoreServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreServiceService]
    });
  });

  it('should be created', inject([StoreServiceService], (service: StoreServiceService) => {
    expect(service).toBeTruthy();
  }));
});
