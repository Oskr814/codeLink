import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppRoutingModule } from './app-routing.module';
import { GridsterModule } from 'angular-gridster2';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

//Components
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
//Projects
import { NavbarProjectComponent } from './pages/proyectos/components/navbar/navbar.component';
import { FooterProjectComponent } from './pages/proyectos/components/footer/footer.component';

//Pages
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UserComponent } from './pages/user/user.component';
import { ProyectosComponent } from './pages/proyectos/proyectos.component';
import { FolderTreeViewComponent } from './components/folder-tree-view/folder-tree-view.component';
import { PlanesComponent } from './pages/planes/planes.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthGuard } from './guards/auth.guard';
import { LoggedGuard } from './guards/logged.guard';
import { AuthService } from './services/auth.service';
import { FoldersService } from './services/folders.service';
import { DatePipe } from './pipes/date.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { ProjectsService } from './services/projects.service';

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        NavbarComponent,
        RegistroComponent,
        LoginComponent,
        HomeComponent,
        UserComponent,
        ProyectosComponent,
        FooterComponent,
        FolderTreeViewComponent,
        PlanesComponent,
        SidebarComponent,
        NavbarProjectComponent,
        FooterProjectComponent,
        DatePipe,
        FilterPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        NgScrollbarModule,
        GridsterModule,
        MonacoEditorModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: () => localStorage.getItem('token'),
                allowedDomains: ['localhost:3000'],
                disallowedRoutes: ['localhost:3000/login'],
                headerName: 'token'
            }
        })
    ],
    providers: [
        {
            provide: MONACO_PATH,
            useValue: 'https://unpkg.com/monaco-editor@0.18.1/min/vs'
        },
        AuthGuard,
        LoggedGuard,
        AuthService,
        FoldersService,
        ProjectsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
