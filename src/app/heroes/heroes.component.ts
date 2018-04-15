import { Component, OnInit } from '@angular/core';
import { Hero } from '../Hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(h => this.heroes = h);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    const hero: Hero = new Hero();
    hero.name = name;
    // this.heroService.addHero({name} as Hero)
    this.heroService.addHero(hero)
      .subscribe(nhero => this.heroes.push(nhero));
  }

  delete(hero: Hero): void {
    this.heroService.deleteHero(hero)
      .subscribe(
        () => this.heroes = this.heroes.filter(h => h.id !== hero.id)
      );
  }

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

}
