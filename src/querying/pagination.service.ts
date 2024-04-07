import { Injectable } from '@nestjs/common';
import { PaginationMeta } from './interface/pagination-meta.interface';

@Injectable()
export class PaginationService {
  calculateOffset(limit: number, page: number) {
    return limit * (page - 1);
  }

  createMeta(limit: number, page: number, count: number): PaginationMeta {
    const totalPages = Math.ceil(count / limit);
    if (page > totalPages) return;

    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      itemsPerPage: limit,
      totalItems: count,
      currentPage: page,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }
}
