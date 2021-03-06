import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {delay, map, mergeMap, take} from 'rxjs/operators';
import {HeaderNavComponent} from 'src/app/_template/header-nav/header-nav.component';

import {DatabaseService} from '../../_service/database.service';

@Component({
  selector: 'app-export-camp',
  templateUrl: './export-camp.component.html',
  styleUrls: ['./export-camp.component.sass']
})
export class ExportCampComponent implements OnInit {

  // TODO: Möglichkeit die Einkaufsliste in ein Trelloboard zu exportieren
  // dies ermöglicht anschliessend, dass gemeinsame EInkaufen mit synch.
  // Abhacken der Lebensmitteln.

  public pending = false;
  public exports: Observable<any[]>;
  public message: string;
  public showExports = true;
  private campId: Observable<string>;

  constructor(private route: ActivatedRoute, private dbService: DatabaseService, private router: Router) {

    this.campId = this.route.url.pipe(map(url => url[1].path));
    this.exports = this.campId.pipe(mergeMap(campId => dbService.getExports(campId)));
    this.exports.subscribe(() => {
        this.pending = false;
      }
    );

  }

  ngOnInit() {

    this.campId.pipe(mergeMap(id => this.dbService.getCampById(id)))
      .pipe(take(1))
      .subscribe(camp =>
        HeaderNavComponent.addToHeaderNav({
          active: true,
          description: 'Zurück zum ' + camp.name,
          name: camp.name,
          action: (() => this.router.navigate(['..'], {relativeTo: this.route})),
          icon: 'nature_people',
          separatorAfter: true
        }, 0)
      );


    HeaderNavComponent.addToHeaderNav({
      active: true,
      description: 'Lager erneut exportieren',
      name: 'Neuer Export',
      action: (() => this.createPDF()),
      icon: 'create_new_folder'
    });

    HeaderNavComponent.addToHeaderNav({
      active: true,
      description: 'Löscht alle Exporte des Lagers',
      name: 'Exporte löschen',
      action: (() => this.deleteExports()),
      icon: 'delete'
    });


  }


  deleteExports() {

    // reset gui
    this.showExports = false;

    this.campId.subscribe(campId => this.dbService.deleteExports(campId));

  }

  /**
   * Request a PDF export of the camp
   */
  createPDF() {

    this.showExports = true;

    this.pending = true;
    this.campId
      .pipe(mergeMap(campId => this.dbService.createPDF(campId)))
      .pipe(delay(250))
      .subscribe(() => {
        },

        // bug report on error
        (err) => {

          this.pending = false;
          this.message = 'Beim Export ist ein unerwarteter Fehler aufgetreten! Bitte versuches später erneut.';

        });

  }

  public getDate(date: any) {

    return new Date(date.seconds * 1000);

  }


}
