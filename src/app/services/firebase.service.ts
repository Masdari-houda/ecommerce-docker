import { Injectable } from '@angular/core';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { auth, db } from '../../firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { collection, addDoc, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(auth, (user) => this.userSubject.next(user));
  }

  signup(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(auth, email, password));
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(auth));
  }

  async add(collectionName: string, data: any) {
    return addDoc(collection(db, collectionName), data);
  }

  async getAll(collectionName: string) {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  getDocument(collectionName: string, id: string) {
    return getDoc(doc(db, collectionName, id));
  }

  setDocument(collectionName: string, id: string, data: any) {
    return setDoc(doc(db, collectionName, id), data);
  }
}
