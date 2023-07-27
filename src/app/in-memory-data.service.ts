import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Cat } from './cat';
import { Colony } from './colony';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const cats = [
      { id: 12, name: 'Dr. Nice' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr. IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' }
    ];
    const colonies: Colony[] = [
      { id: 12, name: 'Colonia 1' },
      { id: 13, name: 'Colonia 2' },
      { id: 14, name: 'Colonia 3' },
      { id: 15, name: 'Colonia 4' },
      { id: 16, name: 'Colonia 5' },
      { id: 17, name: 'Colonia 6' },
      { id: 18, name: 'Colonia 7' },
      { id: 19, name: 'Colonia 8' },
      { id: 20, name: 'Colonia 9' }
    ];
    return {cats, colonies};
  }

  // Overrides the genId method to ensure that a cat always has an id.
  // If the array is empty,
  // the method below returns the initial number (11).
  // if the array is not empty, the method below returns the highest
  // id + 1.
  genId<T extends Cat | Colony>(table: T[]): number {
    return table.length > 0 ? Math.max(...table.map(item => item.id)) + 1 : 11;
  }
}
