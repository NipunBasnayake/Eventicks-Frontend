import { Routes } from '@angular/router';
import { LandingComponent } from './page/landing/landing.component';
import { ProfileComponent } from './page/profile/profile.component';


export const routes: Routes = [
    { path: "", component: LandingComponent },
    { path: "landing", component: LandingComponent },
    { path: "profile", component: ProfileComponent }
];
