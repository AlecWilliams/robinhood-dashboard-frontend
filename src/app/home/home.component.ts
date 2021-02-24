import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { StockService } from '../stock.service';
//import * as Highcharts from 'highcharts';
import * as Highcharts from 'highcharts/highstock';
import { interval, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export class UserProfile {
  accountNumber: string;
  buying_power: string;
  cash: string;
  margin_balances : {
    uncleared_deposits: string,
    cash: string
  };

}

export class PortfolioHistoricals {
  equity_historicals = [];
}
export class UserPortfolio {

}

export class StockInfo  {
  name: string;
  country: string;
  symbol: string;
  tradeable: boolean;

}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stockName: string;
  data$: StockInfo[];
  userProfile$ : UserProfile;
  userPortfolio$ : any;
  zoomIndex = 0;
  testValue;
  chartColor = "#00c805";
 
  
  
  @ViewChild('dropdown') dropdown;


  subscription: Subscription;
  Chart;
  showChart: boolean = false;
  options;
  constructor(private stockService: StockService, private AuthService: AuthService, private http: HttpClient) {

    const that = this;
    this.testValue = 0;
    var crosshair,
      UNDEFINED;
     this.options = {
      chart: {
        type: 'line',
        height: 400,
        marginRight: 60,
        marginLeft: 60,
    
        mosueover: {
          click: function(e) {
              //console.log(this.xAxis[0].min);
              //console.log(that.testValue); //Using the helper constant to access your declared property
          }
        },
      },

      plotOptions: {
        series: {
            point: {
                events: {
                    mouseOver: function () {
                        var chart = this.series.chart;
                        that.testValue = this.y;
                        var r = chart.renderer,
                        left = chart.plotLeft,
                        top = chart.plotTop,
                        width = chart.plotWidth,
                        height = chart.plotHeight,
                        x = this.plotX,
                        y = this.plotY;
        
                      if (this.series.options.enabledCrosshairs) {
                        crosshair = r.path(['M', left + x, top+ 30, 'L', left + x, top + height])
                          .attr({
                            'stroke-width': 1,
                            stroke: '#4a4f52'
                          })
                          .add();
                        }         
                    },
                    mouseOut: function () {
                      if (crosshair.d !== UNDEFINED){
                        crosshair.destroy();
                      }
    
                        
                       
                    }
                }
            },
            states: {
              hover: {
                  enabled: false
              }
            }
        },
        line: {
         
          color: this.chartColor,
          lineWidth: 2,
        },
      },


      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
     
      tooltip: {
        split: true,
        borderWidth: 0,
        useHTML: true,
        backgroundColor: 0,

        formatter: function() {

          let crosshair = document.getElementsByClassName('custom-crosshair');

          crosshair

          var s = '' ;
          var points = this.points;
          var dataMin = Highcharts.charts[0].xAxis[0].min;
          var dataMax = Highcharts.charts[0].xAxis[0].max;
 

          const _MS_PER_DAY = 1000 * 60 * 60 * 24;
          var dateA = new Date(dataMin);
          var dateB = new Date(dataMax);
          const utc1 = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
          const utc2 = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
          var difference = Math.floor((utc2 - utc1) / _MS_PER_DAY);
          console.log(difference);

          var a = new Date(dataMax - dataMin);
          //console.log("date: " + a);
          var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          var year = a.getFullYear();
          var month = months[a.getMonth()];
          var date = a.getDate();
          var hour = a.getHours();
          var min = a.getMinutes();
          var sec = a.getSeconds();
          var time =  date ;
  
  
          const d  = new Date();
          let myDate = this.x;
          myDate -= d.getTimezoneOffset() *60000;
          
         // console.log("DATE: " + Date.parse(myDate));
          //zoom set to 1 day
          if(difference == 0)
          {
            s = Highcharts.dateFormat('%I:%M %p', myDate );
          }
          //else use week format
          else{
            //Highcharts.dateFormat('Week from %A,%b %e,%Y', this.x)
            s = Highcharts.dateFormat('%b %e,%I:%M %p', myDate, );
          }
          
          return s;
        },
        positioner: function(labelWidth, labelHeight, point) {
          var tooltipX = (this.chart.plotLeft + point.plotX - (labelWidth / 2));
          var tooltipY = 0;
          return {
              x: tooltipX,
              y: tooltipY
          };
        }
      },
      xAxis: {
        type: 'datetime',
        visible: false,
        crosshair: {
          width: 0
        },
        labels: {
          enabled: false,
          formatter: function() {
           
            return Highcharts.dateFormat('%e %b %y',this.value);
          }
        },
      },
      yAxis : {      
        tickLength: 0,
        gridLineWidth: 0,
        maxPadding: 0.2,
        minPadding: 0.2,
        offset: -70,       
        labels: {
          enabled: false,
        },
        plotLines: [{
          value: 0,
          color: 'green',
          dashStyle: 'dot',
          width: 1,
         
  
      }]
  
      },
      rangeSelector: {
        verticalAlign: 'bottom',
        selected: 0,
        inputEnabled: false,
        allButtonsEnabled: true,
        labelStyle: {
          display: 'none'
        },
        buttonTheme: {
          width: 40,
          fill: 0,
          
        },
        buttons: [{
          type: 'day',
          count: 1,
          text: '1D',
          events: {
            click: function() {
                this.zoomIndex = 0;
            }
          }
      }, {
        type: 'week',
        count: 1,
        text: '1W',
        events: {
          click: function() {
            this.zoomIndex = 1;
             // this.initUserPortfolioChart2();
          }
        }
      }, {
          type: 'month',
          count: 1,
          text: '1M'
      }, {
          type: 'month',
          count: 3,
          text: '3M'
      }, {
          type: 'month',
          count: 6,
          text: '6M'
      },  {
          type: 'year',
          count: 1,
          text: '1y'
      }, {
          type: 'all',
          text: 'All',
          events: {
            click: function() {
                this.zoomIndex = 2;
            }
          }
      }]
      },
      series: [
        {
          name: 'Normal',
          enabledCrosshairs: true,
          data: []
        },
        
      ]
    }





   }


  ngOnInit(): void {


    if(this.AuthService.isLoggedIn())
    {
      this.showChart = true;
      //Get profile info
      this.AuthService.getProfileInformation().subscribe((data: UserProfile) => {
        this.userProfile$ =  data;
       
        //now init the chart
        //this.initUserPortfolioChart2();
      });

      this.getPortoflioInformation();

      //pull it again ever 10 seconds if we are still logged in
      const loop = interval(90000).subscribe(x => {
        if(!this.AuthService.isLoggedIn())
        {
          loop.unsubscribe();
        }
        else{
          this.getPortoflioInformation();
        }     
      });


      // this.AuthService.getUserHoldings().subscribe((data: UserPortfolio) => {
      //   console.log(data);
      // })
    }

 
    
  }


  // initUserPortfolioChart()
  // {
  //     //Create Chart
  //     this.stockService.getStockInfo('TSLA').subscribe(data => {
  //       const updated_abnormal_data = [];
  
  //       data.forEach(row => {
  //         const d  = new Date();
  //         let myDate = row.begins_at;
  //         myDate += d.getTimezoneOffset() *60000;
  
  //         //console.log( myDate.toString())
  //         const temp_row = [
  //          // myDate,
  //           //do Date.parse(row.beings_at)
  //           Date.parse(row.begins_at),
  //           Number(row.open_price)
  //         ];
  //         updated_abnormal_data.push(temp_row);
  //       });
  //       //console.log(updated_abnormal_data);
  
  //       this.options.series[0]['data'] = updated_abnormal_data;
  
  //       this.Chart = Highcharts.stockChart('container', this.options);
        
  //      });
  // }
  
  initUserPortfolioChart()
  {
      //Create Chart
      this.AuthService.getUserHoldingsWeekly("week").subscribe((data: PortfolioHistoricals) => {
        const userData = [];

        const historicals = data.equity_historicals;
        console.log(historicals);
        historicals.forEach(row => {

            const temp_row = [
              // myDate,
               //do Date.parse(row.beings_at)
               Date.parse(row.begins_at),
               Number(row.open_equity)
             ];
            
             userData.push(temp_row);
             this.testValue = row.open_equity;
     

        });

        this.Chart.series[0].setData(userData);
        
        //we are at a loss, make color red
        if(userData[0][1] > userData[userData.length-1][1])
        {
          this.Chart.series[0].color = "#ff3c00";
        }
        else{
          this.Chart.series[0].color = "#00c805";
        }
         
         // this.Chart.redraw();
        
        //console.log(this.Chart.plotOptions);
        this.Chart.xAxis[0].setExtremes(userData[0].begins_at,userData[userData.length-1].begins_at);
      });
  }

  initUserPortfolioChart2()
  {
      //Create Chart
      this.AuthService.getUserHoldings().subscribe((data: PortfolioHistoricals) => {
        const userData = [];

        const historicals = data.equity_historicals;
        console.log(historicals);
        historicals.forEach(row => {

            const temp_row = [
              // myDate,
               //do Date.parse(row.beings_at)
               Date.parse(row.begins_at),
               Number(row.open_equity)
             ];
            
             userData.push(temp_row);
             this.testValue = row.open_equity;
        });
        
        this.options.series[0]['data'] = userData;

        //we are at a loss, make color red
        if(userData[0][1] > userData[userData.length-1][1])
        {
          this.options.series[0].color = "#ff3c00";
        }
        else{
          this.options.series[0].color = "#00c805";
        }

        this.Chart = Highcharts.stockChart('container', this.options);
      
      });
  }




   parseISOLocal(s) {
    var b = s.split(/\D/);
    return new Date(b[0], b[1]-1, b[2], b[3], b[4], b[5]);
  }
  getPortoflioInformation()
  {
    this.AuthService.getPortfolioInformation().subscribe((data: UserPortfolio) => {
      //console.log(data);
      this.userPortfolio$ = data;
    });
  }

  getApiResponse(url) {
    return this.http.get(url, {})
      .toPromise().then(res => {
        return res;
      });
  }

  getStock()
  {
   // console.log(this.stockName);

    
    this.stockService.getTest(this.stockName).subscribe(data => {
      //console.log(data);
      this.data$ = data;
      if(data.length > 0)
      {
        
        this.dropdown.show(true);
      }
        

     
    })
  }


  getStockInfo()
  {
    //this.stockService.getTest('TEST');
     //this.AuthService.testChallenge();
    this.stockService.getStockInfo('TSLA').subscribe(data => {
     return data;
    });
  }



  dropdownClick()
  {
    //dont call getStock() as that will reopen dropdown
    this.stockService.getTest(this.stockName).subscribe(data => {
      //console.log(data);
      this.data$ = data;
    });
    this.dropdown.show(false);
    this.dropdown.toggle(false);

  }

  stockInputChange(event)
  {
    console.log('IT WORKED');
    if(this.stockName.length > 2)
    {
      this.getStock();
      //console.log(this.stockName);
      //this.dropdown.show(true);
    }
    else{
      this.dropdown.toggle(false);
      this.data$=null;
      

    }
   
  }
 
}
