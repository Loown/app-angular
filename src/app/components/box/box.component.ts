import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ColorService } from 'src/app/services/color.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit, OnChanges {

  @Input() color: string;
  colorText: string = '#FFFFFF';
  shades: string[] = [];
  showShades: boolean = false;

  constructor(
    private colorService: ColorService,
    private matSnackBar: MatSnackBar
    ) { }
    
    ngOnInit(): void {
    this.getShades()
    console.log(this.shades)
  }

  getShades() {
    const shades = [-100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    shades.map((shade: number) => {
      this.shades.push(this.colorService.adjust(this.color, shade))
    })
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

  copyToClipboard() {
    navigator.clipboard.writeText('#' + this.color);
    this.matSnackBar.open('Code hexa enregistré : ' + this.color, 'Fermé')
  }
}
