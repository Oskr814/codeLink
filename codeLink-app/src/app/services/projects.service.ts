import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {
    project;

    constructor(private router: Router, private http: HttpClient) {}

    public async newProject(user_id: string, name: string, folder: string) {
        return await this.http
            .post(`${environment.baseUrl}/project/${user_id}`, {
                name,
                folder
            })
            .toPromise();
    }

    async editProject(user_id, project) {
        return await this.http
            .put(
                `${environment.baseUrl}/project/${user_id}/${project._id}`,
                project
            )
            .toPromise();
    }

    async deleteProject(user_id, project_id) {
        return await this.http
            .delete(`${environment.baseUrl}/project/${user_id}/${project_id}`)
            .toPromise();
    }

    loadProject(project_id) {
        this.router.navigate(['/project/' + project_id]);
    }

    async getRecentsProjects(user_id: string) {
        return await this.http
            .get(`${environment.baseUrl}/recents/${user_id}`)
            .toPromise();
    }
}
