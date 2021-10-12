import { style } from '@angular/animations';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit, OnChanges {

  @Input() color: string = '';
  colorText: string = '#FFFFFF';

  constructor() {
  }

  ngOnInit(): void {
  }
  //onEventNewColor =>
  ngOnChanges(changes: any): void {
    this.color = changes.color.currentValue;
    this.colorText = this.colorOfText(this.color);
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
    //mini algo maison
    if (color.length === 7) { //vrai
      let colorSum: number = this.valueRGB(color[1]) + this.valueRGB(color[3]) + this.valueRGB(color[5]);
      if ((colorSum - 22) < 0) return '#FFFFFF';
    }
    return '#000000';
  }
}
