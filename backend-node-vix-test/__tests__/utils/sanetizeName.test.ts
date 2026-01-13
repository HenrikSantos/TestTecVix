import { sanetizeName } from "../../src/utils/sanetizeName";

describe("sanetizeName", () => {
  it("should remove diacritics and replace spaces and special characters", () => {
    const result = sanetizeName("tést name@100%.txt");
    expect(result).toBe("test_name_at_100_percent_.txt");
  });

  it("should truncate to the defined limit", () => {
    const result = sanetizeName("abcdefghij", 4);
    expect(result).toBe("ghij");
  });

  it("should remove control characters and consolidate underscores", () => {
    const result = sanetizeName("a\u0000  b  c");
    expect(result).toBe("a_b_c");
  });
});
