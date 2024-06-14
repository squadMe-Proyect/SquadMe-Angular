import { Injectable } from '@angular/core';
import { unparse } from 'papaparse';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService {

  constructor(
    public fbSvc: FirebaseService
  ) { }

  /**
   * Exporta los datos de una colección a un archivo CSV y lo descarga.
   * @param collection Nombre de la colección de Firebase de donde exportar los datos.
   * @param user Usuario actual que solicita la exportación.
   */
  async exportToCsv(collection: string, user: any) {
    // Obtiene todos los documentos de la colección desde Firebase
    const data = await this.fbSvc.getAllDocumentData(collection);
    // Filtra los datos para exportar solo los documentos del usuario actual
    const csv = unparse(data.filter(doc => doc['coachId'] == user.id));
    // Descarga el archivo CSV
    this.downloadFile(csv, 'text/csv', `${collection}.csv`);
  }

  /**
   * Descarga un archivo en el navegador.
   * @param data Contenido del archivo a descargar.
   * @param type Tipo MIME del archivo (ej. 'text/csv').
   * @param filename Nombre del archivo a descargar.
   */
  private downloadFile(data: string, type: string, filename: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    // Elimina el elemento 'a' del DOM después de la descarga
    document.body.removeChild(a);
  }
}