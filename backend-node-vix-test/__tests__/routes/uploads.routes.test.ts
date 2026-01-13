import { appRequest } from "../../test-utils/appRequest";
import { API_VERSION, ROOT_PATH } from "../../src/constants/basePathRoutes";

jest.mock("multer", () => {
  const multer = () => ({
    single: () => (req: any, _res: any, next: any) => {
      req.file = { originalname: "file.txt", mimetype: "image/png" };
      next();
    },
  });
  multer.memoryStorage = () => ({});
  return multer;
});

jest.mock("../../src/controllers/BucketController", () => {
  const getFileInBucketByObjectName = jest.fn((_req, res) =>
    res.status(200).send("file"),
  );
  const getFileByObjectName = jest.fn((_req, res) =>
    res.status(200).json({ url: "http://file" }),
  );
  const uploadFile = jest.fn((_req, res) =>
    res.status(200).json({ url: "http://file" }),
  );

  return {
    BucketController: jest.fn().mockImplementation(() => ({
      getFileInBucketByObjectName,
      getFileByObjectName,
      uploadFile,
    })),
    __mocks: { getFileInBucketByObjectName, getFileByObjectName, uploadFile },
  };
});

const { getFileInBucketByObjectName, getFileByObjectName, uploadFile } = (
  jest.requireMock("../../src/controllers/BucketController") as any
).__mocks;

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.UPLOADS;
const UPLOAD_BASE_PATH = API_VERSION.V1 + "/upload";

describe("Uploads routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /uploads/:objectName should call getFileInBucketByObjectName", async () => {
    const response = await appRequest({
      method: "GET",
      path: `${BASE_PATH}/file.txt`,
    });

    expect(response.status).toBe(200);
    expect(getFileInBucketByObjectName).toHaveBeenCalledTimes(1);
  });

  it("GET /upload/file/:objectName should call getFileByObjectName", async () => {
    const response = await appRequest({
      method: "GET",
      path: `${UPLOAD_BASE_PATH}/file/file.txt`,
    });

    expect(response.status).toBe(200);
    expect(getFileByObjectName).toHaveBeenCalledTimes(1);
  });

  it("POST /upload/file should call uploadFile", async () => {
    const response = await appRequest({
      method: "POST",
      path: `${UPLOAD_BASE_PATH}/file`,
      body: { any: "payload" },
    });

    expect(response.status).toBe(200);
    expect(uploadFile).toHaveBeenCalledTimes(1);
  });
});
