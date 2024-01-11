import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = `${environment.backendUrl}/api/videos`;

  constructor(private http: HttpClient) {}

  private constructVideoUrl(videoId: string, endpoint: string = ''): string {
    const endpointPart = endpoint ? `/${endpoint}` : '';
    return `${this.apiUrl}/${videoId}${endpointPart}`;
  }

  getVideos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getVideoDetails(videoId: string): Observable<any> {
    const url = this.constructVideoUrl(videoId);
    return this.http.get<any>(url);
  }

  updateVideoProperties(videoId: string, body: any): Observable<any> {
    const url = this.constructVideoUrl(videoId);
    return this.http.patch<any>(url, body);
  }

  getVideoReactions(videoId: string): Observable<any[]> {
    const url = this.constructVideoUrl(videoId, 'reactions');
    return this.http.get<any[]>(url);
  }

  addVideoReaction(videoId: string, body: any): Observable<any> {
    const url = this.constructVideoUrl(videoId, 'reactions');
    return this.http.post<any>(url, body);
  }
}
