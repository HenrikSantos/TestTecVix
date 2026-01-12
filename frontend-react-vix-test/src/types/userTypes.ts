export interface IUserResponse {
  idUser: string;
  idBrandMaster: number | null;
  createdAt: string | Date;
  deletedAt: string | Date | null;
  email: string | null;
  fullName: string | null;
  userPhoneNumber: string | null;
  isActive: boolean;
  lastLoginDate: string | Date | null;
  profileImgUrl: string | null;
  role: "admin" | "manager" | "member";
  socketId?: null | string;
  updatedAt: string | Date;
  username: string;
  field: string | null;
  department: string | null;
  contractDate: string | Date | null;
  brandMaster?: {
    idBrandMaster: number;
    brandName: string | null;
  } | null;
}

export interface ICreateEmployee {
  username: string;
  password: string;
  email: string;
  fullName: string;
  userPhoneNumber?: string;
  role: "admin" | "manager" | "member";
  idBrandMaster: number;
  isActive: boolean;
  field?: string;
  department?: string;
  contractDate?: string;
}

export interface IUpdateEmployee {
  username?: string;
  password?: string;
  email?: string;
  fullName?: string;
  userPhoneNumber?: string;
  role?: "admin" | "manager" | "member";
  idBrandMaster?: number;
  isActive?: boolean;
  field?: string;
  department?: string;
  contractDate?: string;
}

export interface IPincodeInfos {
  expiredPinCodeSeconds: number;
  pinCode: string;
  socketId: string | null;
  updatedAt: Date | string;
}

export interface IUserBasicInfo {
  fullName?: string | null;
  name?: string | null;
  username?: string | null;
  idUser?: number | null;
  idBrandMaster?: number | null;
}
