import { ArrayNotEmpty, IsNotEmpty, Length } from 'class-validator';
import { IsCurrency } from 'src/common/decorators/validators/is-currency.decorator';
import { IsEntity } from 'src/common/decorators/validators/is-entity.decorators';
import { IdDto } from 'src/common/dto/id.dto';

export class CreateProductDto {
  @Length(2, 50)
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsCurrency()
  readonly price: number;

  @ArrayNotEmpty()
  @IsEntity()
  categories: IdDto[];
}
