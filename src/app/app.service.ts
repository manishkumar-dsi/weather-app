import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { GraphData, WeatherResponse } from './models/weatherData';
/**
 * Service for api communication
 */
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private openWeatherURL = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = 'cb1508bb97641beb911a5a12ca2c138a';
  constructor(private http: HttpClient,) { }

  /**
   * Fetch weather data based on coordinates
   * @param lat Latitude
   * @param lon Longitude
   * @returns Observables<WeatherResponse>
   */
  fetchWeatherByCoordinate(lat: number, lon: number): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(this.openWeatherURL + '?lat=' + lat +'&lon=' + lon + '&units=metric' +  '&appid=' + this.apiKey);
  }

  /**
   * Fetch weather data based on city
   * @param cityName city name
   * @returns Observables<WeatherResponse>
   */
  fetchWeatherByCity(cityName: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(this.openWeatherURL + '?q=' + cityName  + '&units=metric' + '&appid=' + this.apiKey);
  }

  /**
   * Fetch Irradiance data based on coordinates
   * @param lat Latitude
   * @param lon Longitude
   * @returns Observable<GraphData>
   */
  fetchGraphData(lat: number, lon: number): Observable<GraphData> {
    return this.http.get<GraphData>('https://manishkumardsi.pythonanywhere.com?lat=' + lat + '&lon=' + lon);
  }
}
