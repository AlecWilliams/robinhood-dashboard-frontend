import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { AuthService } from '../auth/auth.service';

export class PortfolioHistoricals {
  equity_historicals = [];
}
export class UserProfile {
  accountNumber: string;
  buying_power: string;
  cash: string;
  margin_balances : {
    uncleared_deposits: string,
    cash: string
  };

}

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.css']
})
export class StockChartComponent implements OnInit {
  Chart;
  showChart: boolean = false;
  options;
  testValue;
  currentPrice$ : any;
  dailyProfit$: number;
  zoomLevel = 0;
  zoomMessage = "Today"

  constructor(private authService: AuthService) { 

    const that = this;
    var crosshair,
    UNDEFINED;

    this.options = {
      chart: {
        type: 'line',
        height: '36%',
      
        marginRight: 50,
        marginLeft: 50,
  
      },

      plotOptions: {
        series: {
            point: {
                events: {
                    mouseOver: function () {
                        var chart = this.series.chart;
                        that.currentPrice$ = this.y;
                        var r = chart.renderer,
                        left = chart.plotLeft,
                        top = chart.plotTop,
                        //width = chart.plotWidth,
                        height = chart.plotHeight,
                        x = this.plotX
                     
        
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
          const d  = new Date();
          let myDate = this.x;
          myDate -= d.getTimezoneOffset() *60000;
          
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
        maxPadding: 0.1,
        minPadding: 0,
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
        enabled: false,
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
    if(this.authService.isLoggedIn())
    {
      this.showChart = true;
      //Get profile info
      this.authService.getProfileInformation().subscribe((data: UserProfile) => {

        this.initUserPortfolioChart();
      });

      //this.getPortoflioInformation();

      //pull it again ever 10 seconds if we are still logged in
      // const loop = interval(90000).subscribe(x => {
      //   if(!this.AuthService.isLoggedIn())
      //   {
      //     loop.unsubscribe();
      //   }
      //   else{
      //     this.getPortoflioInformation();
      //   }     
      // });


     
    }
  }



  initUserPortfolioChart()
  {
      //Create Chart
      this.authService.getUserHoldings().subscribe((data: PortfolioHistoricals) => {
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

        //set daily profit
        this.dailyProfit$ =  userData[userData.length-1][1] - userData[0][1];
        //we are at a loss, make color red
        if(userData[0][1] > userData[userData.length-1][1])
        {
          this.options.series[0].color = "#ff3c00";
        }
        else{
          this.options.series[0].color = "#00c805";
        }
        this.currentPrice$ = userData[userData.length-1][1];
        this.Chart = Highcharts.stockChart('container', this.options);
      
      });
  }

  updateChart(span: string)
  {
      //Create Chart
      this.authService.getUserHoldingsWeekly(span).subscribe((data: PortfolioHistoricals) => {
        const userData = [];

        const historicals = data.equity_historicals;
       
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

        this.dailyProfit$ =  userData[userData.length-1][1] - userData[0][1];

        //we are at a loss, make color red
        if(userData[0][1] > userData[userData.length-1][1])
        {
          this.Chart.series[0].color = "#ff3c00";
        }
        else{
          this.Chart.series[0].color = "#00c805";
        }
         
        //console.log(this.Chart.plotOptions);
        this.Chart.xAxis[0].setExtremes(userData[0].begins_at,userData[userData.length-1].begins_at);

        //Update zoom message to display after profit
        switch(span) {
          case 'day':
            this.zoomMessage = "Today";
            break;
          case 'week':
            this.zoomMessage = "Past Week";
            break;
          case 'month':
            this.zoomMessage = "Past Month";
          break;
          default:
            this.zoomMessage = "";
        }
      });
  }


}
