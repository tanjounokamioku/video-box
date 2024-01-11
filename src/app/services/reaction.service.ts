import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReactionService {
  private apiUrl = `${environment.backendUrl}/api/videos`;

  constructor(private http: HttpClient) {}

  private constructReactionUrl(videoId: string): string {
    return `${this.apiUrl}/${videoId}/reactions`;
  }

  addStarReaction(videoId: string, timeframe: number): Observable<any> {
    const url = this.constructReactionUrl(videoId);
    const body = {
      videoId,
      type: 'star',
      timeframe,
    };
    return this.http.post<any>(url, body);
  }

  addSnapshotReaction(
    videoId: string,
    timeframe: number,
    dataUri: string
  ): Observable<any> {
    const url = this.constructReactionUrl(videoId);
    const body = {
      videoId,
      type: 'snapshot',
      timeframe,
      dataUri,
    };
    return this.http.post<any>(url, body);
  }
}
