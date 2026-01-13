import { EVMStatus } from "@prisma/client";
import { vmListAllSchema } from "../../src/types/validations/VM/vmListAll";

describe("vmListAllSchema", () => {
  it("should transform idVM and status", () => {
    const result = vmListAllSchema.parse({
      idVM: "10",
      status: "running",
    });

    expect(result.idVM).toBe(10);
    expect(result.status).toBe(EVMStatus.RUNNING);
  });

  it("should allow null status", () => {
    const result = vmListAllSchema.parse({
      status: "null",
    });

    expect(result.status).toBeNull();
  });

  it("should reject invalid status", () => {
    const result = vmListAllSchema.safeParse({
      status: "invalid",
    });

    expect(result.success).toBe(false);
  });
});
