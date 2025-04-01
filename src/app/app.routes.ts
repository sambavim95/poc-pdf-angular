import { Routes } from '@angular/router';
import { PageOneComponent } from './page-one/page-one.component';
import { PageTwoComponent } from './page-two/page-two.component';
import { PageThreeComponent } from './page-three/page-three.component';
import { PageFourComponent } from './page-four/page-four.component';


export const routes: Routes = [
  { path: 'page1', component: PageOneComponent },
   { path: 'page2', component: PageTwoComponent },
  { path: 'page3', component: PageThreeComponent },
   { path: 'page4', component: PageFourComponent },
  { path: '', redirectTo: 'page1', pathMatch: 'full' }
];
