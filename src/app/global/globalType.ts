import { Types } from "mongoose";
import { SortOrder } from 'mongoose';

export interface IPaginationOptions {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: SortOrder | string;
}


export interface IReqUser {
  email: string;
  id: Types.ObjectId;
  role: "trainer" | "trainee" | "admin" | "super_admin"; 
  status: "in-progress" | "blocked";
  iat: number;
  exp: number;
}
