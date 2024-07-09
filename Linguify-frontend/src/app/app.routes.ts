import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthComponent } from './auth/auth.component';
// import { ServicesPageComponent } from './services-page/services-page.component';
import { AuthGuard } from '../app/auth.guard';
import { TextTranslatorComponent } from './text-translator/text-translator.component';
import { TextDetectionComponent } from './text-detection/text-detection.component';
import { VideoToTextComponent } from './video-to-text/video-to-text.component';
import { VideoTranslationComponent } from './video-translation/video-translation.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'translate', component: TextTranslatorComponent },
  { path: 'text-detection', component: TextDetectionComponent },
  { path: 'video-to-text', component: VideoToTextComponent },
  { path: 'videoTranslation', component: VideoTranslationComponent},
  // { path: 'login', component: AuthComponent },
  { path: '**', redirectTo: '' }
  // { path: 'services', component: ServicesPageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
