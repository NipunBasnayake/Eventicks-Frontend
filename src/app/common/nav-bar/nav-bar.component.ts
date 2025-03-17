import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RegisterComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  isRegisterPopupVisible = false;
  
  openRegisterPopup(): void {
    console.log('Register button clicked');
    this.isRegisterPopupVisible = true;
  }
  
  closeRegisterPopup(): void {
    this.isRegisterPopupVisible = false;
    console.log(this.isRegisterPopupVisible);
    
  }
  
  openLoginPopup(): void {
    console.log('Sign in button clicked');
    this.isRegisterPopupVisible = false;
    console.log(this.isRegisterPopupVisible);
  }
}
