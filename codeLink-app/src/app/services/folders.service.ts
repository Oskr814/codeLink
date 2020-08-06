import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FoldersService {
    constructor(private http: HttpClient) {}

    public async getFolderContent(user_id, parent = '') {
        return await this.http
            .get(`${environment.baseUrl}/folders/${user_id}/${parent}`)
            .toPromise();
    }

    public async newFolder(user_id: string, name: string, parent: string) {
        return await this.http.post(
            `${environment.baseUrl}/folder/${user_id}`,
            {
                name,
                parent
            }
        ).toPromise();
    }
}
