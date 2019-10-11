import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { WelcomPageComponent } from './welcom-page/welcom-page.component';
import { CampListPageComponent } from './camp-list-page/camp-list-page.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { MealListPageComponent } from './meal-list-page/meal-list-page.component';
import { AuthenticationService } from './_service/authentication.service';
import { EditCampPageComponent } from './edit-camp-page/edit-camp-page.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    WelcomPageComponent,
    CampListPageComponent,
    MealListPageComponent,
    EditCampPageComponent,

  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'eMeal - Menuplanung'),
    AngularFirestoreModule,
    AngularFireAuthModule,

    // Material Design
    MatTableModule,
    MatProgressBarModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatStepperModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatTabsModule
  ],
  providers: [
    AngularFirestore,
    AngularFireAuth,
    AuthenticationService]
})

export class ApplicationModule {

  constructor(private auth: AuthenticationService) {
    this.auth.signIn();

  }

}
