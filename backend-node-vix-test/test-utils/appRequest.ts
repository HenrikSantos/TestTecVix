import http from "http";
import { PassThrough } from "stream";
import { app } from "../src/app";

type RequestOptions = {
  method: string;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
};

type ResponseData = {
  status: number;
  body: any;
  text: string;
  headers: http.OutgoingHttpHeaders;
};

const createSocket = () => {
  const socket = new PassThrough() as any;
  socket.writable = true;
  socket.readable = true;
  socket.remoteAddress = "127.0.0.1";
  socket.remotePort = 0;
  socket.destroy = () => {};
  socket.setTimeout = () => socket;
  socket.cork = () => {};
  socket.uncork = () => {};
  return socket;
};

export const appRequest = async ({
  method,
  path,
  body,
  headers = {},
}: RequestOptions): Promise<ResponseData> => {
  return new Promise((resolve, reject) => {
    const socket = createSocket();
    const req = new http.IncomingMessage(socket);
    req.method = method;
    req.url = path;
    req.headers = { ...headers };

    if (body !== undefined) {
      const payload = JSON.stringify(body);
      req.headers["content-type"] = "application/json";
      req.headers["content-length"] = Buffer.byteLength(payload).toString();
      req.push(payload);
    }
    req.push(null);

    const res = new http.ServerResponse(req);
    const resSocket = createSocket();
    res.assignSocket(resSocket);

    const chunks: Buffer[] = [];
    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.write = ((chunk: any, ...args: any[]) => {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      return originalWrite(chunk, ...args);
    }) as any;

    res.end = ((chunk: any, ...args: any[]) => {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      return originalEnd(chunk, ...args);
    }) as any;

    res.on("finish", () => {
      const text = Buffer.concat(chunks).toString("utf8");
      const contentType = res.getHeader("content-type");
      let parsed: unknown = text;
      if (
        typeof contentType === "string" &&
        contentType.includes("application/json") &&
        text.length
      ) {
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = text;
        }
      }
      resolve({
        status: res.statusCode,
        body: parsed,
        text,
        headers: res.getHeaders(),
      });
    });

    res.on("error", reject);

    try {
      const handler = app as unknown as (
        req: http.IncomingMessage,
        res: http.ServerResponse,
      ) => void;
      handler(req, res);
    } catch (error) {
      reject(error);
    }
  });
};
