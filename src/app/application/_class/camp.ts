import { AccessData } from '../_interfaces/accessData';
import { FirestoreCamp } from '../_interfaces/firestore-camp';
import { User } from '../_interfaces/user';
import { Day } from './day';
import { FirebaseObject } from './firebaseObject';

export class Camp extends FirebaseObject implements FirestoreCamp {



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
    protected readonly firestorePath = Camp.CAMPS_DIRECTORY;

    // fields of a camp
    public name: string;
    public description: string;
    public participants: number;
    public year: string;
    public access: AccessData;
    public days: Day[] = [];
    public readonly firestoreElementId: string

    constructor(data: FirestoreCamp, campId: string) {

        super();

        this.firestoreElementId = campId;
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
    public extractDataToJSON(): FirestoreCamp {

        let campData = {
            name: this.name,
            description: this.description,
            year: this.year,
            participants: this.participants,
            days: this.days.map(day => day.extractDataToJSON()),
            access: this.access
        };

        return campData;
    }

}
