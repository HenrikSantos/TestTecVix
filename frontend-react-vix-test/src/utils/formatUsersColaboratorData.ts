import { Colaborator } from "../stores/useZColaboratorRegister";

interface IUser {
  idUser?: number;
  fullName: string | null;
  username: string;
  email: string | null;
  userPhoneNumber: string | null;
  profileImgUrl: string | null;
  role: "admin" | "manager" | "member";
  department: string | null;
  field: string | null;
  isActive: boolean;
  lastLoginDate: string | Date | null;
  contractDate: string | Date | null;
  brandMaster?: { brandName: string } | null;
  idBrandMaster?: number | null;
}
export const formatUsersColaboratorData = (data: IUser[]): Colaborator[] => {
  return data.map((user) => ({
    idUser: user.idUser || 0,
    name: user.fullName || user.username || "",
    username: user.username || "",
    email: user.email || "",
    permission: user.role,
    status: user.isActive ? "active" : "inactive",
    lastActivity: user.lastLoginDate || "",
    position: user.field || "",
    department: user.department || "",
    hiringDate: user.contractDate || "",
    phone: user.userPhoneNumber || "",
    idBrandMaster: user.idBrandMaster || null,
    profileImgUrl: user.profileImgUrl || "",
  }));
};
