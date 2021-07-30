import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartReadyEvent, GoogleChartInterface } from 'ng2-google-charts';
import { CovidDataService } from 'src/app/covid-data.service';
import { CovidData } from 'src/app/models/covid-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pieChart: GoogleChartInterface;
  columnChart: GoogleChartInterface;
  @ViewChild('mychart', { static: false }) mychart;
  @ViewChild('mychart1', { static: false }) mychart1;


  totalConfirmed = 0;
  totalRecovered = 0;
  totalDeath = 0;
  totalActive = 0;
  globalData: CovidData[];
  isData: boolean = false;
  category: string;

  constructor(private report: CovidDataService) { }

  ngOnInit(): void {
    this.report.getData().subscribe((data: any) => {
      //console.log(data);
      this.globalData = [...data];
      data.forEach((d) => {
        this.totalConfirmed += d.confirmed;
        this.totalRecovered += d.recovered;
        this.totalDeath += d.death;
        this.totalActive += d.active;
      })
      //console.log(this.totalConfirmed);
      this.category = document.getElementById('confirmed').id
      this.initChart(this.category, false);
    })
  }

  initChart(category: string, refresh: boolean) {
    var dataTable = [];
    //console.log("category",category);

    dataTable.push(['Countries', 'Cases']);
    this.globalData?.forEach((d) => {
      let value: number;
      let country: string;
      //console.log("in forEach",category);
      if (category == 'confirmed' && d?.confirmed > 1000000) {
        //console.log("in con");    
        value = d.confirmed;
        country = d.country;

      }
      else if (category == 'recovered' && d?.recovered > 1000) {
        value = d.recovered;
        country = d.country;
      }
      else if (category == 'active' && d?.active > 1000) {
        value = d.active;
        country = d.country;
      }
      if (country)
        dataTable.push([country, value]);
    })


    //console.log(dataTable);

    //pieChart
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500,
        width: 550
      },
    };

    //columnChart
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: [...dataTable],
      options: {
        height: 500,
        width: 550
      }
    }
    this.isData = true;
    //console.log(this.mychart);
    if (refresh) {
      setTimeout(() => this.mychart?.draw(), 250);
      setTimeout(() => this.mychart1?.draw(), 250)

    }
  }

  onSelect(category) {
    //console.log("button",category);
    this.initChart(category, true);

  }

  ready(event: ChartReadyEvent) {
    // your logic
    // console.log(event);
    // console.log(this.mychart);
    // console.log(this.mychart1);
  }

}
