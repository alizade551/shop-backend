import { IsInt, IsOptional, Max } from 'class-validator';
import { IsCardinal } from '../../common/decorators/validators/is-cardinal.decorator';
import { MAX_PAGE_NUMBER, MAX_PAGE_SIZE } from '../util/querying.constants';

export class PaginationDto {
  @IsCardinal()
  @Max(MAX_PAGE_SIZE)
  readonly limit: number;

  @IsOptional()
  @Max(MAX_PAGE_NUMBER)
  @IsInt()
  readonly page?: number = 1;
}
