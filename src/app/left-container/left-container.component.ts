import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { faMagnifyingGlass, faLocationDot, faCloud, faCloudRain } from '@fortawesome/free-solid-svg-icons'
import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-left-container',
  imports: [FaIconComponent],
  templateUrl: './left-container.component.html',
  styleUrl: './left-container.component.css',
  providers: [WeatherService]
})

export class LeftContainerComponent {
[x: string]: any;
  faMagnifyingGlass:any = faMagnifyingGlass;
  faLocationDot:any = faLocationDot;

  faCloud:any = faCloud;
  faCloudRain:any = faCloudRain;

  constructor(public weatherService:WeatherService) {}

  onSearch (location: string) {
    this.weatherService.cityName = location;
    this.weatherService.getData();
  }
}
