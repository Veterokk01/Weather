import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-right-container',
  imports: [NgIf],
  templateUrl: './right-container.component.html',
  styleUrl: './right-container.component.css'
})
export class RightContainerComponent {
  today:boolean = false;
  week:boolean = true;

  celsius:boolean = true;
  farenheit:boolean = false;

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
