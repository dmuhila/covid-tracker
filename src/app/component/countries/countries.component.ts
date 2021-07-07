import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { CovidDataService } from 'src/app/covid-data.service';
import { CovidData, DateCovidData } from 'src/app/models/covid-data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  
  lineChart: GoogleChartInterface;
  @ViewChild('mychart ', {static: false}) mychart;

  countries = [];
  confirmed = 0;
  recovered = 0;
  death = 0;
  active = 0;
  globalData : CovidData[];
  dateData = {};
  country : string;
  datewise : DateCovidData[];
  dataTable;

  constructor(private report:CovidDataService) { }

  ngOnInit() {
    this.report.getData().subscribe((data : CovidData[])=>{
      this.globalData = [...data];
      data.map((d)=>{
        this.countries.push(d.country);
      })
      
          this.confirmed = this.globalData[0]?.confirmed;
          this.recovered = this.globalData[0]?.recovered;
          this.death = this.globalData[0]?.death;
          this.active = this.globalData[0]?.active;
          //this.initChart();          
      })
      //console.log(this.globalData); 

      this.report.getDatewise().subscribe((data)=>{
        this.dateData = data;
        // let index = Object.keys(data).indexOf(country);
        // console.log(index);
        // if(data)
        // {
        //   this.datewise = data['Afghanistan'];
        // }
        this.onSelect('Afghanistan');
        //this.initChart(this.dateData['Afghanistan'],false);
      })
  }

  onSelect(country:string){
    //console.log(country);
    this.datewise = [];

    this.globalData.forEach((c)=>{
      if(c.country===country){
        this.confirmed = c.confirmed;
        this.recovered = c.recovered;
        this.death = c.death;
        this.active = c.active;
      }
    })
    //console.log(this.confirmed);
    this.datewise = this.dateData[country];
    if(country=='Afghanistan') this.initChart(this.datewise,false);
    else this.initChart(this.datewise,true);
  }

  initChart(input:DateCovidData[],refresh:boolean){
    this.dataTable =[];
    this.dataTable.push(['Date','Cases']);
    if(input){
      input.forEach((d)=>{
        let date = d.date;
        let cases = d.confirmed;
        this.dataTable.push([date,cases]);
      })
    }
    //console.log("Datatable in",this.dataTable);
    
    this.lineChart = {
      chartType: 'LineChart',
      dataTable: [...this.dataTable],
      options: {
        height:500
      },
    }
    if(refresh){
      setTimeout(() => this.mychart?.draw(), 250);
    }
    
  }
}
