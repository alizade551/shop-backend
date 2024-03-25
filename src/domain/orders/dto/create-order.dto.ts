import { IdDto } from 'src/common/dto/id.dto';
import { OrderItemDto } from './order-item.dto';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntity } from 'src/common/decorators/validators/is-entity.decorators';

export class CreateOrderDto {
  @IsEntity()
  readonly customer: IdDto;

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => OrderItemDto)
  readonly items: OrderItemDto[];
}
