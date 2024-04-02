import { IsOptional } from 'class-validator';
import { IsBoolean } from '../decorators/validators/is.boolean.decorators';

export class RemoveDto {
  @IsOptional()
  @IsBoolean()
  readonly soft?: boolean;
}
