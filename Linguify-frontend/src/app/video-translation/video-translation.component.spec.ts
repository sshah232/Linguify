import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTranslationComponent } from './video-translation.component';

describe('VideoTranslationComponent', () => {
  let component: VideoTranslationComponent;
  let fixture: ComponentFixture<VideoTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoTranslationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
