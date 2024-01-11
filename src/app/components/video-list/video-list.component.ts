import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
  providers: [DatePipe],
})
export class VideoListComponent implements OnInit {
  videos: any[] = [];
  isListView: boolean = true;
  isLoading: boolean = true;

  constructor(private videoService: VideoService, private router: Router) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  toggleView() {
    this.isListView = !this.isListView;
  }

  loadVideos() {
    this.videoService.getVideos().subscribe(
      (data: any) => {
        this.videos = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading videos:', error);
      }
    );
  }

  navigateToVideo(videoId: string) {
    this.router.navigate(['/videos', videoId]);
  }
}
