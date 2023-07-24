import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import {StatesDTO, StatesService} from "../core/services/swagger-gen/service";
import {Observable, tap} from "rxjs";

@Component({
  selector: 'app-us-map',
  templateUrl: './us-map.component.html',
  styleUrls: ['./us-map.component.css']
})
export class UsMapComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer: ElementRef;
  @ViewChild('legendContainer', { static: true }) legendContainer: ElementRef;
  public selectList=[{id:1,description:'Overall risk level'}, {id: 2,description:'Cases per 100k level'},{id:3,description:'Test positivity ration level'},{id:4,description:'Infection rate level'}]
  public defaultValue=1;
  public riskOption=1;
  public stateData:StatesDTO[];
  public dataObservable: Observable<StatesDTO[]>;
  private riskColors = ['#808080','#A1FF2C', '#FFFF00', '#FFA500', '#FF0000','#780d0d'];
  public constructor(public statesService:StatesService) {
  }
  ngOnInit() {
    this.loadData();
    this.dataObservable.subscribe(
      (data) => {
        this.stateData = data;
        this.drawMap();
      });
    this.drawLegend();
  }
  public changeRisk($event){
    this.riskOption=$event.value;
    this.loadData();
    this.dataObservable.subscribe(
      (data) => {
        this.stateData = data;
        this.drawMap();
      },);
  }


  drawMap() {
    const svgWidth = 800;
    const svgHeight = 600;
    const svgContainer = d3.select(this.mapContainer.nativeElement);
    svgContainer.selectAll("*").remove();
    const svg = d3.select(this.mapContainer.nativeElement)
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);
    const projection = d3.geoAlbersUsa()
      .translate([svgWidth / 2, svgHeight / 2]) // Центрирование проекции
      // @ts-ignore
      .scale([950]); // Масштабирование

    const path = d3.geoPath().projection(projection);
    d3.json("https://gist.githubusercontent.com/Bradleykingz/3aa5206b6819a3c38b5d73cb814ed470/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json").then((uState) => {
      svg.selectAll('path')
        // @ts-ignore
        .data(uState.features)
        .enter()
        .append('path')
        .attr("d", path)
        .attr('class', 'state')
        .style('stroke', '#333') // Цвет границы штата
        .style('stroke-width', '0.5')
        .style('fill','none')
        .style('fill', (d: any) => this.getRiskColor(d.id));
    });

  }
  private drawLegend() {
    const legendWidth = 200;
    const legendHeight = 10;
    const svg = d3.select(this.legendContainer.nativeElement)
      .append('svg')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('border-radius', '10px');
    const numColors = this.riskColors.length;
    const legendScale = d3.scaleLinear()
      .domain([1, numColors ])
      .range([0, legendWidth]);
    const legendRectWidth = legendWidth / (numColors-1 );
    for (let i = 0; i < numColors ; i++) {
      const color = this.riskColors[i];
      svg.append('rect')
        .attr('x', legendScale(i))
        .attr('y', 0)
        .attr('width', legendRectWidth)
        .attr('height', legendHeight)
        .attr('fill', color)

    }
    svg.selectAll('rect')

  }
  private getRiskColor(stateCode: string): string {
    let state=this.getDataForState(stateCode);
    if (!state) return this.riskColors[0];
    let riskLevel=state.riskLevel
    return this.riskColors[riskLevel];
  }
  private getDataForState(stateCode: string): any {
    return this.stateData.find((data) => data.stateCode == +stateCode);
  }
  private loadData(){
    switch (this.riskOption){
      case 2:{
        this.dataObservable =this.statesService.getCasesPer100kLevel();
        break;
      }
      case 3:{
        this.dataObservable =this.statesService.getPositivityTestLevel();
        break;
      }
      case 4:{
        this.dataObservable =this.statesService.getInfectionLevel();
        break;
      }
      default:{
        this.dataObservable =this.statesService.getOverallLevel();
        break
      }
    }
  }
}
