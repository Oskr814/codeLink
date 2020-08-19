import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UserComponent } from './pages/user/user.component';
import { PlanesComponent } from './pages/planes/planes.component';
import { ProyectosComponent } from './pages/proyectos/proyectos.component';

//Guards
import { AuthGuard } from './guards/auth.guard';
import { LoggedGuard } from './guards/logged.guard';

const routes: Routes = [
    {
        path: 'landing',
        component: LandingComponent,
        canActivate: [LoggedGuard]
    },
    {
        path: 'registro',
        component: RegistroComponent,
        canActivate: [LoggedGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoggedGuard]
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'plans',
        component: PlanesComponent
    },
    {
        path: 'project/:_id',
        component: ProyectosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: '',
        component: LandingComponent,
    }
];

const routerOptions: ExtraOptions = {
    onSameUrlNavigation: 'ignore',
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
};
@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
