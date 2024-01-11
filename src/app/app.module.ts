import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { VideoDetailsComponent } from './components/video-details/video-details.component';
import { UserService } from './services/user.service';
import { VideoService } from './services/video.service';
import { ReactionService } from './services/reaction.service';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/header/header.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TitleEditDirective } from './shared/title-edit.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    VideoListComponent,
    VideoDetailsComponent,
    HeaderComponent,
    TitleEditDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [UserService, VideoService, ReactionService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
