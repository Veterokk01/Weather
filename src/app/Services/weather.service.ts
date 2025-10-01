import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { TemperatureData } from '../Models/TemperatureData';
import { TodayData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { TodayHightlight } from '../Models/TodayHightlights';
import { EnvironmentVariables } from '../Environment/EnvironmentVariables';
import { Observable } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  cityName:string = "Moscow";
  language:string ="en-US";
  date:string = '20251002';
  units:string = 'm';

  currentTime:Date = new Date()

  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  temperatureData: TemperatureData;
  todayData?: TodayData;
  weekData?: WeekData;
  todayHightlights?: TodayHightlight;

  constructor(private httpClient: HttpClient) {
    this.getData();
  }  

  getSummaryImage(summary:string):string {
    var cloudySunny = "https://cdn-icons-png.flaticon.com/128/17189/17189587.png";
    var rainSunny = "https://cdn-icons-png.flaticon.com/128/12607/12607703.png";
    var windy = "https://cdn-icons-png.flaticon.com/128/9829/9829471.png";
    var sunny = "https://cdn-icons-png.flaticon.com/128/439/439842.png";
    var rainy = "https://cdn-icons-png.flaticon.com/128/4724/4724094.png";

    if(String(summary).includes("Partly Cloud") || String(summary).includes("P Cloud")) return cloudySunny
    else if(String(summary).includes("Partly Rainy") || String(summary).includes("P Rainy")) return rainSunny
    else if(String(summary).includes("wind")) return windy
    else if(String(summary).includes("rain")) return rainy
    else if(String(summary).includes("Sun")) return sunny


    return cloudySunny
  }

  prepareData():void {
    this.currentTime = new Date();
    this.temperatureData.day = this.weatherDetails['v3-wx-observations-current'].dayOfWeek;
    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2, '0')}:${String(this.currentTime.getMinutes()).padStart(2, '0')}`;
    this.temperatureData.temperature = this.weatherDetails['v3-wx-observations-current'].temperature;
    this.temperatureData.location = `${this.locationDetails.location.city[0]}:${this.locationDetails.location.country[0]}`;
    this.temperatureData.rainPercent = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
    this.temperatureData.SummaryPhrase = this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;
    this.temperatureData.summaryImage = this.getSummaryImage(this.temperatureData.SummaryPhrase);
  }

  getLocationDetails(cityName: string, language:string):Observable<LocationDetails>{
    return this.httpClient.get<LocationDetails>(EnvironmentVariables.weatherApiLocationBaseURL, {
      headers: new HttpHeaders()
        .set(EnvironmentVariables.xRapidApiKeyName, EnvironmentVariables.xRapidApiKeyValue)
        .set(EnvironmentVariables.xRapidApiHostName, EnvironmentVariables.xRapidApiHostValue),
      params: new HttpParams()
        .set('query', cityName)
        .set('language', language)
    });
  }

  getWeatherReport(date: string, latitude: number, longitude: number, language: string, units: string):Observable<WeatherDetails> {
    return this.httpClient.get<WeatherDetails>(EnvironmentVariables.weatherApiForecastBaseURL, {
      headers: new HttpHeaders()
        .set(EnvironmentVariables.xRapidApiKeyName, EnvironmentVariables.xRapidApiKeyValue)
        .set(EnvironmentVariables.xRapidApiHostName, EnvironmentVariables.xRapidApiHostValue),
      params: new HttpParams()
        .set('date', date)
        .set('latitude', latitude)
        .set('longitude', longitude)
        .set('language', language)
        .set('units', units)

    });
  }

  getData() {
    var latitude = 0;
    var longitude = 0;
    this.getLocationDetails(this.cityName, this.language).subscribe({
      next:(response)=> {
        this.locationDetails = response;
          latitude = this.locationDetails?.location.latitude[0];
          longitude = this.locationDetails?.location.longitude[0];

          this.getWeatherReport(
            this.date,
            latitude,
            longitude,
            this.language,
            this.units
          ).subscribe({
           next:(response) => {
            this.weatherDetails = response;

            this.prepareData()
          }
        });
      }
    });

    
  }
}
