import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Cat } from './cat';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class CatService {

  private catsUrl = 'api/cats';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET cats from the server */
  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(this.catsUrl)
      .pipe(
        tap(_ => this.log('fetched cats')),
        catchError(this.handleError<Cat[]>('getCats', []))
      );
  }

  /** GET cat by id. Return `undefined` when id not found */
  getCatNo404<Data>(id: number): Observable<Cat> {
    const url = `${this.catsUrl}/?id=${id}`;
    return this.http.get<Cat[]>(url)
      .pipe(
        map(cats => cats[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} cat id=${id}`);
        }),
        catchError(this.handleError<Cat>(`getCat id=${id}`))
      );
  }

  /** GET cat by id. Will 404 if id not found */
  getCat(id: number): Observable<Cat> {
    const url = `${this.catsUrl}/${id}`;
    return this.http.get<Cat>(url).pipe(
      tap(_ => this.log(`fetched cat id=${id}`)),
      catchError(this.handleError<Cat>(`getCat id=${id}`))
    );
  }

  /* GET cats whose name contains search term */
  searchCats(term: string): Observable<Cat[]> {
    if (!term.trim()) {
      // if not search term, return empty cat array.
      return of([]);
    }
    return this.http.get<Cat[]>(`${this.catsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found cats matching "${term}"`) :
         this.log(`no cats matching "${term}"`)),
      catchError(this.handleError<Cat[]>('searchCats', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new cat to the server */
  addCat(cat: Cat): Observable<Cat> {
    return this.http.post<Cat>(this.catsUrl, cat, this.httpOptions).pipe(
      tap((newCat: Cat) => this.log(`added cat w/ id=${newCat.id}`)),
      catchError(this.handleError<Cat>('addCat'))
    );
  }

  /** DELETE: delete the cat from the server */
  deleteCat(id: number): Observable<Cat> {
    const url = `${this.catsUrl}/${id}`;

    return this.http.delete<Cat>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted cat id=${id}`)),
      catchError(this.handleError<Cat>('deleteCat'))
    );
  }

  /** PUT: update the cat on the server */
  updateCat(cat: Cat): Observable<any> {
    return this.http.put(this.catsUrl, cat, this.httpOptions).pipe(
      tap(_ => this.log(`updated cat id=${cat.id}`)),
      catchError(this.handleError<any>('updateCat'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a CatService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`CatService: ${message}`);
  }
}
