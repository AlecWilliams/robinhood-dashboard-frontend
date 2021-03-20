import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { StockService } from '../stock.service';

export interface StockInformation {
  ceo : string;
  description: string;
  headquarters_city: string;
  headquarters_state: string;
  industry: string;
  sector: string;
  symbol: string;
  year_founded: number;
};

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.css']
})
export class StockPageComponent implements OnInit {


  showShortDesciption = true

  stockTicker: string;
  stockInfo;
  stockName: string;

  stockInformation : StockInformation;

  
  constructor(private route: ActivatedRoute, private stockService: StockService) { }
  alterDescriptionText() {
    this.showShortDesciption = !this.showShortDesciption
 }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.stockTicker = params['name'];

      this.stockService.getStockFundamentals(this.stockTicker).subscribe((data) => {
        //console.log(data);

        this.stockInformation = data[0] as StockInformation;
        console.log(this.stockInformation);
 
      });


      this.stockService.getStockQuote(this.stockTicker).subscribe(data => {
        this.stockInfo = data[0];

        //console.log(this.stockInfo);
        this.stockService.getStockNameByURL(this.stockInfo.instrument).subscribe((data) => {
          //console.log(data);
          this.stockName = data.toString();
        })
      })
      
     
    })
  }

}
