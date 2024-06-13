import { Injectable } from '@angular/core';
import { unparse } from 'papaparse';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService {
  constructor(
    public fbSvc:FirebaseService
  ) { }

  async exportToCsv(collection:string, user:any) {
    const data = await this.fbSvc.getAllDocumentData(collection)
    const csv = unparse(data.filter(doc => doc['coachId'] == user.id))
    this.downloadFile(csv, 'text/csv', `${collection}.csv`)
  }

  private downloadFile(data:string, type:string, filename:string) {
    const blob = new Blob([data], {type})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  }
}