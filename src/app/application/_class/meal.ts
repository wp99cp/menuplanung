import { SpecificMeal } from './specific-meal';
import { Observable } from 'rxjs';
import { AccessData } from '../_interfaces/accessData';
import { FirestoreMeal } from '../_interfaces/firestore-meal';
import { FirestoreSpecificMeal } from '../_interfaces/firestore-specific-meal-data';
import { FirestoreSpecificRecipe } from '../_interfaces/firestore-specific-recipe';
import { DatabaseService } from '../_service/database.service';
import { Camp } from './camp';
import { FirebaseObject } from './firebaseObject';
import { Recipe } from './recipe';

export class Meal extends FirebaseObject implements FirestoreMeal {

  public readonly firestorePath = 'meals/';

  public title: string;
  public description: string;
  public access: AccessData;
  public recipes: Observable<Recipe[]>;
  public specificId: string = undefined;
  public weekTitle = '';


  constructor(data: FirestoreMeal, public readonly firestoreElementId: string, recipes?: Observable<Recipe[]>) {

    super();

    this.title = data.title;
    this.description = data.description;
    this.access = data.access;

    this.recipes = recipes;

    if (data.weekTitle) {
      this.weekTitle = data.weekTitle;
    }
    if (data.specificId) {
      this.specificId = data.specificId;
    }

  }

  public extractDataToJSON(): FirestoreMeal {

    const firestoreMeal: FirestoreMeal = {
      title: this.title,
      description: this.description,
      access: this.access,
      firestoreElementId: this.firestoreElementId,
      weekTitle: this.weekTitle
    };

    // Meals generated out of a day don't contain access and description properties
    // They are removed if they're undefinded...
    if (this.specificId !== undefined) {
      firestoreMeal.specificId = this.specificId;
    }
    if (firestoreMeal.access === undefined) {
      delete firestoreMeal.access;
    }
    if (firestoreMeal.description === undefined) {
      delete firestoreMeal.description;
    }

    return firestoreMeal;

  }



  /**
   *
   * Creates specific meal and recipe documents in the database for a related camp
   *
   * @param camp Releted Camp
   *
   */
  public createSpecificRecipes(databaseService: DatabaseService, camp: Camp) {

    if (this.recipes === undefined) {
      this.recipes = databaseService.getRecipes(this.firestoreElementId, this.specificId, camp.firestoreElementId);
    }

    this.recipes.subscribe(recipes => recipes.forEach(recipe =>
      this.createSpecificRecipe(camp, recipe.firestoreElementId, databaseService)
    ));

  }

  public createSpecificRecipe(camp: Camp, recipeId: string, databaseService: DatabaseService) {
    const specificRecipeData: FirestoreSpecificRecipe = {
      participants: camp.participants,
      campId: camp.firestoreElementId
    };
    const recipePath = 'meals/' + this.firestoreElementId + '/recipes/' + recipeId + '/specificRecipes/' + this.specificId;
    databaseService.addDocument(specificRecipeData, recipePath);
  }

  public setSpecificMeal(specificId: string) {

    this.specificId = specificId;

  }


  public async createSpecificMeal(databaseService: DatabaseService, camp: Camp): Promise<string> {

    const specificMealData: FirestoreSpecificMeal = {
      participants: camp.participants,
      campId: camp.firestoreElementId
    };

    const mealPath = 'meals/' + this.firestoreElementId + '/specificMeals';
    const ref = await databaseService.addDocument(specificMealData, mealPath);

    return ref.id;

  }

}
