import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactionService } from 'src/app/services/reaction.service';
import { VideoService } from 'src/app/services/video.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss'],
  animations: [
    trigger('starAnimation', [
      state(
        'initial',
        style({
          opacity: 0,
        })
      ),
      state(
        'initial2',
        style({
          transform: 'translateY(-100%)',
          opacity: 1,
        })
      ),
      state(
        'animate',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      state(
        'animate2',
        style({
          opacity: 0,
        })
      ),
      transition('initial => initial2', animate('500ms')),
      transition('initial2 => animate', animate('500ms')),
      transition('animate => animate2', animate('500ms')),
    ]),
  ],
})
export class VideoDetailsComponent implements OnInit {
  video: any;
  user: any;
  reactions: any[] = [];
  isEditingTitle = false;
  starAnimationState = 'initial';
  editedTitle: string = '';
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;
  @ViewChild('editableTitle') editableTitle!: ElementRef;
  currentTimeFormatted: string = '00:00:00';
  isCardHighlighted: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private reactionService: ReactionService,
    private datePipe: DatePipe,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.user = user;
    });

    const videoId = this.route.snapshot.paramMap.get('videoId');

    if (videoId !== null) {
      this.videoService.getVideoDetails(videoId).subscribe((result) => {
        this.video = result;
        console.log(this.video);
        this.loadReactions(videoId);
      });
    }
  }

  loadVideoDetails(videoId: string) {
    this.videoService.getVideoDetails(videoId).subscribe((data: any) => {
      this.video = data;
      this.editedTitle = data.title;
    });
  }

  loadReactions(videoId: string) {
    this.videoService.getVideoReactions(videoId).subscribe((data: any) => {
      this.reactions = data;
      this.reactions.reverse();
      console.log(this.reactions);
    });
  }
  toggleEditTitle() {
    this.isEditingTitle = !this.isEditingTitle;
  }

  saveTitle(newTitle: string) {
    if (newTitle !== undefined) {
      console.log(newTitle);

      const updatedProperties = {
        title: newTitle,
        description: this.video.description,
      };

      this.videoService
        .updateVideoProperties(this.video.id, updatedProperties)
        .subscribe((data: any) => {
          this.editedTitle = newTitle || this.video.title;
          this.loadVideoDetails(this.video.id);
        });
    }
  }

  getCurrentTimeframe(): number {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
      return videoElement.currentTime;
    }
    return 0;
  }

  formatTimeframe(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = this.datePipe.transform(
      new Date(0, 0, 0, hours, minutes, remainingSeconds),
      'HH:mm:ss'
    );

    return formattedTime || '00:00:00';
  }

  formatDate(isoDate: string): string {
    const formattedDate = this.datePipe.transform(isoDate, 'dd/MM/yyyy');
    return formattedDate ? formattedDate : 'Invalid Date';
  }

  private pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  captureScreenshot() {
    const video = this.videoPlayer.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURI = canvas.toDataURL('image/png');
      return dataURI;
    } else {
      console.error('Unable to capture screenshot');
      return undefined;
    }
  }

  takeSnapshot() {
    const videoId = this.video.id;
    const timeframe = this.getCurrentTimeframe();
    const dataUri = this.captureScreenshot();

    if (dataUri) {
      this.reactionService
        .addSnapshotReaction(videoId, timeframe, dataUri)
        .subscribe((response) => {
          console.log('Snapshot added:', response);
          this.loadReactions(videoId);
        });
    } else {
      console.error('Unable to capture snapshot.');
    }
  }

  starVideo() {
    const videoId = this.video.id;
    const timeframe = this.getCurrentTimeframe();

    this.reactionService
      .addStarReaction(videoId, timeframe)
      .subscribe((response) => {
        console.log('Video starred:', response);
        this.loadReactions(videoId);
        this.starAnimationState = 'initial2';
        setTimeout(() => {
          this.starAnimationState = 'initial';
        }, 500);
      });
  }

  navigateInVideo(timeframe: number) {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
      this.isCardHighlighted = timeframe;
      videoElement.currentTime = timeframe;
    }
  }
}
