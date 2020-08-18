import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SnippetsService {
    
    constructor(private router: Router, private http: HttpClient) {}

    public async newSnippet(user_id: string, snippet: any, folder: string) {
        return await this.http
            .post(`${environment.baseUrl}/snippet/${user_id}`, {
                snippet,
                folder
            })
            .toPromise();
    }

    async editSnippet(user_id, snippet) {
        return await this.http
            .put(
                `${environment.baseUrl}/snippet/${user_id}/${snippet._id}`,
                snippet
            )
            .toPromise();
    }

    async deleteSnippet(user_id, snippet_id) {
        return await this.http
            .delete(`${environment.baseUrl}/snippet/${user_id}/${snippet_id}`)
            .toPromise();
    }
}
