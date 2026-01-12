import { PrivatePage } from "../auth/PrivatePage";
import { ColaboratorRegisterPage } from "../pages/ColaboratorRegister";

export const ColaboratorRegisterRouter = {
  path: "/colaborator-register",
  element: (
    <PrivatePage>
      <ColaboratorRegisterPage />
    </PrivatePage>
  ),
};
