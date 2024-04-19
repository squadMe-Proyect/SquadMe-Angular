import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    public players:PlayerService,
  ) {
  }

  ngOnInit(): void {}
}
