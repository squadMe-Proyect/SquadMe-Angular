import { Injectable } from '@angular/core';
import { PlayerService } from '../player.service';
import { SquadService } from '../squad.service';
import { MatchService } from '../match.service';
import { TrainingService } from '../training.service';
import { Player } from 'src/app/interfaces/player';
import { Squad } from 'src/app/interfaces/squad';
import { Match } from 'src/app/interfaces/match';
import { Training } from 'src/app/interfaces/training';
import { unparse } from 'papaparse';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService {
  private players:Player[] = []
  private squads:Squad[] = []
  private matches:Match[] = []
  private trainings:Training[] = []
  constructor(
    public plySvc:PlayerService,
    public sqdSvc:SquadService,
    public mtchSvc:MatchService,
    public traingSvc:TrainingService,
    public fbSvc:FirebaseService
  ) { 
    plySvc.players$.subscribe(ps => this.players = [...ps])
    sqdSvc.squads$.subscribe(sqs => this.squads = [...sqs])
    mtchSvc.matches$.subscribe(mtchs => this.matches = [...mtchs])
    traingSvc.trainings$.subscribe(trngs => this.trainings = [...trngs])
  }

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