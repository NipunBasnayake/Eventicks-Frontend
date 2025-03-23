import { Routes } from '@angular/router';
import { LandingComponent } from './page/landing/landing.component';
import { UserProfileComponent } from './page/user-profile/user-profile.component';

export const routes: Routes = [
    { path: "", component: LandingComponent },
    { path: "landing", component: LandingComponent,
        children: [
            {path: "user-profile", component: UserProfileComponent},
        ]
     }
];
