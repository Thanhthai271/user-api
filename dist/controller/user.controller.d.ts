import type { Request, Response } from "express";
declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const updateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export { createUser, getUserById, getUser, deleteUser, updateUser, login };
//# sourceMappingURL=user.controller.d.ts.map