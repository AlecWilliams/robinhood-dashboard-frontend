import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { StockService } from '../stock.service';


export class UserProfile {
  accountNumber: string;
  buying_power: string;
  cash: string;
  margin_balances : {
    uncleared_deposits: string,
    cash: string
  };

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

  @ViewChild('dropdown') dropdown;

  constructor(private stockService: StockService, private AuthService: AuthService) { }

  ngOnInit(): void {
    //  this.stockService.getTest().subscribe(data => {
    //    console.log(data);
    //  })
    if(this.AuthService.isLoggedIn())
    {
      //Get profile info
      this.AuthService.getProfileInformation().subscribe((data: UserProfile) => {
        this.userProfile$ =  data;
        console.log(this.userProfile$);
      });

      this.AuthService.getPortfolioInformation().subscribe(data => {
        console.log(data);
      });
    }
    


    // this.AuthService.getInvestmentProfileInformation().subscribe(data => {
    //   console.log(data);
    // });

    
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
    this.stockService.getTest('TEST');
     //this.AuthService.testChallenge();
    // this.stockService.getStockInfo('TSLA').subscribe(data => {
    //   console.log(data);
    // });
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
