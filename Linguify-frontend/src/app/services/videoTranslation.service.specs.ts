import { TestBed } from '@angular/core/testing';

import { VideoTranslationService } from './videoTranslation.service';

describe('VideoTranslationService', () => {
  let service: VideoTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
