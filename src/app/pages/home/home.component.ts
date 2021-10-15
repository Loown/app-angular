import { Component, OnInit, HostListener, EventEmitter } from '@angular/core';
import { ColorService } from 'src/app/services/color.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, style, transition, trigger } from '@angular/animations';
import { CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';

export interface Box {
  hex: string;
  textColor: string;
  isLock: boolean;
  shades: string[];
  isShadesView: boolean;
  isGradient: boolean;
  gradients: string[];
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('testTransition', [
      transition(':enter', [
        style({ 'flex-grow': 0, 'width': 0 }),
        animate('300ms', style({ 'flex-grow': 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ 'flex-grow': 0, 'width': 0 }))
      ])
    ]),
    trigger('shadeTransition', [
      transition(':enter', [
        style({ 'transform': 'translateY(100vh)' }),
        animate('200ms', style({ 'transform': 'translateY(0)' })),
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
      const shades = this.getShades(hex);
      this.boxes.push({
        hex,
        textColor,
        shades,
        isLock: false,
        isShadesView: false,
        isGradient: false,
        gradients: [],
      });
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
    //console.log(event)
    if (event.code === 'Space') {
      this.generate();
    }
    //debuging
    else if (event.key === 't') {
      console.log("test");
      let a = document.getElementsByClassName("cdk-drag-dragging");
      if (a) {
        console.log(a);
        //console.log(a);
      }
      //-----------------------------
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

  getShades(color: string) {
    const shades = [-100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    return shades.map((shade: number) => {
      return this.colorService.adjust(color, shade);
    })
  }

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
    const writing = box.isGradient ? this.getBackground(box) : box.hex
    navigator.clipboard.writeText(writing);
    this.matSnackBar.open('Enregistré : ' + writing, 'Fermé')
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

  newColor(box: Box): void {
    const hex = this.getRandomColor();
    const textColor = this.colorOfText(hex);
    const shades = this.getShades(hex);
    this.boxes.splice(this.boxes.indexOf(box), 0, {
      hex,
      textColor,
      shades,
      isLock: false,
      isShadesView: false,
      isGradient: false,
      gradients: [],
    });
  }

  selectShade(box: Box, shade: string) {
    this.boxes.map((b: Box) => {
      if (b.hex === box.hex) {
        b.hex = shade;
        b.shades = this.getShades(b.hex);
        b.textColor = this.colorOfText(b.hex);
        b.isShadesView = false;
      }
      return b;
    })
  }

  makeGradient(box: Box, index: number) {
    console.log(box, this.boxes[index - 1])
    box.isGradient = true;
    box.gradients = [this.boxes[index - 1].hex]
    this.removeColor(this.boxes[index - 1])
  }

  getBackground(box: Box) {
    return box.isGradient ? `linear-gradient(45deg, ${box.hex}${box.gradients?.map((color: string) => `, ${color}`)})` : box.hex;
  }

  makeClassicBoxFromColor(color: string): Box {
    return {
      hex: color,
      textColor: this.colorOfText(color),
      isGradient: false,
      shades: this.getShades(color),
      isShadesView: false,
      isLock: false,
      gradients: [],
    }
  }

  removeGradient(box: Box, index: number) {
    const boxes = [this.makeClassicBoxFromColor(box.hex), ...box.gradients.map((color: string) => this.makeClassicBoxFromColor(color))]
    this.removeColor(box);
    this.boxes.splice(index, 0, ...boxes);
  }

  entered(event: CdkDragEnter) {
    //console.log(event);
    moveItemInArray(this.boxes, event.item.data, event.container.data);
  }
}

