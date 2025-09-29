import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { TemperatureData } from '../Models/TemperatureData';
import { TodayData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { TodayHightlight } from '../Models/TodayHightlights';
import { EnvironmentVariables } from '../Environment/EnvironmentVariables';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  cityName:string = "Moscow";

  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  temperatureData?: TemperatureData;
  todayData?: TodayData;
  weekData?: WeekData;
  todayHightlights?: TodayHightlight;

  constructor(private httpClient: HttpClient) {}

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

  }
}
