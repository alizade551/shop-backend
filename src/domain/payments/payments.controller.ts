import { Controller, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { IdDto } from 'src/common/dto/id.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { RequestUser } from 'src/auth/interfaces/request-user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/:id')
  payOrder(@Param() { id }: IdDto, @User() user: RequestUser) {
    return this.paymentsService.payOrder(id, user);
  }
}
