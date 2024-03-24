import { IsCardinal } from 'src/common/decorators/is-cardinal.decorator';
import { IsEntity } from 'src/common/decorators/is-entity.decorators';
import { IdDto } from 'src/common/dto/id.dto';

export class OrderItemDto {
  @IsEntity()
  readonly product: IdDto;

  @IsCardinal()
  readonly quantity: number;
}
