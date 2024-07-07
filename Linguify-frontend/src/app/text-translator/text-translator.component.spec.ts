import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTranslatorComponent } from './text-translator.component';

describe('TextTranslatorComponent', () => {
  let component: TextTranslatorComponent;
  let fixture: ComponentFixture<TextTranslatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextTranslatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextTranslatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
