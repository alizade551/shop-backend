import { IsIn } from 'class-validator';

const Order = ['ASC', 'DESC'] as const;
type Order = (typeof Order)[number];

export class OrderDto {
  @IsIn(Order)
  readonly order?: Order = 'ASC';
}
