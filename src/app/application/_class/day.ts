import { Camp } from './camp';
import { Meal } from './meal';
import { firestore } from 'firebase';
import { DayData } from '../_interfaces/day-data';


export class Day implements DayData {

    public date: firestore.Timestamp;
    public dateAsTypeDate: Date;
    public description: string;
    public meals: Meal[];

    constructor(data: DayData, camp: Camp) {

        let date: firestore.Timestamp = data.date;
        this.dateAsTypeDate = date.toDate();
        if (data.description != undefined) {
            this.description = data.description;
        }
        else {
            this.description = '';
        }

        this.meals = data.meals.map(mealData => new Meal(mealData, camp.FIRESTORE_DATABASE));
    }

    extractDataToJSON(): DayData {

        return {
            date: firestore.Timestamp.fromDate(this.dateAsTypeDate),
            description: this.description,
            meals: this.meals.map((meal: Meal) => meal.extractDataToJSON())
        };
    }

    /** 
    public getMeals(): Observable<[Meal]> {

        // The days get loaded by the first usage
        if (this.meals == undefined)
            this.loadMeals();

        return this.meals;

    }
*/

    public getDateStr(): String {
        return this.dateAsTypeDate.toLocaleDateString('de-CH', { "weekday": "long", "month": "short", "day": "2-digit" });
    }
    public getDiscriptionInBracket(): String {
        if (this.description != '')
            return '(' + this.description + ')';

        return '';
    }

    /**
     * 
     */
    private loadMeals() {


    }

}
