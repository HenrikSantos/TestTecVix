import { querySchema } from "../../src/types/validations/Queries/queryListAll";

describe("querySchema", () => {
  it("should transform basic fields correctly", () => {
    const result = querySchema.parse({
      search: "Texto 123-_.()",
      page: "2",
      limit: "10",
      offset: "5",
      orderBy: "brandName:asc,updatedAt:desc",
      isActive: "true",
      idBrandMaster: "null",
      isPoc: "false",
    });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(5);
    expect(result.orderBy).toEqual([
      { field: "brandName", direction: "asc" },
      { field: "updatedAt", direction: "desc" },
    ]);
    expect(result.isActive).toBe(true);
    expect(result.idBrandMaster).toBeNull();
    expect(result.isPoc).toBe(false);
  });

  it("should reject search with invalid characters", () => {
    const result = querySchema.safeParse({ search: "bad@" });

    expect(result.success).toBe(false);
  });

  it("should reject invalid page", () => {
    const result = querySchema.safeParse({ page: "abc" });

    expect(result.success).toBe(false);
  });

  it("should reject orderBy with invalid direction", () => {
    const result = querySchema.safeParse({ orderBy: "name:up" });

    expect(result.success).toBe(false);
  });
});
