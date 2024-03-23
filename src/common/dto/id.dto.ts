import { IsCardinal } from '../decorators/is-cardinal.decorator';

export class IdDto {
  @IsCardinal()
  readonly id: number;
}
