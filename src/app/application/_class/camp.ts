import { FirebaseObject } from './firebaseObject';
import { AngularFirestore } from '@angular/fire/firestore';
import { Day, DayData } from './day';
import { firestore } from 'firebase';
import { AuthenticationService } from '../_service/authentication.service';
import { AccessData } from '../_interfaces/accessData';
import { User } from '../_interfaces/user';

export interface CampData {
    name: string,
    description: string,
    participants: number,
    year: string,
    access: AccessData,
    days: DayData[]
}

export class Camp extends FirebaseObject {

    /**
     * 
     * creates a new Camp in the database
     * 
     * @param data as JSON
     * @param database firestore database
     * @param auth AuthenticationService
     */
    static createNewCamp(campData: CampData, database: AngularFirestore, auth: AuthenticationService) {

        auth.fireAuth.authState.subscribe((user: firebase.User) => {

            // write to database
            database.collection(this.CAMPS_DIRECTORY).add(campData);

        });

    }

    /**
     * 
     * @param ownerUid 
     * @param coworkers 
     */
    static generateCoworkersList(ownerUid: String, coworkers: User[]): String[] {

        let uidList: String[] = [];

        if (coworkers != undefined) {
            coworkers.forEach(coworker => {
                let uid: String = coworker['uid'];
                if (ownerUid != uid)
                    uidList.push(uid);
            });
        }

        return uidList;

    }

    public static readonly CAMPS_DIRECTORY = "camps/";
    protected readonly FIRESTORE_DB_PATH = Camp.CAMPS_DIRECTORY;

    // fields of a camp
    public name: string;
    public description: string;
    public participants: number;
    public year: string;
    public access: AccessData;

    public days: Day[] = [];

    constructor(data: CampData, public readonly FIRESTORE_ELEMENT_ID: string, database: AngularFirestore) {

        super(database);

        this.description = data.description;
        this.name = data.name;
        this.participants = data.participants;
        this.year = data.year;
        this.access = data.access;

        if (data['days']) {
            for (let dayData of data['days']) {
                this.days.push(new Day(dayData, this));
            }
        }

    }

    // doc on mother class 
    protected extractDataToJSON(): CampData {

        return {
            name: this.name,
            description: this.description,
            year: this.year,
            participants: this.participants,
            days: this.days.map(day => day.extractDataToJSON()),
            access: this.access
        };
    }

}
