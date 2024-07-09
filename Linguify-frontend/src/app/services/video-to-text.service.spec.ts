import { TestBed } from '@angular/core/testing';

import { VideoToTextService } from './video-to-text.service';

describe('VideoToTextService', () => {
  let service: VideoToTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoToTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
