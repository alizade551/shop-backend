import { IsOptional } from 'class-validator';
import { IsCardinal } from 'src/common/decorators/validators/is-cardinal.decorator';
import { IsCurrency } from 'src/common/decorators/validators/is-currency.decorator';
import { NameFilterDto } from 'src/querying/dto/name-filter.dto';

export class ProductsFilterDto extends NameFilterDto {
  @IsOptional()
  @IsCurrency()
  readonly price?: number;
  @IsOptional()
  @IsCardinal()
  readonly categoryId?: number;
}
