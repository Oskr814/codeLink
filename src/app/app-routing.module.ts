import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { UserComponent } from './pages/user/user.component';
import { PlanesComponent } from './pages/planes/planes.component';

const routes: Routes = [
  {
    path: 'registro',
    component: RegistroComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'plans',
    component: PlanesComponent,
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: '**',
    component: LandingComponent,
  },
];

const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'ignore',
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
};
@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
