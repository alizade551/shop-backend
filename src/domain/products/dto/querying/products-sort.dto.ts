import { IsIn, IsOptional } from 'class-validator';
import { OrderDto } from 'src/querying/dto/order.dto';

const Sort = ['name', 'price'] as const;
type Sort = (typeof Sort)[number];
export class ProductsSortDto extends OrderDto {
  @IsOptional()
  @IsIn(Sort)
  readonly sort?: Sort = 'name';
}
