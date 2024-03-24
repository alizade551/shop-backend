import { IsEntity } from 'src/common/decorators/is-entity.decorators';
import { IdDto } from 'src/common/dto/id.dto';
import { OrderItemDto } from './order-item.dto';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsEntity()
  readonly customer: IdDto;

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => OrderItemDto)
  readonly items: OrderItemDto[];
}
