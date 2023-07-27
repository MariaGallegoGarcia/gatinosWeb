import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Colony } from './colony';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class ColonyService {

  private coloniesUrl = 'api/colonies';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET colonies from the server */
  getColonies(): Observable<Colony[]> {
    return this.http.get<Colony[]>(this.coloniesUrl)
      .pipe(
        tap(_ => this.log('fetched colonies')),
        catchError(this.handleError<Colony[]>('getColonies', []))
      );
  }

  /** GET colony by id. Return `undefined` when id not found */
  getColonyNo404<Data>(id: number): Observable<Colony> {
    const url = `${this.coloniesUrl}/?id=${id}`;
    return this.http.get<Colony[]>(url)
      .pipe(
        map(colonies => colonies[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} colony id=${id}`);
        }),
        catchError(this.handleError<Colony>(`getColony id=${id}`))
      );
  }

  /** GET colony by id. Will 404 if id not found */
  getColony(id: number): Observable<Colony> {
    const url = `${this.coloniesUrl}/${id}`;
    return this.http.get<Colony>(url).pipe(
      tap(_ => this.log(`fetched colony id=${id}`)),
      catchError(this.handleError<Colony>(`getColony id=${id}`))
    );
  }

  /* GET colonies whose name contains search term */
  searchColonies(term: string): Observable<Colony[]> {
    if (!term.trim()) {
      // if not search term, return empty colony array.
      return of([]);
    }
    return this.http.get<Colony[]>(`${this.coloniesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found colonies matching "${term}"`) :
         this.log(`no colonies matching "${term}"`)),
      catchError(this.handleError<Colony[]>('searchColonies', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new colony to the server */
  addColony(colony: Colony): Observable<Colony> {
    return this.http.post<Colony>(this.coloniesUrl, colony, this.httpOptions).pipe(
      tap((newColony: Colony) => this.log(`added colony w/ id=${newColony.id}`)),
      catchError(this.handleError<Colony>('addColony'))
    );
  }

  /** DELETE: deletes the colony from the server */
  deleteColony(id: number): Observable<Colony> {
    const url = `${this.coloniesUrl}/${id}`;

    return this.http.delete<Colony>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted colony id=${id}`)),
      catchError(this.handleError<Colony>('deleteColony'))
    );
  }

  /** PUT: updates the colony on the server */
  updateColony(colony: Colony): Observable<any> {
    return this.http.put(this.coloniesUrl, colony, this.httpOptions).pipe(
      tap(_ => this.log(`updated colony id=${colony.id}`)),
      catchError(this.handleError<any>('updateColony'))
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

  /** Log a ColonyService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ColonyService: ${message}`);
  }
}
