import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Player } from 'src/app/interfaces/player';
import { AuthService } from 'src/app/services/api/auth.service';
import { CustomTranslateService } from 'src/app/services/custom-translate.service';
import { PlayerService } from 'src/app/services/player.service';


@Component({
  selector: 'app-player-searcher',
  templateUrl: './player-searcher.component.html',
  styleUrls: ['./player-searcher.component.scss'],
})
export class PlayerSearcherComponent  implements OnInit {

  players:Player[] = []
  //pagination:Pagination = ({page:0, pageCount: 0, pageSize: 0, total:0})
  @Input() playersSelected:Player[] = []
  @Input() player:Player | null = null
  @Input() coachId:string | undefined
  @Output() onPlayerClicked = new EventEmitter()
  showList:boolean = false
  @Output() sendStateList = new EventEmitter()
  constructor(
    public plySvc:PlayerService,
    private popover:PopoverController,
    private toast:ToastController,
    public translate:CustomTranslateService
  ) {
  }

  ngOnInit() {}

  async onLoadPlayers(){
    this.plySvc.players$.subscribe(_players => {
      console.log(this.coachId)
      var userPlayers = [..._players.filter(p => p.coachId == this.coachId)]
      this.players = userPlayers
      this.showList = true
      this.sendStateList.emit(true)
    })
  }

  onFilter(evt:any) {
    this.filter(evt.target.value.toLowerCase())
  }

  private async filter(value:string) {
    const query = value
    this.plySvc.players$.subscribe(_players => {
      var userPlayers = [..._players.filter(p => p.coachId == this.coachId)]
      this.players = userPlayers.filter(p => p.name.toLowerCase().includes(query) || p.surname.toLowerCase().includes(query))
    })
  }

  async onPlayerClick(player:Player){
    const _player = this.playersSelected.find(p => p?.id == player.id)
    if (_player) {
      const message = await lastValueFrom(this.translate.get('player.beenSelected'))
      const options:ToastOptions = {
        message:message,
        duration:1000,
        position:'bottom',
        color:'danger',
        cssClass:'red-toast'
      }
      this.toast.create(options).then(toast=>toast.present())
    } else {
      this.onPlayerClicked.emit(player)
      this.popover.dismiss(player,"ok")
      this.showList = false
      this.sendStateList.emit(false)
    }
  }
}