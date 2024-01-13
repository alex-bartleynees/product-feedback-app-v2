/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(
    array: any[] | null | undefined,
    field: string,
    order: string
  ): any[] {
    if (!array) {
      return [];
    }
    if (order === 'asc') {
      return array.sort((a: any, b: any) =>
        a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0
      );
    } else {
      return array.sort((a: any, b: any) =>
        a[field] > b[field] ? -1 : b[field] > a[field] ? 1 : 0
      );
    }
  }
}
