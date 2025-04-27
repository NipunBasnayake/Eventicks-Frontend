import { Routes } from '@angular/router';
import { LandingComponent } from './page/landing/landing.component';
import { ProfileComponent } from './page/profile/profile.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';


export const routes: Routes = [
    { path: "", component: LandingComponent },
    { path: "home", component: LandingComponent },
    { path: "profile", component: ProfileComponent },
    { path: 'verify-email', component: EmailVerificationComponent },
];
