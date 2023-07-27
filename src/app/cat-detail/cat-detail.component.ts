import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Cat } from '../cat';
import { CatService } from '../cat.service';

@Component({
  selector: 'app-cat-detail',
  templateUrl: './cat-detail.component.html',
  styleUrls: [ './cat-detail.component.css' ]
})
export class CatDetailComponent implements OnInit {
  cat: Cat | undefined;

  constructor(
    private route: ActivatedRoute,
    private catService: CatService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.catService.getCat(id)
      .subscribe(cat => this.cat = cat);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.cat) {
      this.catService.updateCat(this.cat)
        .subscribe(() => this.goBack());
    }
  }
}
