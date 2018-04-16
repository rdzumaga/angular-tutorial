import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hero } from './Hero';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import { notImplemented } from '@angular/core/src/render3/util';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  private log(message: string): void {
      this.messageService.add('HeroService ' + message);
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`update hero id=${hero.id}`)),
        catchError(this.handleError<any>(`updateHero`))
      );
  }

  addHero (hero: Hero): Observable<Hero> {
    return this.http.post(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap((addedHero: Hero) => this.log(`create hero id=${addedHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero (hero: Hero | number): Observable<any> {
    const id = typeof(hero) === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>(`delete hero id=${id}`))
    );
  }

  searchHeroes (term: string): Observable<Hero[]> {

    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(`api/heroes/?name=${term}`)
      .pipe(
        tap(_ => this.log(`found heroes matching ${term}`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
