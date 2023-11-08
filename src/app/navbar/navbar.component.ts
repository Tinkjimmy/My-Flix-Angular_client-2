import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}

  /**
   * navigates to movies page
   */
  goToMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * navigates to user's profile page
   */
  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * logs out user
   */
  logOut(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}