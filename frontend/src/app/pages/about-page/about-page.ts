import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-page',
  imports: [CommonModule],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css'
})
export class AboutPage {
  readonly projectVideoUrl = '';
  readonly hasVideo = this.projectVideoUrl.trim().length > 0;
}