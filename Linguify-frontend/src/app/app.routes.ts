import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthComponent } from './auth/auth.component';
// import { ServicesPageComponent } from './services-page/services-page.component';
import { AuthGuard } from '../app/auth.guard';
import { TextTranslatorComponent } from './text-translator/text-translator.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'translate', component: TextTranslatorComponent },
  // { path: 'login', component: AuthComponent },
  { path: '**', redirectTo: '' }
  // { path: 'services', component: ServicesPageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
