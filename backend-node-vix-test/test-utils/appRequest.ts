import http from "http";
import type { Socket } from "net";
import { PassThrough } from "stream";
import { app } from "../src/app";

type RequestOptions = {
  method: string;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
};

type ResponseData<TBody = unknown> = {
  status: number;
  body: TBody;
  text: string;
  headers: http.OutgoingHttpHeaders;
};

type MockSocket = PassThrough & {
  writable: boolean;
  readable: boolean;
  remoteAddress: string;
  remotePort: number;
  destroy: (error?: Error) => MockSocket;
  setTimeout: (timeout?: number, callback?: () => void) => MockSocket;
  cork: () => void;
  uncork: () => void;
};

const createSocket = () => {
  const socket = new PassThrough() as MockSocket;
  socket.writable = true;
  socket.readable = true;
  socket.remoteAddress = "127.0.0.1";
  socket.remotePort = 0;
  socket.destroy = () => socket;
  socket.setTimeout = () => socket;
  socket.cork = () => {};
  socket.uncork = () => {};
  return socket;
};

export const appRequest = async <TBody = unknown>({
  method,
  path,
  body,
  headers = {},
}: RequestOptions): Promise<ResponseData<TBody>> => {
  return new Promise((resolve, reject) => {
    const socket = createSocket();
    const req = new http.IncomingMessage(socket as unknown as Socket);
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
    res.assignSocket(resSocket as unknown as Socket);

    const chunks: Buffer[] = [];
    const originalWrite: http.ServerResponse["write"] = res.write.bind(res);
    const originalEnd: http.ServerResponse["end"] = res.end.bind(res);

    res.write = ((...args: Parameters<http.ServerResponse["write"]>) => {
      const [chunk] = args;
      if (chunk) {
        const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        chunks.push(bufferChunk);
      }
      return originalWrite(...args);
    }) as http.ServerResponse["write"];

    res.end = ((...args: Parameters<http.ServerResponse["end"]>) => {
      const [chunk] = args;
      if (chunk) {
        const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        chunks.push(bufferChunk);
      }
      return originalEnd(...args);
    }) as http.ServerResponse["end"];

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
        body: parsed as TBody,
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
