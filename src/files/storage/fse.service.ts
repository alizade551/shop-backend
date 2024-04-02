import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { join } from 'path';
import { BASE_PATH } from '../util/file.constants';
import {
  createReadStream,
  mkdirp,
  pathExists,
  readdir,
  remove,
  writeFile,
} from 'fs-extra';

@Injectable()
export class FseService {
  async saveFile(path: string, file: Express.Multer.File) {
    const fullPath = join(BASE_PATH, path, file.originalname);
    await writeFile(fullPath, file.buffer);
    // writeFile(fullPath, file.buffer, (err) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     // file written successfully
    //   }
    // });
  }

  async createDir(path: string) {
    const fullPath = join(BASE_PATH, path);
    await mkdirp(fullPath);
  }

  getFile(path: string) {
    const fullPath = join(BASE_PATH, path);
    const stream = createReadStream(fullPath);
    return new StreamableFile(stream);
  }

  getDirFilenames(path: string) {
    const fullPath = join(BASE_PATH, path);
    return readdir(fullPath);
  }
  async getDirFilecount(path: string) {
    const dirFilenames = await this.getDirFilenames(path);
    return dirFilenames.length;
  }

  async delete(path: string) {
    const fullPath = join(BASE_PATH, path);
    await remove(fullPath);
  }

  async validatePath(path: string) {
    const fullPath = join(BASE_PATH, path);
    if (!(await pathExists(fullPath))) {
      throw new NotFoundException('Path not found');
    }
  }
}
