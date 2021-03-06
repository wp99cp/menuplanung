import {Component} from '@angular/core';
import {TemplateHeaderComponent} from '../template-header/template-header.component';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {HelpService} from '../../application/_service/help.service';
import {MatDialog} from '@angular/material/dialog';
import {CurrentlyUsedMealService} from '../currently-used-meal.service';
import {Camp} from '../../application/_class/camp';
import {FeedbackDialogComponent} from '../../application/_dialoges/feedback-dialog/feedback-dialog.component';
import {AuthenticationService} from '../../application/_service/authentication.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.sass']
})
export class MainMenuComponent {


  public lastCamp: Camp;

  constructor(private router: Router,
              private auth: AuthenticationService,
              private location: Location,
              public helpService: HelpService,
              private dialog: MatDialog,
              public main: CurrentlyUsedMealService) {

    this.helpService.addDialog(dialog);

    main.lastUsage.subscribe(camp => {
      this.lastCamp = camp;
    });

  }

  public closeMenu() {
    TemplateHeaderComponent.showMenu();
  }

  public isSignedIn() {
    return this.router.url.includes('app');
  }

  public signOut() {

    this.auth.signOut();

  }

  openFeedbackDialog() {

    this.dialog.open(FeedbackDialogComponent, {
      height: '800px',
      width: '550px',
      data: {}
    }).afterClosed().subscribe();


  }

}
