import { Component, OnInit, HostListener, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {


  boxes : any = [{
    color : this.getRandomColor()
  },{
    color : this.getRandomColor()
  },{
    color : this.getRandomColor()
  },{
    color : this.getRandomColor()
  },{
    color : this.getRandomColor()
  }];

  constructor() { }

  ngOnInit(): void {
  }

  private getRandomColor(): string {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === " ") {
      console.log("New color !");
      //do event dispatch

    }
  }

}

