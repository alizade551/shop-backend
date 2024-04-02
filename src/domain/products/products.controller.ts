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
  ParseFilePipe,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createFileValidators } from 'src/files/util/file-validation.util';
import { MaxFileCount } from 'src/files/util/file.constants';
import { IdDto } from 'src/common/dto/id.dto';
import { IdFilenameDto } from 'src/files/dto/id-filename.dto';

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
  @UseInterceptors(FilesInterceptor('file', MaxFileCount.PRODUCT_IMAGES))
  uploadImage(
    @Param() { id }: IdDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: createFileValidators('2MB', 'png', 'jpeg'),
      }),
    )
    files: Express.Multer.File,
  ) {
    return this.productsService.uploadImages(id, files);
  }

  @Get(':id/images/:filename')
  downloadImage(@Param() { id, filename }: IdFilenameDto) {
    return this.productsService.downloadImage(id, filename);
  }

  @Delete(':id/images/:filename')
  deleteImage(@Param() { id, filename }: IdFilenameDto) {
    return this.productsService.deleteImage(id, filename);
  }
}
