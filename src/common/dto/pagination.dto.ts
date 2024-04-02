import { IsInt, IsOptional } from 'class-validator';
import { IsCardinal } from '../decorators/validators/is-cardinal.decorator';

export class PaginationDto {
  @IsCardinal()
  readonly limit: number;

  @IsOptional()
  @IsInt()
  readonly offset?: number;
}
