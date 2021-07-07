import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input()
  confirmed : number;
  @Input()
  recovered : number;
  @Input()
  death : number;
  @Input()
  active : number;

  constructor() { }

  ngOnInit(): void {
  }

}
