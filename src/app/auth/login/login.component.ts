import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlDirective, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { LoginRequestPayload } from '../login-request.payload';
import { LoginResponsePayload } from '../login-response.payload';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginRequestPayload: LoginRequestPayload;
  loginForm: FormGroup;
  tokenForm: FormGroup;

  isError: boolean;
  registrationSuccessMessage: string = "";

  challenged = false;
  challenge_id: string;
  payload: any;
  constructor(private authService: AuthService, private toastService: ToastrService,
    private router: Router, private activatedRoute: ActivatedRoute) 
  {
    this.loginRequestPayload = {
      username: '',
      password: ''
    };
  }

  ngOnInit(): void 
  {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    this.tokenForm = new FormGroup({
      challenge: new FormControl(''),
    });
  }


  login()
  {
    this.loginRequestPayload.username = this.loginForm.get('username').value;
    this.loginRequestPayload.password = this.loginForm.get('password').value;

    this.authService.login(this.loginRequestPayload)
    .subscribe(data => {

      
      console.log(data.hasOwnProperty('challenge_id'));
      if(data.hasOwnProperty('challenge_id'))
      {
        this.challenged = true;
        this.challenge_id = data.challenge_id;
        this.payload = data.payload;
      }
      else
      {
        this.isError = false;
        this.router.navigateByUrl('');
        this.toastService.success('Login Successful');
      }
     
     
    }, error => {
     // this.isError = true;
      this.toastService.error('Login Failed');
      console.log('LOGIN FAILED in login', error);
      //throwError(error);
    });

  }
  onOtpChange(otp)
  {
   
    if(otp.length == 6)
    {
      this.sendCode(otp);
    }
  }



  test()
  {
    this.authService.testChallenge();
  }
  sendCode(verificationToken: string)
  {


    this.authService.verify(verificationToken, this.challenge_id, this.payload).subscribe(data => {
     // console.log(Object.keys(data));
      //Incorrect token, 
      if(Object.keys(data).includes("challenge"))
      {
        this.toastService.error('Incorrect');
        //this.router.navigateByUrl('/login');
        //this.challenged = false;

      }
      else
      {
        this.isError = false;
        this.router.navigateByUrl('');
        this.toastService.success('Login Successful');
        console.log(data);
      }
    }, error => {
      console.log('LOGIN FAILED', error);
       this.toastService.success('Incorrect Code');

    })
  }
}
