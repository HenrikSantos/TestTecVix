import path from "path";
import fs from "fs/promises";
import { BucketLocalService } from "../../src/services/BucketLocalService";
import { API_VERSION } from "../../src/constants/basePathRoutes";

jest.mock("fs/promises");

describe("BucketLocalService", () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;
  const service = new BucketLocalService();

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.BASE_URL_FILES;
  });

  it("should create uploads folder when it does not exist", async () => {
    mockedFs.access.mockRejectedValueOnce(new Error("missing"));
    mockedFs.mkdir.mockResolvedValueOnce(undefined);

    await service.ensureBucketExists();

    expect(mockedFs.access).toHaveBeenCalled();
    expect(mockedFs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining(`${path.sep}uploads`),
      { recursive: true },
    );
  });

  it("should not create uploads folder when it already exists", async () => {
    mockedFs.access.mockResolvedValueOnce(undefined);

    await service.ensureBucketExists();

    expect(mockedFs.mkdir).not.toHaveBeenCalled();
  });

  it("should create nfse folder when it does not exist", async () => {
    mockedFs.access.mockRejectedValueOnce(new Error("missing"));
    mockedFs.mkdir.mockResolvedValueOnce(undefined);

    await service.ensureNfseFolderExists();

    expect(mockedFs.access).toHaveBeenCalled();
    expect(mockedFs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining(`${path.sep}nfse`),
      { recursive: true },
    );
  });

  it("should upload and return public url", async () => {
    mockedFs.access.mockResolvedValueOnce(undefined);
    mockedFs.writeFile.mockResolvedValueOnce(undefined);
    process.env.BASE_URL_FILES = "http://files.test";
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(12345);

    const file = {
      originalname: "tést 100%.txt",
      buffer: Buffer.from("content"),
    } as Express.Multer.File;

    const result = await service.uploadFile("bucket", file);

    expect(result.objectName).toBe("12345-test_100_percent_.txt");
    expect(result.url).toBe(
      `http://files.test${API_VERSION.MAIN}/uploads/12345-test_100_percent_.txt`,
    );
    expect(mockedFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining(
        `${path.sep}uploads${path.sep}12345-test_100_percent_.txt`,
      ),
      file.buffer,
    );

    nowSpy.mockRestore();
  });

  it("should renew url using default base url", async () => {
    const result = await service.renewPresignedUrl("file.txt");

    expect(result).toBe(
      `http://localhost:3001${API_VERSION.MAIN}/uploads/file.txt`,
    );
  });
});
