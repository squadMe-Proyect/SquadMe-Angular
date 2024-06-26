import { Inject, Injectable } from '@angular/core';
import { FirebaseApp, getApp, initializeApp } from 'firebase/app';
import { DocumentData, Firestore, Unsubscribe, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes, FirebaseStorage } from "firebase/storage";
import { Auth, User, UserCredential, createUserWithEmailAndPassword, deleteUser, getAuth, indexedDBLocalPersistence, initializeAuth, sendPasswordResetEmail, signInAnonymously, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

export interface FirebaseStorageFile{
  path:string,
  file:string
};

export interface FirebaseUserCredential{
  user:UserCredential
}

export interface FirebaseDocument{
  id:string;
  data:DocumentData;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _app!: FirebaseApp
  private _db!: Firestore
  private _auth!: Auth
  private _webStorage!:FirebaseStorage;
  private _user:User | null = null
  private _isLogged: BehaviorSubject<boolean|null> = new BehaviorSubject<boolean|null>(null)
  public isLogged$ = this._isLogged.asObservable()

  constructor(@Inject('firebase-config') config:any) { 
    this.init(config)
  }

  public init(config:any) {
    this._app = initializeApp(config)
    this._db = getFirestore(this._app)
    this._webStorage = getStorage(this._app);
    this._auth = initializeAuth(getApp(), { persistence: indexedDBLocalPersistence })
    this._auth.onAuthStateChanged(user => {
      this._user = user
      if(user) {
        this._isLogged.next(true)
      } else {
        this._isLogged.next(false)
      }
    })
  }

  public getUser() {
    return this._user
  }

  public getAuth() {
    return this._auth
  }

  public fileUpload(blob: Blob, mimeType:string, path:string, prefix:string, extension:string):Promise<FirebaseStorageFile>{
    return new Promise(async (resolve, reject) => {
        if(!this._webStorage || !this._auth)
            reject({
                msg: "Not connected to FireStorage"
            });
        var freeConnection = false;
        if(this._auth && !this._auth.currentUser){
            try {
                await signInAnonymously(this._auth);
                freeConnection = true;
            } catch (error) {
                reject(error);
            }
        }
        const url = path+"/"+prefix+"-"+Date.now() + extension;
        const storageRef = ref(this._webStorage!, url);
        const metadata = {
            contentType: mimeType,
        };
        uploadBytes(storageRef, blob).then(async (snapshot) => {
            getDownloadURL(storageRef).then(async downloadURL => {
              if(freeConnection)
                  await signOut(this._auth!);
              resolve({
                  path,
                  file: downloadURL,
              });
            }).catch(async error=>{
              if(freeConnection)
                  await signOut(this._auth!);
              reject(error);
            });
        }).catch(async (error) => {
            if(freeConnection)
                await signOut(this._auth!);
            reject(error);
        });
    });
  }

  public imageUpload(blob: Blob): Promise<any> {
    return this.fileUpload(blob,'image/jpeg', 'images', 'image', ".jpg");
  }

  public isUserConnected():Promise<boolean>{
    const response = new Promise<boolean>(async (resolve, reject)=>{
        if(!this._auth)
            resolve(false);
        resolve(this._auth!.currentUser != null)
    });
    return response;
  }

  public isUserConnectedAnonymously():Promise<boolean>{
    const response = new Promise<boolean>(async (resolve, reject)=>{
        if(!this._auth)
            resolve(false);
        resolve(this._auth!.currentUser != null && this._auth!.currentUser.isAnonymous);
    });
    return response;
    
  }

  public async signOut(signInAnon:boolean=false):Promise<void> {
    new Promise<void>(async (resolve, reject)=>{
        if(this._auth)
          try {
              await this._auth.signOut();
              resolve();
          } catch (error) {
            reject(error);
          }
    });
  }

  public async createUserWithEmailAndPassword(email:string, password:string):Promise<FirebaseUserCredential | null>{
    return new Promise(async(resolve,reject)=>{
        if(!this._auth)
            resolve(null);
        try {
            //const userCredentials = 
            resolve({ user: await createUserWithEmailAndPassword(this._auth!, email, password) });
        } catch (error:any) {
            switch (error.code) {
            case 'auth/email-already-in-use':
                console.log(`Email address ${email} already in use.`);
                break;
            case 'auth/invalid-email':
                console.log(`Email address ${email} is invalid.`);
                break;
            case 'auth/operation-not-allowed':
                console.log(`Error during sign up.`);
                break;
            case 'auth/weak-password':
                console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
                break;
            default:
                console.log(error.message);
                break;
            }
            reject(error);
        }
    });
  }

  public async connectUserWithEmailAndPassword(email: string, password: string):Promise<FirebaseUserCredential | null> {
    return new Promise<FirebaseUserCredential | null>(async (resolve, reject)=>{
        if(!this._auth)
            resolve(null);
        try {
          resolve({user: await signInWithEmailAndPassword(this._auth!, email, password)});
        } catch(error:any) {
          reject(error)
        }
    });
        
  }

  public resetPassword():Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(!this._auth || !this._user) {
        reject();
      }
      resolve(sendPasswordResetEmail(this._auth, this._user?.email!!))
    })
  }

  public resetPasswordWithEmail(email:string):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(!this._auth) {
        reject();
      }
      resolve(sendPasswordResetEmail(this._auth, email))
    })
  }

  public deleteUser():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
        if(!this._user)
            reject();
        
        resolve(deleteUser(this._user!));
    });
  }

  public createDocument(collectionName:string, data:any):Promise<string>{
    return new Promise((resolve,reject)=>{
        if(!this._db)
            reject({
                msg:"Database is not connected"
            });
        const collectionRef = collection(this._db!, collectionName);
        addDoc(collectionRef, data).then(docRef => resolve(docRef.id)
        ).catch(err =>  reject(err));
    });
  }

  public createDocumentWithId(
    collectionName: string,
    data: any,
    docId: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        reject({
          msg: 'Database is not connected',
        });
      }
      const docRef = doc(this._db!, collectionName, docId);
      setDoc(docRef, data)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  public updateDocument(collectionName:string, document:string, data:any):Promise<void>{
    return new Promise(async (resolve,reject)=>{
        if(!this._db)
            reject({
                msg:"Database is not connected"
                });
        const collectionRef = collection(this._db!, collectionName);
        updateDoc(doc(collectionRef,document),data).then(docRef => resolve()
        ).catch(err =>  {reject(err)
        console.log(err)});
    });
  }

  public getDocuments(collectionName:string):Promise<FirebaseDocument[]>{
    return new Promise(async (resolve, reject)=>{
        if(!this._db)
            reject({
                msg:"Database is not connected"
                });
        const querySnapshot = await getDocs(collection(this._db!, collectionName));
        resolve(querySnapshot.docs.map<FirebaseDocument>(doc=>{
            return {id:doc.id, data:doc.data()}}));
    });
  }

  public getAllDocumentData(collectionName: string):Promise<DocumentData[]> {
    return new Promise( async (resolve, reject) => {
      if(!this._db) {
        reject({msg:"Database is not connected"})
      }
      const querySnapshot = await getDocs(collection(this._db!, collectionName));
      resolve(querySnapshot.docs.map(doc => doc.data()))
    })
  }

  public getDocument(collectionName:string, document:string):Promise<FirebaseDocument>{
    return new Promise(async (resolve, reject)=>{
        if(!this._db)
            reject({
                msg:"Database is not connected"
                });
        const docRef = doc(this._db!, collectionName, document);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            resolve({id:docSnap.id, data:docSnap.data()});
        } else {
            // doc.data() will be undefined in this case
            reject('document does not exists');
        }
    });
  }

  public getDocumentsBy(collectionName:string, field:string, value:any):Promise<FirebaseDocument[]>{
    return new Promise(async (resolve, reject)=>{
        if(!this._db)
            reject({
                msg:"Database is not connected"
                });
        const q = query(collection(this._db!, collectionName), where(field, "==", value));

        const querySnapshot = await getDocs(q);
        resolve(querySnapshot.docs.map<FirebaseDocument>(doc=>{
            return {id:doc.id, data:doc.data()}}));
    });
  }

  public deleteDocument(collectionName:string, docId:string):Promise<void>{
    return new Promise(async (resolve, reject)=>{
        if(!this._db)
            reject({
                msg:"Database is not connected"
                });
        resolve(await deleteDoc(doc(this._db!, collectionName, docId)));
    });
  }

  public subscribeToCollection(collectionName:string, subject: BehaviorSubject<any[]>, mapFunction:(el:FirebaseDocument)=>any):Unsubscribe | null{
    if(!this._db)
        return null;
    return onSnapshot(collection(this._db, collectionName), (snapshot) => {
      subject.next(snapshot.docs.map<FirebaseDocument>(doc=>{
        return {id:doc.id, data:doc.data()}}).map(mapFunction));
    }, error=>{});
  }
}