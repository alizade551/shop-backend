import { ApiProperty } from '@nestjs/swagger';

export const ApiFileProperty = () =>
  ApiProperty({ type: 'string', format: 'binary' });
export const ApiFilesProperty = () =>
  ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } });
