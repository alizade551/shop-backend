import {
  FileTypeValidator,
  FileValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import * as bytes from 'bytes';
import { NonEmptyArray } from 'src/common/util/array.util';

type FileType = 'png' | 'jpeg' | 'pdf';
type FileSize = `${number}${'KB' | 'MB' | 'GB'}`;

export const createFileValidators = (
  maxSize: FileSize,
  ...fileTypes: NonEmptyArray<FileType>
): FileValidator[] => {
  const fileTypeRegex = new RegExp(fileTypes.join('|'));

  return [
    new MaxFileSizeValidator({ maxSize: bytes(maxSize) }),
    new FileTypeValidator({ fileType: fileTypeRegex }),
  ];
};
