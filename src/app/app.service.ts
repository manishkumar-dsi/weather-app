import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { WeatherResponse } from './models/weatherData';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private openWeatherURL = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = 'cb1508bb97641beb911a5a12ca2c138a';
  constructor(private http: HttpClient,) { }

  fetchWeatherByCoordinate(lat: number, lon: number): Observable<WeatherResponse> {
    console.log(this.openWeatherURL + '?lat=' + lat +'&lon=' + lon + '&appid=' + this.apiKey);
    // return this.http.get('${this.openWeatherURL}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
    return this.http.get<WeatherResponse>(this.openWeatherURL + '?lat=' + lat +'&lon=' + lon + '&appid=' + this.apiKey);
  }

  fetchWeatherByCity(cityName: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(this.openWeatherURL + '?q=' + cityName + '&appid=' + this.apiKey);
  }
}
