import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean = false;
  stockName: string;
  data$;
  
  @ViewChild('dropdown') dropdown;

  constructor(private authService: AuthService, private router: Router, private stockService: StockService) 
  {}

  ngOnInit() 
  {
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this.isLoggedIn = this.authService.isLoggedIn();

  }

  logout()
  {
    this.isLoggedIn = false;
    this.router.navigateByUrl('logout');
    
  }
  getStock()
  {
   // console.log(this.stockName);

    
    this.stockService.getStockData(this.stockName).subscribe(data => {
      //console.log(data);
      this.data$ = data;
      if(data.length > 0)
      {
        
        this.dropdown.show(true);
      }
        

     
    })
  }

  dropdownClick(event)
  {
    this.stockName = event.target.value.symbol;
    let navigationExtras: NavigationExtras = {
      queryParams: { 'name': this.stockName },
    };
    this.router.navigate(["/stock"], navigationExtras );

    //dont call getStock() as that will reopen dropdown
    // this.stockService.getStockData(this.stockName).subscribe(data => {
    //   console.log(data);
    //   this.data$ = data;
    // });
    this.dropdown.show(false);
    this.dropdown.toggle(false);
 
  }

  stockInputChange(event)
  {
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
