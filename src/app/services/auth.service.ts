import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users')

    this.isAuthenticated$ = auth.user.pipe(
      map(user => Boolean(user))
    )
  }

  public async createUser(userData:IUser){
    if(!userData.password){
      throw new Error("Passowrd not provided!")
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string
    )

    if(!userCred.user){
      throw new Error("User can't be found.")
    }

    // Selezionare una colletion dal db e aggiungere i valori (se non esiste viene creata)
    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })


    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }
}
