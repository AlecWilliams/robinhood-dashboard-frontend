import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stock-frontend';

  isLoggedIn: boolean;

  constructor(private authService: AuthService) 
  {
  }

  ngOnInit() 
  {
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this.isLoggedIn = this.authService.isLoggedIn();

  }

  logout()
  {
    this.authService.logout().subscribe(data => {
      console.log(data);
      
    });
    this.isLoggedIn = false;
  }

  test()
  {
    console.log('sendiong test');
    this.authService.testChallenge();
  }
}
