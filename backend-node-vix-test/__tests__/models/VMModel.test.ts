import { EVMStatus } from "@prisma/client";
import { VMModel } from "../../src/models/VMModel";
import { prismaMock } from "../singleton";

describe("vMModel", () => {
  let vMModel: VMModel;

  beforeEach(() => {
    vMModel = new VMModel();
  });

  it("should pass query params", async () => {
    prismaMock.vM.findMany.mockResolvedValue([]);
    prismaMock.vM.count.mockResolvedValue(0);
    const r = await vMModel.listAll({
      idBrandMaster: 1,
      query: {
        limit: 10,
        page: 1,
        offset: 1,
        orderBy: [],
        status: "RUNNING" as EVMStatus,
      },
    });
    expect(r).toEqual({ totalCount: 0, result: [] });
  });
});
