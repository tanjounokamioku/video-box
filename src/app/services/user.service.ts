import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.backendUrl}/api/users/self`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
