import { Component, OnInit } from '@angular/core';

export class StockInfo  {
  name: string;
  country: string;
  symbol: string;
  tradeable: boolean;

}


@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.css']
})
export class StockCardComponent implements OnInit {



  stockInfo$ : StockInfo;
  stockHistory$;

  constructor() { }

  ngOnInit(): void {
  }

}
