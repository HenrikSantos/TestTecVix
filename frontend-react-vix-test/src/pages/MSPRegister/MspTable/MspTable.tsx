import { Fragment, useEffect } from "react";
import { useZTheme } from "../../../stores/useZTheme";
import { Box, IconButton, Stack } from "@mui/material";
import { ImgFromDB } from "../../../components/ImgFromDB";
import { TextRob14Font1Xs } from "../../../components/Text1Xs";
import { TextRob12Font2Xs } from "../../../components/Text2Xs";
import { useTranslation } from "react-i18next";
import { PencilCicleIcon } from "../../../icons/PencilCicleIcon";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useZUserProfile } from "../../../stores/useZUserProfile";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { useBrandMasterResources } from "../../../hooks/useBrandMasterResources";
import { useUploadFile } from "../../../hooks/useUploadFile";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../services/api";
import { IListAll } from "../../../types/ListAllTypes";
import { IUserResponse } from "../../../types/userTypes";
import moment from "moment";

interface IMspTableProps {
  onEditMsp: () => void;
}

export const MspTable = ({ onEditMsp }: IMspTableProps) => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const {
    setCep,
    setLocation,
    setCountryState,
    setCity,
    setStreet,
    setStreetNumber,
    setCompanyName,
    setCnpj,
    setPhone,
    setSector,
    setContactEmail,
    setMSPDomain,
    mspList,
    setMspList,
    resetAll,
    setIsEditing,
    isEditing,
    setMspToBeDeleted,
    mspTableFilter,
    setModalOpen,
    setActiveStep,
    setBrandLogo,
    setCityCode,
    setDistrict,
    setEnterOnEditing,
    setShowAddressFields,
    setIsPoc,
    isPocFilter,
    setDiscountRate,
    setMinConsumption,
    setAdmName,
    setAdmEmail,
    setAdmPhone,
  } = useZMspRegisterPage();

  const { listAllBrands } = useBrandMasterResources();
  const { getFileByObjectName } = useUploadFile();
  const { getAuth } = useAuth();

  const { role } = useZUserProfile();

  useEffect(() => {
    const fetchMsps = async () => {
      const response = await listAllBrands();
      return setMspList(response.result);
    };

    fetchMsps();
  }, []);

  const startEditing = (index: number) => {
    setShowAddressFields(true);
    setIsEditing([index]);
  };

  const saveEdit = () => {
    setShowAddressFields(false);
    setIsEditing([]);
    resetAll();
  };

  const handleEdit = async (index: number) => {
    setEnterOnEditing(true);
    startEditing(index);
    setActiveStep(0);
    const msp = mspList.find((c) => c.idBrandMaster === index);
    setCompanyName(msp?.brandName || "");
    setCnpj(msp?.cnpj || "");
    setPhone(msp?.smsContact || "");
    setContactEmail(msp?.emailContact || "");
    setCep(msp?.cep || "");
    setLocation(msp?.location || "");
    setCountryState(msp?.state || "");
    setCity(msp?.city || "");
    setStreet(msp?.street || "");
    setStreetNumber(msp?.placeNumber || "");
    setSector(msp?.setorName || "");
    setMSPDomain(msp?.domain || "");
    setCityCode(msp?.cityCode ? `${msp.cityCode}` : "");
    setDistrict(msp?.district || "");
    setIsPoc(Boolean(msp?.isPoc));
    setDiscountRate(Number(msp?.discountRate) || 0);
    setMinConsumption(
      Number(msp?.minConsumption) ? Number(msp.minConsumption) : 0,
    );

    // Buscar admin do MSP
    try {
      const auth = await getAuth();
      const usersResponse = await api.get<IListAll<IUserResponse>>({
        url: "/user",
        auth,
        params: {
          idBrandMaster: index,
          isActive: "true",
        },
      });
      const adminUser = usersResponse.data?.result?.find(
        (u) => u.role === "admin",
      );
      if (adminUser) {
        setAdmName(adminUser.fullName || adminUser.username || "");
        setAdmEmail(adminUser.email || "");
        setAdmPhone(adminUser.userPhoneNumber || "");
      }
    } catch (error) {
      console.error("Erro ao buscar admin do MSP:", error);
    }

    // Resolver URL da logo
    if (msp?.brandLogo) {
      const { url } = await getFileByObjectName(msp.brandLogo);
      setBrandLogo({
        brandLogoUrl: url || "",
        brandObjectName: msp.brandLogo,
      });
    } else {
      setBrandLogo({ brandLogoUrl: "", brandObjectName: "" });
    }

    onEditMsp();
  };

  return (
    <Stack
      sx={{
        width: "100%",
        maxHeight: "540px",
        overflow: "auto",
        gap: "16px",
      }}
    >
      {[...mspList]
        .filter(
          (msp) =>
            msp.brandName
              .toLowerCase()
              .includes(mspTableFilter.toLowerCase()) &&
            (!isPocFilter || Boolean(msp.isPoc)),
        )
        .map((msp, index) => (
          <Fragment key={`${msp.idBrandMaster}-${msp.brandName}`}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 4px",
                gap: "16px",
                "@media (max-width: 800px)": {
                  flexDirection: "column",
                  alignItems: "flex-start",
                },
              }}
            >
              <Box
                sx={{
                  flex: "2",
                  display: "flex",
                  flexDirection: "row",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <ImgFromDB
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "100%",
                  }}
                  alt="msp image"
                  src={
                    msp.brandLogo ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhGHdcalX0wUWxZQCiSv8WzmSPpFGHr4jlsw&s"
                  }
                />
                <Stack>
                  <TextRob14Font1Xs
                    sx={{
                      color: theme[mode].black,
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {msp.brandName}
                  </TextRob14Font1Xs>
                  <TextRob12Font2Xs
                    sx={{
                      color: theme[mode].gray,
                      fontSize: "12px",
                      fontWeight: 400,
                    }}
                  >
                    {msp.emailContact || ""}
                  </TextRob12Font2Xs>
                </Stack>
              </Box>

              {/* Status */}
              <Box
                sx={{
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  "@media (max-width: 900px)": { display: "none" },
                }}
              >
                <TextRob14Font1Xs
                  sx={{
                    color: theme[mode].black,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {t("mspRegister.domain")}
                </TextRob14Font1Xs>
                <TextRob12Font2Xs
                  sx={{
                    color: theme[mode].gray,
                    fontSize: "12px",
                    fontWeight: 400,
                  }}
                >
                  {msp?.domain || ""}
                </TextRob12Font2Xs>
              </Box>
              <Box
                sx={{
                  flex: "2",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <TextRob14Font1Xs
                  sx={{
                    boxSizing: "content-box",
                    padding: "0 10px",
                    fontWeight: "400",
                    borderRadius: "12px",
                    border: `1px solid ${theme[mode].blueDark}`,
                    color: theme[mode].blueDark,
                    maxWidth: "120px",
                    overflow: "hidden",
                    textWrap: "nowrap",
                    textOverflow: "ellipsis",
                    "&:hover": {
                      cursor: "pointer",
                      background: theme[mode].blueDark,
                      color: theme[mode].mainBackground,
                    },
                  }}
                >
                  {msp.brandName}
                </TextRob14Font1Xs>

                <TextRob14Font1Xs
                  sx={{
                    boxSizing: "content-box",
                    padding: "0 10px",
                    fontWeight: "400",
                    borderRadius: "12px",
                    border: `1px solid ${
                      msp.isActive ? theme[mode].ok : theme[mode].danger
                    }`,
                    color: msp.isActive ? theme[mode].ok : theme[mode].danger,
                  }}
                >
                  {t(
                    `colaboratorRegister.${msp.isActive ? "active" : "inactive"}`,
                  )}
                </TextRob14Font1Xs>
                {msp?.isPoc && (
                  <TextRob14Font1Xs
                    sx={{
                      boxSizing: "content-box",
                      fontSize: "14px",
                      padding: "0 10px",
                      fontWeight: "400",
                      borderRadius: "12px",
                      border: `1px solid ${theme[mode].warning}`,
                      color: theme[mode].warning,
                    }}
                  >
                    {t("mspRegister.pocSinceOne")}
                    {moment(Date.now()).diff(moment(msp?.createdAt), "days")}
                    {t("mspRegister.pocSinceTwo")}
                  </TextRob14Font1Xs>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  "@media (max-width: 600px)": { display: "none" },
                }}
              >
                {(role === "admin" || role === "manager") && (
                  <IconButton
                    onClick={() =>
                      isEditing.includes(msp.idBrandMaster)
                        ? saveEdit()
                        : handleEdit(msp.idBrandMaster)
                    }
                  >
                    {isEditing.includes(msp.idBrandMaster) ? (
                      <CheckCircleOutlineRoundedIcon
                        sx={{
                          color: theme[mode].blueMedium,
                          width: "24px",
                          height: "24px",
                        }}
                      />
                    ) : (
                      <PencilCicleIcon fill={theme[mode].blueMedium} />
                    )}
                  </IconButton>
                )}
                {role === "admin" && (
                  <IconButton
                    onClick={() => {
                      setMspToBeDeleted(msp);
                      setModalOpen("deletedMsp");
                    }}
                  >
                    <DeleteForeverIcon sx={{ color: theme[mode].danger }} />
                  </IconButton>
                )}
              </Box>
            </Box>
            {index !== mspList.length - 1 && (
              <div
                key={`${msp.idBrandMaster}-${msp.brandName}-divider`}
                style={{
                  height: "1px",
                  minHeight: "1px",
                  maxHeight: "1px",
                  width: "100%",
                  background: theme[mode].grayLight,
                }}
              />
            )}
          </Fragment>
        ))}
    </Stack>
  );
};
