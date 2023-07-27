import { Component, OnInit } from '@angular/core';

import { Colony } from '../colony';
import { ColonyService } from '../colony.service';

@Component({
  selector: 'app-colonies',
  templateUrl: './colonies.component.html',
  styleUrls: ['./colonies.component.css']
})
export class ColoniesComponent implements OnInit {
  colonies: Colony[] = [];

  constructor(private colonyService: ColonyService) { }

  ngOnInit(): void {
    this.getColonies();
  }

  getColonies(): void {
    this.colonyService.getColonies()
    .subscribe(colonies => this.colonies = colonies);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.colonyService.addColony({ name } as Colony)
      .subscribe(colony => {
        this.colonies.push(colony);
      });
  }

  delete(colony: Colony): void {
    this.colonies = this.colonies.filter(h => h !== colony);
    this.colonyService.deleteColony(colony.id).subscribe();
  }

}
