import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { CovidData, DateCovidData } from './models/covid-data';

const url : string = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-25-2021.csv'
const datewise: string = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv'
let rows :any = [];


@Injectable({
  providedIn: 'root'
})
export class CovidDataService {
  constructor(private http:HttpClient) {}

  getData(){
    return this.http.get(url,{responseType:'text'}).pipe(map((data)=>{
      //console.log(data);
      let cols :any = [];
      let covidData;
      let raw = {};
      //let temp;
      
      rows = data.split('\n');
      //console.log('first row',rows[1]);
      // let a:any[] = rows[9].split(`/,(?!\s)/`);
      // console.log('9th row',a);
      rows.splice(0,1);
      //console.log('first row',rows[0]);
      rows.forEach((row:any)=>{
        if(row.length ==0)
        {
          return
        }
      cols = (row.split(/,(?!\s)/))
         //console.log(cols);
             
       covidData = {
        country: cols[3],
        confirmed : +cols[7],
        recovered : +cols[8],
        death : +cols[9],
        active : +cols[10],
        } 
        //console.log("inllllllll loop");
        //console.log('covidData',covidData);
        //raw[covidData.country] = {};
        let  temp : CovidData
        if(raw[covidData.country])
        temp = raw[covidData.country];
        //console.log(temp);
        //console.log(Object.keys(raw));
        
        if(temp){
          //console.log('in temp');
          
          temp.confirmed= covidData.confirmed + (temp.confirmed ? temp.confirmed : 0 );
          temp.recovered = covidData.recovered + (temp.recovered ? temp.recovered : 0 );
          temp.death = covidData.death + (temp.death ? temp.death : 0 );
          temp.active = covidData.active + (temp.active  );
    
          raw[covidData.country] = temp;
        }
        else{          
          //console.log('else temp');
          raw[covidData.country] = covidData;
        }
        
      })
      //console.log('covidData',covidData);
    
      //console.log(raw);
      //console.log(Object.keys(raw));
      return Object.values(raw);
    }))
  }

  getDatewise(){
   return this.http.get(datewise,{responseType:'text'}).pipe(map((data)=>{
      //console.log(data);
      
      let rows = [];
      let cols = [];
      let datewiseData;
      let raw = {};
      rows = data.split('\n');
      rows.splice(0,1);
      //console.log(rows);
      
      rows.forEach((row)=>{
         cols = row.split(',');

         let datewise: DateCovidData = {
          date: cols[3],
          confirmed: Math.trunc(cols[4])
        }
        
        let temp = cols[2];

         if(Object.keys(raw).includes(temp)){
          datewiseData.push(datewise);
          raw[temp] = [...datewiseData];
         }
         else{
          datewiseData =[];
          datewiseData.push(datewise);
          raw[temp] = datewiseData;
         }
        
      })
      // console.log("Raw", raw);
      // console.log("Raw", Object.keys(raw));
      // console.log("Raw", Object.values(raw));
      return raw;
    }))
  }
}
