import { PrivatePage } from "../auth/PrivatePage";
import { MSPRegisterPage } from "../pages/MSPRegister";

export const MSPRegisterRouter = {
  path: "/msp-register",
  element: (
    <PrivatePage onlyInternal={true}>
      <MSPRegisterPage />
    </PrivatePage>
  ),
};
