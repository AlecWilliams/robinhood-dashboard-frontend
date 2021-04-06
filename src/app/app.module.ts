import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockCardComponent } from './stock-card/stock-card.component';
import { LoginComponent } from './auth/login/login.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgOtpInputModule } from  'ng-otp-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LogoutComponent } from './auth/logout/logout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PortfolioChartComponent } from './home/portfolio-chart/portfolio-chart.component';
import { StockHoldingsCardComponent } from './home/stock-holdings-card/stock-holdings-card.component';
import { StockPageComponent } from './stock-page/stock-page.component';
import { StockChartComponent } from './stock-chart/stock-chart.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ReadMoreComponent } from './stock-page/read-more/read-more.component';
import { NewsCardComponent } from './news-card/news-card.component';
import { NewsListComponent } from './news-list/news-list.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StockCardComponent,
    LoginComponent,
    LogoutComponent,
    NavbarComponent,
    PortfolioChartComponent,
    StockHoldingsCardComponent,
    StockChartComponent,
    StockPageComponent,
    ReadMoreComponent,
    NewsCardComponent,
    NewsListComponent,
    DateAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
    NgOtpInputModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
