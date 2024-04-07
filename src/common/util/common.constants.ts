import { ValidationPipeOptions } from '@nestjs/common';

export const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    // "1"=>1 & "true"=>true "false"=>false string to normal
    enableImplicitConversion: true,
  },
};
