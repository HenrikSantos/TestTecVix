import { appRequest } from "../../test-utils/appRequest";

describe("Testing API", () => {
  it("should return 200 root", async () => {
    const res = await appRequest({ method: "GET", path: "/" });
    expect(res.status).toBe(200);
  });

  it("should return 200 home api", async () => {
    const res = await appRequest({ method: "GET", path: "/api/v1" });
    expect(res.status).toBe(200);
  });

  it("should return 501", async () => {
    const res = await appRequest({
      method: "GET",
      path: "/lorem/ipsum/dolor/sit/amet/not-found",
    });
    expect(res.status).toBe(501);
  });
});
