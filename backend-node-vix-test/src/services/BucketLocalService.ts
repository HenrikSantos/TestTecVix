import { sanetizeName } from "../utils/sanetizeName";
import fs from "fs/promises";
import path from "path";
import type { Express } from "express";
import { IBucketService } from "../types/Interfaces/IBucketService";
import { API_VERSION } from "../constants/basePathRoutes";

export class BucketLocalService implements IBucketService {
  private bucketPath = path.resolve(__dirname, "..", "..");
  async ensureBucketExists() {
    const folder = path.resolve(this.bucketPath, "uploads");
    try {
      await fs.access(folder); // Verifica se a pasta existe
    } catch {
      // Se não existir, cria o diretório
      await fs.mkdir(folder, { recursive: true });
    }
  }

  async ensureNfseFolderExists() {
    const folder = path.resolve(this.bucketPath, "nfse");
    try {
      await fs.access(folder); // Verifica se a pasta existe
    } catch {
      // Se não existir, cria o diretório
      await fs.mkdir(folder, { recursive: true });
    }
  }

  private getPublicUrl({
    objectName,
  }: {
    bucket?: string;
    objectName: string;
  }) {
    return `${process.env.BASE_URL_FILES || "http://localhost:3001"}${API_VERSION.MAIN}/uploads/${objectName}`;
  }

  async uploadFile(_bucket: string, file: Express.Multer.File) {
    await this.ensureBucketExists();
    // const metaData = { "Content-Type": file.mimetype };
    const objectName = `${Date.now()}-${sanetizeName(file.originalname)}`;
    const url = path.resolve(this.bucketPath, "uploads", objectName);
    await fs.writeFile(url, file.buffer);
    const publicUrl = this.getPublicUrl({ objectName });

    return { objectName, url: publicUrl };
  }

  async renewPresignedUrl(objectName: string) {
    return this.getPublicUrl({ objectName });
  }
}
