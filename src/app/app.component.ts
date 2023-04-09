import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from './app.service'
import { WeatherResponse } from './models/weatherData';
import { GraphComponent } from './graph/graph.component';

/**
 * This is the App component
 * This is the main component
 */

// export interface Tile {
//   color: string;
//   cols: number;
//   rows: number;
//   text: string;
//   value: string;
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-app';
  searchStart: boolean = false;
  searchEnd: boolean = true;
  seaLevel: string = '-';
  rain: string = '-';
  sunRise: string = '-';
  groundLevel: string = '-';
  clouds: string = '-';
  sunset: string = '-';
  country: string = '-';
  wind:string = '-';
  tempMax: string = '-';
  tempMin: string = '-';
  timezone: string = '-';

  weatherSearchForm = new FormGroup({
    city: new FormControl({value: '', disabled: false}),
    lat: new FormControl({value: '', disabled: false}),
    lon: new FormControl({value: '', disabled: false}),
  });

  latInput: String = '';
  lonInput: String = '';

  constructor(private appService: AppService, private changeDetectorRef: ChangeDetectorRef){}

  /**
   * Function to convert seconds to hrs & mins format for timestamp
   * @param timestamp timestamp number in seconds
   * @returns Formatted hrs and seconds
   */
  private getTime(timestamp: number) {
    const date: Date = new Date(timestamp * 1000);
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }
  /**
   * Return timezone based on passed seconds shift from UTC
   * @param secs timestamp number in seconds shift from UTC
   * @returns
   */
  getTimezone(secs: number) {
    let temp = new Date(secs * 1000).toISOString().substring(11, 16);
    if (secs>=0) {
      return '+' + String(temp);
    } else {
      return '-' + String(temp);
    }
  }

  /**
   * Format the weather data
   * @param data Pass Weather response
   */
  private setModelData(data: WeatherResponse) {
    const sunRise: Date = new Date(data.sys.sunrise * 1000);
    const sunSet: Date = new Date(data.sys.sunset * 1000);

    this.groundLevel = data.main.grnd_level !== undefined ? String(data.main.grnd_level): '-';
    this.seaLevel = data.main.sea_level !== undefined ? String(data.main.sea_level): '-';
    this.tempMax = data.main.temp_max !== undefined ? String(data.main.temp_max): '-';
    this.sunRise = data.sys.sunrise !== undefined ? String(this.getTime(data.sys.sunrise)): '-';
    this.clouds = data.clouds.all !== undefined ? String(data.clouds.all): '-';
    this.sunset = data.sys.sunset !== undefined ? String(this.getTime(data.sys.sunset)): '-';
    this.country = data.sys.country !== undefined ? String(data.sys.country): '-';
    this.wind = data.wind.speed !== undefined ? String(data.wind.speed): '-';
    this.tempMin = data.main.temp_min !== undefined ? String(data.main.temp_min): '-';
    this.timezone = data.timezone !== undefined ? this.getTimezone(data.timezone): '-';
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Form submit function.
   * It checks the different scenario for the city, longitude and latitude parameters
   * @returns
   */
  onSubmit() {
    console.log("Form clicked");
    console.log(this.weatherSearchForm.value);
    if (this.weatherSearchForm.value.city?.length == 0 && this.weatherSearchForm.value.lat?.length == 0 && this.weatherSearchForm.value.lon?.length == 0) {
      // Empty form. Keep some error message
      return
    }

    if (this.weatherSearchForm.value.city && this.weatherSearchForm.value.city.length > 0) {
      // Search by City
      let obj = this.appService.fetchWeatherByCity(this.weatherSearchForm.value.city);
      obj.subscribe((data: WeatherResponse)=>{
        console.log("Data fetched by city");
        console.log(data);
        this.latInput = String(data.coord.lat);
        this.lonInput = String(data.coord.lon);
        this.changeDetectorRef.detectChanges();
        this.setModelData(data);
      });
      return
    }

    if (this.weatherSearchForm.value.lat?.length == 0 || this.weatherSearchForm.value.lon?.length == 0) {
      // Search by coordinates
      // Lat & lon both is required
      return
    }

    // Search by coordinate
    let obj = this.appService.fetchWeatherByCoordinate(Number(this.weatherSearchForm.value.lat), Number(this.weatherSearchForm.value.lon));
    obj.subscribe((data: WeatherResponse)=>{
      console.log("Data fetched by coordinates")
      console.log(data);

      this.latInput = String(data.coord.lat);
      this.lonInput = String(data.coord.lon);
      this.changeDetectorRef.detectChanges();

      this.setModelData(data);
    });
  }
  /**
   * Call on reset button.
   * It reset the form
   */
  reset() {
    this.weatherSearchForm.reset;
  }

  /**
   * It disable the city or coordinate fields
   */
  disable() {
    if (this.weatherSearchForm.value.city && this.weatherSearchForm.value.city.length > 0) {
      this.weatherSearchForm.controls['lat'].disable();
      this.weatherSearchForm.controls['lon'].disable();
    } else {
      this.weatherSearchForm.controls['lat'].enable();
      this.weatherSearchForm.controls['lon'].enable();
    }

    if ((this.weatherSearchForm.value.lat && this.weatherSearchForm.value.lat.length > 0) ||
      (this.weatherSearchForm.value.lon && this.weatherSearchForm.value.lon.length > 0)) {
      this.weatherSearchForm.controls['city'].disable();
    } else {
      this.weatherSearchForm.controls['city'].enable();
    }
  }
}
