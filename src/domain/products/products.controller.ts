import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/querying/dto/pagination.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'src/files/util/file-validation.util';
import {
  MaxFileCount,
  MULTIPART_FORMDATA_KEY,
} from 'src/files/util/file.constants';
import { IdDto } from 'src/common/dto/id.dto';
import { IdFilenameDto } from 'src/files/dto/id-filename.dto';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileSchema, FilesSchema } from 'src/files/swagger/schemas/file.schema';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  @Public()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Post(':id/image')
  @ApiConsumes(MULTIPART_FORMDATA_KEY)
  @ApiBody({ type: FilesSchema })
  @UseInterceptors(FilesInterceptor('files', MaxFileCount.PRODUCT_IMAGES))
  uploadImages(
    @Param() { id }: IdDto,
    @UploadedFiles(createParseFilePipe('2MB', 'png', 'jpeg'))
    files: Express.Multer.File[],
  ) {
    return this.productsService.uploadImages(id, files);
  }

  @Public()
  @ApiOkResponse({ type: FileSchema })
  @Get(':id/images/:filename')
  downloadImage(@Param() { id, filename }: IdFilenameDto) {
    return this.productsService.downloadImage(id, filename);
  }

  @Delete(':id/images/:filename')
  deleteImage(@Param() { id, filename }: IdFilenameDto) {
    return this.productsService.deleteImage(id, filename);
  }
}
