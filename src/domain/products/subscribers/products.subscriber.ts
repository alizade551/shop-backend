import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { Product } from '../entities/product.entity';
import { BASE_PATH, FilePath } from 'src/files/util/file.constants';
import { join } from 'path';
import { pathExists } from 'fs-extra';
import { StorageService } from 'src/files/storage/storage.service';
import { Connection } from 'typeorm';

@EventSubscriber()
export class ProductsSubscriber implements EntitySubscriberInterface<Product> {
  private readonly IMAGES_FILENAMES_KEY = 'imagesFilenames';

  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
    private connection: Connection,
  ) {
    dataSource.subscribers.push(this);
    this.connection.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  async afterLoad(entity: Product) {
    const imagesFilenames = await this.getImagesFilenames(entity.id);
    entity[this.IMAGES_FILENAMES_KEY] = imagesFilenames;
  }

  private async getImagesFilenames(id: number) {
    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES);
    if (!(await pathExists(join(BASE_PATH, path)))) return;
    return this.storageService.getDirFilenames(path);
  }
}
