import { Divider, Stack } from "@mui/material";
import { LabelInputVM } from "./LabelInputVM";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TextRob18Font2M } from "../../../components/Text2M";
import { useZTheme } from "../../../stores/useZTheme";
import { DropDowText } from "./DropDowText";
import { TOptionsTyped } from "../../../types/FormType";
import { SliderLabelNum } from "./SliderLabelNum";
import { CheckboxLabel } from "./CheckboxLabel";
import { Btn } from "../../../components/Buttons/Btn";
import { TextRob16Font1S } from "../../../components/Text1S";
import { useVmResource } from "../../../hooks/useVmResource";
import { ModalConfirmCreate } from "./ModalConfirmCreate";
import { genStrongPass } from "../../../utils/genStrongPass";
import { MIN_PASS_SIZE } from "../../../configs/contants";
import { PasswordValidations } from "./PasswordValidations";
import { EOS, useZVMSugestion } from "../../../stores/useZVMSugestion";
import { ENetworkType } from "../../../types/VMTypes";
import { AbsoluteBackDrop } from "../../../components/AbsoluteBackDrop";
import { useZVM } from "../../../stores/useZVM";

export const FormVM = () => {
  const { t } = useTranslation(); // createVm
  const { mode, theme } = useZTheme();
  const {
    vmSO,
    setVmSO,
    vmPassword,
    setVmPassword,
    vmName,
    setVmName,
    vmvCpu,
    setVmvCpu,
    vmMemory,
    setVmMemory,
    vmDisk,
    setVmDisk,
    vmLocalization,
    setVmLocalization,
    hasBackup,
    setHasBackup,
    vmNetwork,
    setVmNetwork,
    openConfirm,
    setOpenConfirm,
  } = useZVM();

  const {
    createVm,
    validPassword,
    storageOptions,
    localizationOptions,
    networkTypeOptions,
    isLoadingCreateVM,
  } = useVmResource();

  const {
    os: sugestionOS,
    vCPU: sugestionVCPU,
    ram: sugestionRAM,
    disk: sugestionDisk,
    resetAll,
  } = useZVMSugestion();

  const vmStorageType = {
    value: "ssd",
    label: "SSD",
  };
  const handleCancel = () => {
    setVmPassword(genStrongPass(MIN_PASS_SIZE));
    setVmName("");
    setVmSO(null);
    setVmvCpu(0);
    setVmMemory(0);
    setVmDisk(0);
    setVmLocalization(null);
    setHasBackup(false);
    setVmNetwork(networkTypeOptions[0]);
  };

  const handleCreateVm = async () => {
    const vm = {
      hasBackup,
      vmPassword,
      vmName,
      vmNetwork,
      vmSO,
      vmvCpu,
      vmMemory,
      vmDisk,
      vmStorageType,
      vmLocalization,
    };

    const isValidPass = validPassword(vmPassword);
    if (!isValidPass) return;

    await createVm({
      ...vm,
      networkType: vmNetwork?.value,
      vmName: vmName,
      vCPU: vmvCpu,
      ram: vmMemory,
      disk: vmDisk,
      hasBackup: hasBackup,
      os: String(vmSO?.value) || "",
      pass: vmPassword,
    });
  };

  const disabledBtn =
    !vmName ||
    !vmSO ||
    !vmvCpu ||
    !vmMemory ||
    !vmDisk ||
    !vmLocalization ||
    !vmPassword ||
    !vmNetwork;

  const osOptions = Object.values(EOS)
    .filter((os) => os !== EOS.notFound)
    .map((os) => ({
      label: os,
      value: os,
    }));

  useEffect(() => {
    if (sugestionOS)
      setVmSO({
        label: sugestionOS,
        value: sugestionOS,
      });
    if (sugestionVCPU) setVmvCpu(sugestionVCPU);
    if (sugestionRAM) setVmMemory(sugestionRAM);
    if (sugestionDisk) setVmDisk(sugestionDisk);
  }, [sugestionOS, sugestionVCPU, sugestionRAM, sugestionDisk]);

  useEffect(() => {
    if (!vmNetwork) {
      setVmNetwork(networkTypeOptions[0]);
    }
    return () => {
      resetAll();
    };
  }, []);

  return (
    <>
      {isLoadingCreateVM && <AbsoluteBackDrop open={isLoadingCreateVM} />}
      <Stack
        className="w-full"
        sx={{
          padding: "24px",
          gap: "24px",
        }}
      >
        {/* Title */}
        <TextRob18Font2M
          sx={{
            color: theme[mode].black,
            fontSize: "18px",
            fontWeight: "500",
            lineHeight: "24px",
          }}
        >
          {t("createVm.vmRegister")}
        </TextRob18Font2M>
        {/* Inputs */}

        {/* User and password */}
        <Stack
          sx={{
            gap: "24px",
            "@media (min-width: 660px)": {
              flexDirection: "row",
            },
          }}
        >
          <LabelInputVM
            disabled
            onChange={() => {}}
            value={"root"}
            label={t("createVm.userVM")}
            placeholder={t("createVm.name")}
          />
          <Stack
            sx={{
              width: "100%",
            }}
          >
            <LabelInputVM
              onChange={setVmPassword}
              value={vmPassword}
              label={t("createVm.password")}
              placeholder={t("createVm.userPassword")}
              type="password"
            />
            <PasswordValidations vmPassword={vmPassword} />
          </Stack>
        </Stack>
        <Divider
          sx={{
            borderColor: theme[mode].grayLight,
          }}
        />
        <LabelInputVM
          onChange={setVmName}
          value={vmName}
          label={t("createVm.vmName")}
          placeholder={t("createVm.sampleName")}
          containerSx={{
            "@media (min-width: 660px)": {
              maxWidth: "288px",
            },
          }}
        />
        {/* Location and System */}
        <Stack
          sx={{
            gap: "24px",
            "@media (min-width: 660px)": {
              flexDirection: "row",
            },
          }}
        >
          <DropDowText
            label={t("createVm.dataCenterLocation")}
            data={localizationOptions}
            value={vmLocalization}
            onChange={setVmLocalization}
          />
          <DropDowText
            label={t("createVm.operationalSystem")}
            data={osOptions}
            value={vmSO}
            onChange={setVmSO}
          />
        </Stack>
        {/* Sliders */}
        <Stack
          sx={{
            gap: "24px",
            "@media (min-width: 660px)": {
              flexDirection: "row",
            },
          }}
        >
          <SliderLabelNum
            label={t("createVm.cpu")}
            value={vmvCpu}
            onChange={setVmvCpu}
            min={1}
            max={16}
          />
          <SliderLabelNum
            label={t("createVm.memory")}
            value={vmMemory}
            onChange={setVmMemory}
            min={1}
            max={128}
          />
          <SliderLabelNum
            label={t("createVm.disk")}
            value={vmDisk}
            onChange={setVmDisk}
            min={20}
            max={2048}
            step={16}
          />
        </Stack>
        {/* Advanced options */}
        <Stack
          sx={{
            gap: "24px",
          }}
        >
          {/* Network Type */}
          <DropDowText
            label={t("createVm.network")}
            data={networkTypeOptions}
            value={vmNetwork}
            onChange={(val) => setVmNetwork(val as TOptionsTyped<ENetworkType>)}
            sxContainer={{
              maxWidth: "280px",
            }}
          />
          {/* Items */}
          <Stack
            sx={{
              gap: "24px",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <DropDowText
              disabled
              label={t("createVm.storageType")}
              data={storageOptions}
              value={vmStorageType}
              onChange={() => {}}
              sxContainer={{
                maxWidth: "180px",
              }}
            />
          </Stack>
          {/* Backup */}
          <CheckboxLabel
            value={hasBackup}
            onChange={setHasBackup}
            label={t("createVm.autoBackup")}
          />
        </Stack>
        {/* Action button */}
        <Stack
          sx={{
            "@media (min-width: 660px)": {
              flexDirection: "row",
              gap: "24px",
            },
          }}
        >
          <Btn
            onClick={handleCancel}
            sx={{
              display: "none",
              padding: "9px 24px",
              backgroundColor: theme[mode].grayLight,
              borderRadius: "12px",
              "@media (min-width: 660px)": {
                minWidth: "120px",
                display: "inline",
              },
            }}
          >
            <TextRob16Font1S
              sx={{
                color: theme[mode].gray,
                fontSize: "16px",
                fontWeight: "500",
                lineHeight: "16px",
              }}
            >
              {t("createVm.cancelBtn")}
            </TextRob16Font1S>
          </Btn>
          <Btn
            disabled={disabledBtn}
            onClick={() => setOpenConfirm(true)}
            sx={{
              padding: "9px 24px",
              backgroundColor: theme[mode].blue,
              borderRadius: "12px",
              "@media (min-width: 660px)": {
                minWidth: "160px",
              },
            }}
          >
            <TextRob16Font1S
              sx={{
                color: theme[mode].btnText,
                fontSize: "16px",
                fontWeight: "500",
                lineHeight: "20px",
              }}
            >
              {t("createVm.createBtn")}
            </TextRob16Font1S>
          </Btn>
        </Stack>
      </Stack>
      {openConfirm && (
        <ModalConfirmCreate
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={() => {
            setOpenConfirm(false);
            handleCreateVm();
          }}
          hasBackup={hasBackup}
          vmUser={"root"}
          vmPassword={vmPassword}
          vmName={vmName}
          vmSO={vmSO?.label}
          vmvCpu={vmvCpu.toString()}
          vmMemory={vmMemory.toString()}
          vmDisk={vmDisk.toString()}
          vmStorageType={vmStorageType?.label}
          vmLocalization={vmLocalization?.label}
          vmNetwork={vmNetwork?.label}
        />
      )}
    </>
  );
};
