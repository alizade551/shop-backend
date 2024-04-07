import { IsOptional, ValidateNested } from 'class-validator';
import { IsCardinal } from 'src/common/decorators/validators/is-cardinal.decorator';
import { ToFilterOperationDto } from 'src/querying/decorators/to-filter-operation-dto.decorators';
import { FilterOperationDto } from 'src/querying/dto/filter-operations.dto';
import { NameFilterDto } from 'src/querying/dto/name-filter.dto';

export class ProductsFilterDto extends NameFilterDto {
  @IsOptional()
  @ValidateNested()
  @ToFilterOperationDto()
  readonly price?: FilterOperationDto;
  @IsOptional()
  @IsCardinal()
  readonly categoryId?: number;
}
