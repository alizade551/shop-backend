import { applyDecorators, ValidationPipeOptions } from '@nestjs/common';
import { IsNumber, IsPositive } from 'class-validator';

/**
 * Checks if the value is a positive number greater than zero with at the most two decimal place.
 */
export const IsCurrency = (
  validationPipeOptions?: ValidationPipeOptions,
): PropertyDecorator =>
  applyDecorators(
    IsNumber({ maxDecimalPlaces: 2 }, validationPipeOptions),
    IsPositive(validationPipeOptions),
  );
