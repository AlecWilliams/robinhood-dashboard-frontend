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
  subscription: Subscription;
  showChart: boolean = false;
  options;

  @ViewChild('dropdown') dropdown;

  constructor(private stockService: StockService, private AuthService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    //Verify if user is already logged in
    if(this.AuthService.isLoggedIn())
    {
      console.log('AUTHSERIVE .ISLOGGGEDIN SAY WE ARE LOGGED IN ');
      this.showChart = true;
      //Get profile info
      this.AuthService.getProfileInformation().subscribe((data: UserProfile) => {
        this.userProfile$ =  data;
       
        //now init the chart
        //this.initUserPortfolioChart2();
      });

      // this.getPortoflioInformation();

      // //pull it again ever 10 seconds if we are still logged in
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

  getPortoflioInformation()
  {
    this.AuthService.getPortfolioInformation().subscribe((data: UserPortfolio) => {
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
    this.stockService.getStockData(this.stockName).subscribe(data => {
      this.data$ = data;
      if(data.length > 0)
      {   
        this.dropdown.show(true);
      }  
    })
  }
 
}
