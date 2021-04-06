import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { AuthService } from '../../auth/auth.service';
import { StockService } from '../../stock.service';

export class UserHoldings {
  name: string;
  price: string;
  quantity: string;
}
export class UserHoldings2 {
  symbol: string;
  price: string;
  percentChange: string;
  quantity: string;
 }

@Component({
  selector: 'app-stock-holdings-card',
  templateUrl: './stock-holdings-card.component.html',
  styleUrls: ['./stock-holdings-card.component.scss']
})
export class StockHoldingsCardComponent implements OnInit {

  userHoldings$ : UserHoldings[];
  userHoldings2 : UserHoldings2[];
  userHoldingsData;

  userWatchlistsArray: any[];
  userFirstList: any[];

  status: boolean = false;
  clickEvent(){
      this.status = !this.status;       
  }


  constructor(private authService: AuthService, private stockService: StockService, private userService: UserService) { }

  ngOnInit(): void {
    //Get basic info on every stock held by user
    this.authService.getUserHoldings().subscribe((data) => {
      this.userHoldings$ = eval(data);
      //console.log(this.userHoldings$);
       const userHoldingsData = [];

      //console.log(Object.keys(this.userHoldings$));
      let keys = Object.keys(this.userHoldings$);

      //pull detailed price info for every stock held by user.
      //passing in an array of the tickers of stocks help, returns price info on all of them
      this.stockService.getStockQuote(Object.keys(this.userHoldings$)).subscribe(stockQuotes => {
        //console.log(stockQuotes);
        //console.log('percent: ' + ((data[0].bid_price - data[0].adjusted_previous_close) / data[0].adjusted_previous_close ) *100);
        let index = 0;
        //iterate through key values pairs of each holding and use detailed
        //price info to get the percent change
        for(const [key, value] of Object.entries(this.userHoldings$)) {
          //console.log(key, value );
          const temp_row = {
            name: key,
            quantity: value.quantity,
            price: value.price,
            percentChange: (((Number(value.price) - stockQuotes[index].adjusted_previous_close) / stockQuotes[index].adjusted_previous_close ) *100),
          };
          index += 1;
          userHoldingsData.push(temp_row);
        }

        this.userHoldingsData = userHoldingsData;
          
        });
      })


      //Get user watchlists
      this.userService.getUserWatchlists().subscribe(data => {
        console.log(data);
        //this.userWatchlistsArray = data.results;
        this.userFirstList = data.results;
      });
  }

}
