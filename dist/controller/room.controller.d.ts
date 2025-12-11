import type { Response, Request } from "express";
declare const createRoom: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getRoom: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const updateRoom: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const deleteRoom: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export { createRoom, getRoom, updateRoom, deleteRoom, };
//# sourceMappingURL=room.controller.d.ts.map