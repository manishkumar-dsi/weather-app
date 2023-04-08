import { Component } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {
  public chart = {
    "datasets": [
      { "data": [0, 30, 20, 40, 35, 45, 33, 0, 0], "label": "Bar 1", "type": "line"  },
      { "data": [0, 50, 60, 55, 59, 30, 40, 0, 0], "label": "Lin 2", "type": "line"  },
      { "data": [45, 5, 50, 15, 45, 45, 45, 45, 45], "label": "Line", "type": "line" }
    ],
    "labels": ["FirstPlaceholder", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "LastPlaceholder"],
    "options": {
      "legend": {
        "text": "You awesome chart with average line",
        "display": true,
      },
      "scales": {
        "yAxes": [{
          "ticks": {
          "beginAtZero": true
          }
        }],
        "xAxes": [{
          "ticks": {
          "min": "Monday",
          "max": "Sunday",
          }
        }],
      }
    }
}
}
