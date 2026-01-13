import { Response } from "express";
import path from "path";
import { BucketController } from "../../src/controllers/BucketController";
import { STATUS_CODE } from "../../src/constants/statusCode";
import { CustomRequest } from "../../src/types/custom";

describe("BucketController", () => {
  const bucketService = {
    ensureBucketExists: jest.fn(),
    renewPresignedUrl: jest.fn(),
    uploadFile: jest.fn(),
  };
  const controller = new BucketController(bucketService);

  const mockResponse = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      sendFile: jest.fn(),
    }) as Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.MINIO_BUCKET;
  });

  it("getFileInBucketByObjectName should send the file", async () => {
    const res = mockResponse();
    const req = {
      params: { objectName: "file.txt" },
    } as unknown as CustomRequest<unknown>;

    await controller.getFileInBucketByObjectName(req, res as Response);

    expect(res.sendFile).toHaveBeenCalledWith(
      expect.stringContaining(`${path.sep}uploads${path.sep}file.txt`),
    );
  });

  it("getFileByObjectName should return url from bucketService", async () => {
    const res = mockResponse();
    const req = {
      params: { objectName: "file.txt" },
    } as unknown as CustomRequest<unknown>;
    bucketService.renewPresignedUrl.mockResolvedValueOnce("http://file");

    await controller.getFileByObjectName(req, res as Response);

    expect(bucketService.renewPresignedUrl).toHaveBeenCalledWith("file.txt");
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    expect(res.json).toHaveBeenCalledWith({ url: "http://file" });
  });

  it("uploadFile should return error when no file is provided", async () => {
    const res = mockResponse();
    const req = {
      file: undefined,
    } as unknown as CustomRequest<unknown>;

    await controller.uploadFile(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith({ message: "No file uploaded" });
  });

  it("uploadFile should send file to bucketService", async () => {
    const res = mockResponse();
    const req = {
      file: { originalname: "file.txt" },
    } as unknown as CustomRequest<unknown>;
    process.env.MINIO_BUCKET = "bucket";
    bucketService.uploadFile.mockResolvedValueOnce({ url: "http://file" });

    await controller.uploadFile(req, res as Response);

    expect(bucketService.uploadFile).toHaveBeenCalledWith("bucket", req.file);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    expect(res.json).toHaveBeenCalledWith({ url: "http://file" });
  });
});
