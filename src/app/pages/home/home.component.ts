import { Component, OnInit, HostListener, EventEmitter } from '@angular/core';
import { ColorService } from 'src/app/services/color.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, style, transition, trigger } from '@angular/animations';

export interface Box {
  hex: string;
  textColor: string;
  isLock: boolean;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('testTransition', [
      transition(':enter', [
        style({ 'flex-grow': 0, 'width': 0 }),
        animate('300ms', style({ 'flex-grow': 1  })),
      ]),
      transition(':leave', [
        animate('300ms', style({ 'flex-grow': 0, 'width': 0 }))
      ])
    ]),
  ]
})

export class HomeComponent implements OnInit {

  boxes: Box[] = [];
  isClicked: boolean = false;

  constructor(
    private colorService: ColorService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    for (let i = 0; i < 5; i++) {
      const hex = this.getRandomColor();
      const textColor = this.colorOfText(hex);
      this.boxes.push({ hex, textColor, isLock: false });
    }
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    console.log(event)
    if (event.code === 'Space') {
      this.generate();
      //do event dispatch

    }
  }

  generate() {
    this.boxes = this.boxes.map((box: Box) => {
      if (!box.isLock) {
        box.hex = this.getRandomColor();
        box.textColor = this.colorOfText(box.hex);
      }
      return box;
    })
  }

  // getShades() {
  //   const shades = [-100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  //   shades.map((shade: number) => {
  //     this.shades.push(this.colorService.adjust(this.color, shade))
  //   })
  // }

  valueRGB(c: string): number {
    let value = 0;
    if (c.length === 1) {
      switch (c.toLowerCase()) {
        case 'a': value = 10; break;
        case 'b': value = 11; break;
        case 'c': value = 12; break;
        case 'd': value = 13; break;
        case 'e': value = 14; break;
        case 'f': value = 15; break;
        default: value = parseInt(c); break;
      }
    }
    return value;
  }

  colorOfText(color: string): string {
    if (color.length === 7) {
      let colorSum: number = this.valueRGB(color[1]) + this.valueRGB(color[3]) + this.valueRGB(color[5]);
      if ((colorSum - 24) > 0) return '#000000';
    }
    return '#FFFFFF';
  }

  copyToClipboard(box: Box) {
    navigator.clipboard.writeText('#' + box.hex);
    this.matSnackBar.open('Code hexa enregistré : ' + box.hex, 'Fermé')
  }

  lock(box: Box) {
    this.boxes = this.boxes.map((b: Box) => {
      console.log(b, box)
      if (box.hex === b.hex) {
        b.isLock = true;
      }
      return b;
    })
    box.isLock = true;
  }

  removeColor(box: Box) {
    this.boxes = this.boxes.filter((b: Box) => b.hex !== box.hex)
  }

  newColor(box :Box) : void {
    const hex = this.getRandomColor();
    const textColor = this.colorOfText(hex);
    this.boxes.splice(this.boxes.indexOf(box),0,{
      hex,
      textColor,
      isLock: false
    });  
  }
}

