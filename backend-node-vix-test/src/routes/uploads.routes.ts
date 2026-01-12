import { Router } from "express";
import multer from "multer";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { BucketController } from "../controllers/BucketController";
import { BucketLocalService } from "../services/BucketLocalService";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.UPLOADS; // /api/v1/uploads
const UPLOAD_BASE_PATH = API_VERSION.V1 + "/upload"; // /api/v1/upload

const uploadsRoutes = Router();

// Configuração do multer para armazenar em memória
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
      "image/webp",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não permitido"));
    }
  },
});

export const makeBucketController = () => {
  const service = new BucketLocalService();
  return new BucketController(service);
};

const uploadsController = makeBucketController();

// Rota para servir arquivos por objectName (estáticos)
uploadsRoutes.get(`${BASE_PATH}/:objectName`, async (req, res) => {
  await uploadsController.getFileInBucketByObjectName(req, res);
});

// Rota para obter URL de arquivo por objectName
uploadsRoutes.get(`${UPLOAD_BASE_PATH}/file/:objectName`, async (req, res) => {
  await uploadsController.getFileByObjectName(req, res);
});

// Rota para upload de arquivos
uploadsRoutes.post(
  `${UPLOAD_BASE_PATH}/file`,
  upload.single("file"),
  async (req, res) => {
    await uploadsController.uploadFile(req, res);
  },
);

export { uploadsRoutes };
