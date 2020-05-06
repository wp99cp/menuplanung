import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanDeactivate } from '@angular/router';


export interface Saveable {

  /**
   * Saves all unsaved changes in this Component.
   *
   * @returns should return true if some changes got saved and false otherwise
   */
  save: () => Promise<boolean>;

}


@Injectable({
  providedIn: 'root'
})
/**
 * AutoSaveService: Handelt das automatisierte Speichern beim Wechseln einer Seite.
 *
 *  Aktiviertung:
 *  Muss im module-rooting aktiviert werden und der entsprechende Component muss das Interface Saveable implemntieren
 */
export class AutoSaveService implements CanDeactivate<Saveable> {

  constructor(public snackBar: MatSnackBar, private zone: NgZone) { }

  /**
   * Wird beim Wechsel der Seiten aufgerufen.
   * 
   */
  canDeactivate(component: Saveable) {

    component.save()
      .then(saved => {

        // Benachrichtigung, falls Änderungen gespeichert wurden.
        if (saved) {
          this.zone.run(() => {

            // Anzeige des Benachrichtigungs-Banners
            this.snackBar.open('Änderungen wurden automatisch gespeichert!', '', { duration: 2000 });

          });
        }

      });

    // Erlaubt das Wechseln der Seite(return true).
    return true;

  }

}
