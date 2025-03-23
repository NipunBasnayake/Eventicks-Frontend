import { Component } from '@angular/core';
import { UserProfileComponent } from "../../components/user-profile/user-profile.component";
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-profile',
  imports: [UserProfileComponent, NavBarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
