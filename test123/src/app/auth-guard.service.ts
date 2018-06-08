import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) {
console.log("auth gaurd")
    
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.authenticated;
  }
}

@Injectable()
export class LoginAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
    console.log("auth gaurd====23")
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.authService.authenticated) this.router.navigate(['/dashboard']); 
    else return true;
  }
}

@Injectable()
export class AdminLoginAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
    console.log("auth gaurd====36")
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if(this.authService.authenticated) {
    //   this.router.navigate(['/dashboard']);
    // }else{
      return true;
    // } 
  }
}
