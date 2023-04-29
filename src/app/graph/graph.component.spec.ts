import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef, SimpleChange } from '@angular/core';
import { AppService } from '../app.service';
import { GraphComponent } from './graph.component';

describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;
  let appService: AppService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ GraphComponent ],
      providers: [ ChangeDetectorRef, AppService ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    appService = TestBed.inject(AppService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update the graph data when lat and lon inputs change', () => {
    const fetchGraphDataSpy = spyOn(appService, 'fetchGraphData').and.callThrough();
    component.lat = '10';
    component.lon = '20';
    fixture.detectChanges();

    expect(fetchGraphDataSpy).toHaveBeenCalledWith(10, 20);
    expect(component.datasets.length).toBeGreaterThan(0);
    expect(component.labels.length).toBeGreaterThan(0);
    expect(component.total_abs_bak.length).toBeGreaterThan(0);
    expect(component.total_inc_bak.length).toBeGreaterThan(0);

    const chartElement = fixture.debugElement.query(By.css('canvas')).nativeElement;
    expect(chartElement).toBeTruthy();
  });

  it('should not update the graph data when lat or lon inputs are empty', () => {
    const fetchGraphDataSpy = spyOn(appService, 'fetchGraphData').and.callThrough();
    component.lat = '';
    component.lon = '20';
    fixture.detectChanges();

    expect(fetchGraphDataSpy).not.toHaveBeenCalled();
    expect(component.datasets.length).toBe(2);
    expect(component.labels.length).toBe(0);
    expect(component.total_abs_bak.length).toBe(0);
    expect(component.total_inc_bak.length).toBe(0);

    const chartElement = fixture.debugElement.query(By.css('canvas'));
    expect(chartElement).toBeFalsy();
  });
});
