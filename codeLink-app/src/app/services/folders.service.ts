import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoldersService {

  constructor(private http: HttpClient) { }


  public async getFolderContent(_id, parent='') {
    return await this.http.get(`${environment.baseUrl}/folders/${_id}/${parent}`).toPromise();
  }
}
