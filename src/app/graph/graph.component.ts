import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppService } from '../app.service';
import { GraphData, GraphDataSet } from '../models/weatherData';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnChanges{
  labels: Array<String> = []
  total_inc_bak: Array<Number> = []
  total_abs_bak: Array<Number> = []

  datasets!: Array<GraphDataSet>;

  options = {
    "legend": {
      "text": 'You awesome chart with average line',
      "display": true,
    },
    "scales": {
      "yAxes": [
        {
          display: true,
          "scaleLabel": {
            "display": true,
            "labelString": 'Irradiance'
         },
          "ticks": {
            "beginAtZero": true,
          },
        },
      ],
      "xAxes": [
        {
          "scaleLabel": {
            "display": true,
            "labelString": 'Irradiance 11'
         },
          "ticks": {
            "min": '0',
            "max": '50',
          },
        },
      ],
    },
  }

  @Input() lat: String = '';
  @Input() lon: String = '';

  constructor(private appService: AppService, private changeDetectorRef: ChangeDetectorRef){}

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Data fetched for graph")
    console.log(this.lat);
    if (this.lat == '' || this.lon == '') {
      this.datasets = [
        { data: [], label: 'total_abs_bak', type: 'line' },
        { data: [], label: 'total_inc_bak', type: 'line' },
      ]
      return
    }
    let obj = this.appService.fetchGraphData(Number(this.lat), Number(this.lon));
    obj.subscribe((data: GraphData)=>{

      this.labels = Object.values(data.labels);
      this.total_abs_bak = Object.values(data.total_abs_back);
      this.total_inc_bak = Object.values(data.total_inc_back);
      // this.datasets.push({ data: this.total_abs_bak, label: 'total_abs_bak', 'type': 'line' });
      this.datasets = [
        { data: this.total_abs_bak, label: 'total_abs_bak', type: 'line' },
        { data: this.total_inc_bak, label: 'total_inc_bak', type: 'line' },
      ]
      this.changeDetectorRef.detectChanges();
    });
  }
}
