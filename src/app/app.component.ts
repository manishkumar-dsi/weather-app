import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from './app.service'
import { WeatherResponse } from './models/weatherData';
import { GraphComponent } from './graph/graph.component';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  value: string;
}

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

  private setModelData(data: WeatherResponse) {
    this.groundLevel = String(data.main.grnd_level);
    this.seaLevel = String(data.main.sea_level);
    this.tempMax = String(data.main.temp_max);
    this.sunRise = String(data.sys.sunrise);
    this.clouds = String(data.clouds.all);
    this.sunset = String(data.sys.sunset);
    this.country = String(data.sys.country);
    this.wind = String(data.wind.speed);
    this.tempMin = String(data.main.temp_min);
    this.timezone = String(data.timezone);
    this.changeDetectorRef.detectChanges();
  }

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
  reset() {
    this.weatherSearchForm.reset;
  }

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
