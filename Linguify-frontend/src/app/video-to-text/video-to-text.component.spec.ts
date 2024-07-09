import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoToTextComponent } from './video-to-text.component';

describe('VideoToTextComponent', () => {
  let component: VideoToTextComponent;
  let fixture: ComponentFixture<VideoToTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoToTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoToTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
