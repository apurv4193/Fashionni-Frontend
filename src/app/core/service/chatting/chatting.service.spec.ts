import { TestBed, inject } from '@angular/core/testing';

import { ChattingService } from './chatting.service';

describe('ChattingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChattingService]
    });
  });

  it('should be created', inject([ChattingService], (service: ChattingService) => {
    expect(service).toBeTruthy();
  }));
});
