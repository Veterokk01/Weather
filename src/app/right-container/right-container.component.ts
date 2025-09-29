import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { faThumbsUp, faThumbsDown, faFaceSmile, faFaceFrown } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-right-container',
  imports: [NgIf,FaIconComponent],
  templateUrl: './right-container.component.html',
  styleUrl: './right-container.component.css'
})
export class RightContainerComponent {
  today:boolean = false;
  week:boolean = true;

  celsius:boolean = true;
  farenheit:boolean = false;

  faThumbsUp:any = faThumbsUp;
  faThumbsDown:any = faThumbsDown;

  faFaceSmile:any = faFaceSmile;
  faFaceFrown:any = faFaceFrown;

  onTodayClick() {
    this.today = true;
    this.week = false;
  }

  onWeekClick() {
    this.today = false;
    this.week = true;
  }

  onCelsiusClick() {
    this.celsius = true;
    this.farenheit = false;
  }

  onFarenheitClick() {
    this.celsius = false;
    this.farenheit = true;
  }
}
