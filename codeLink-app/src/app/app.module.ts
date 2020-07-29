import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppRoutingModule } from './app-routing.module';
import { GridsterModule } from 'angular-gridster2';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';

//Components
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

//Pages
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UserComponent } from './pages/user/user.component';
import { ProyectosComponent } from './pages/proyectos/proyectos.component';
import { FolderTreeViewComponent } from './components/folder-tree-view/folder-tree-view.component';
import { PlanesComponent } from './pages/planes/planes.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

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
        SidebarComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        HighlightModule,
        NgScrollbarModule,
        GridsterModule,
        MonacoEditorModule
    ],
    providers: [
        {
            provide: MONACO_PATH,
            useValue: 'https://unpkg.com/monaco-editor@0.18.1/min/vs'
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
