import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { StockService } from '../stock.service';

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
  constructor(private authService: AuthService, private stockService: StockService) { }

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
          console.log(key, value );
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
        //console.log(userData);
          
        });
      })

    //   const userData = [];

    //     const historicals = data.equity_historicals;
    //     //console.log(historicals);
    //     historicals.forEach(row => {

    //         const temp_row = [
    //           // myDate,
    //            //do Date.parse(row.beings_at)
    //            Date.parse(row.begins_at),
    //            Number(row.open_equity)
    //          ];
            
    //          userData.push(temp_row);
    //          this.testValue = row.open_equity;
    //     });

    // })

    
  }

}
