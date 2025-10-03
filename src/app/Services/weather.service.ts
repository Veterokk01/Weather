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
import { faR } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  cityName:string = "Moscow";
  language:string ="en-US";
  date:string = '20251004';
  units:string = 'm';

  today:boolean = false;
  week:boolean = true;
  
  celsius:boolean = true;
  farenheit:boolean = false;

  currentTime:Date = new Date()

  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  temperatureData: TemperatureData;

  todayData?: TodayData[] = [];
  weekData?: WeekData[] = [];
  todayHightlights?: TodayHightlight = new TodayHightlight();

  constructor(private httpClient: HttpClient) {
    this.temperatureData = new TemperatureData();
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

  getTimeFromString(localTime: string) {
    return localTime.slice(12, 17)
  }

  fillTodayHighlights() {
    this.todayHightlights.airQuality = this.weatherDetails['v3-wx-globalAirQuality'].globalairquality.airQualityIndex;
    this.todayHightlights.humidity = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
    this.todayHightlights.sunrise = this.getTimeFromString( this.weatherDetails['v3-wx-observations-current'].sunriseTimeLocal);
    this.todayHightlights.sunset = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunsetTimeLocal);
    this.todayHightlights.uvindex = this.weatherDetails['v3-wx-observations-current'].uvIndex;
    this.todayHightlights.visibility = this.weatherDetails['v3-wx-observations-current'].visibility;
    this.todayHightlights.windStatus = this.weatherDetails['v3-wx-observations-current'].windSpeed;
  }

  fillTodayData() {
    var todayCount = 0;
    while(todayCount < 7) {
      this.todayData.push(new TodayData());
      this.todayData[todayCount].time = this.weatherDetails['v3-wx-forecast-hourly-10day'].validTimeLocal[todayCount].slice(11, 16);
      this.todayData[todayCount].temperature = this.weatherDetails['v3-wx-forecast-hourly-10day'].temperature[todayCount];
      this.weekData[todayCount].summeryImage = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[todayCount]);
      todayCount++
    }
  }
  fillWeekData() {
    var weekCount = 0;
    while(weekCount < 7) {
      this.weekData.push(new WeekData());
      this.weekData[weekCount].day = this.weatherDetails['v3-wx-forecast-daily-15day'].dayOfWeek[weekCount].slice(0, 3);
      this.weekData[weekCount].tempMax = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMax[weekCount];
      this.weekData[weekCount].tempMin = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMin[weekCount];
      this.weekData[weekCount].summeryImage = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-daily-15day'].narrative[weekCount]);
      weekCount++
    }
  }

  fillTemperatureDataModel() {
    this.currentTime = new Date();
    this.temperatureData.day = this.weatherDetails['v3-wx-observations-current'].dayOfWeek;
    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2, '0')}:${String(this.currentTime.getMinutes()).padStart(2, '0')}`;
    this.temperatureData.temperature = this.weatherDetails['v3-wx-observations-current'].temperature;
    this.temperatureData.location = `${this.locationDetails.location.city[0]}:${this.locationDetails.location.country[0]}`;
    this.temperatureData.rainPercent = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
    this.temperatureData.SummaryPhrase = this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;
    this.temperatureData.summaryImage = this.getSummaryImage(this.temperatureData.SummaryPhrase);
  }

  prepareData():void {
  this.fillTemperatureDataModel();
  this.fillWeekData();
  this.fillTodayData();
  this.fillTodayHighlights();
  }

  celsiusToFarenheit(celsius: number) {
    return (celsius * 1.8) + 32;
  }

  farenheitToCelsius(farenheit: number) {
    return(farenheit - 32) * 0.555;
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
