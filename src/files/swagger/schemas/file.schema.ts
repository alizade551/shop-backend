import {
  ApiFileProperty,
  ApiFilesProperty,
} from '../decorators/api-file-property.decorator';

export class FileSchema {
  @ApiFileProperty()
  file: Express.Multer.File;
}

export class FilesSchema {
  @ApiFilesProperty()
  files: Express.Multer.File[];
}
