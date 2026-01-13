import { ScreenFullPage } from "../../components/ScreenFullPage";
import { Stack } from "@mui/material";
import { Title } from "./components/Title";
import { Header } from "./components/Header";
import { TableComponent } from "./components/Table";
import CustomPagination from "../../components/Pagination/CustomPagination";
import { useZMyVMsList } from "../../stores/useZMyVMsList";
import { useMyVMList } from "../../hooks/useMyVMList";
import { useEffect } from "react";
import { useZUserProfile } from "../../stores/useZUserProfile";
import { useZGlobalVar } from "../../stores/useZGlobalVar";
import { useWindowSize } from "../../hooks/useWindowSize";
import { SkeletonTable } from "./components/SkeletonTable";
import { ModalEditVM } from "./components/ModalEditVM";
import { AbsoluteBackDrop } from "../../components/AbsoluteBackDrop";

export const MyVMsPage = () => {
  const {
    setCurrentPage,
    setVMList,
    setTotalCount,
    setIsFirstLoading,
    setCurrentVM,
    totalCount,
    currentPage,
    search,
    order,
    orderBy,
    limit,
    status,
    isFirstLoading,
    currentVM,
    vmList,
    onlyMyVMs,
    selectedMSP,
  } = useZMyVMsList();
  const { fetchMyVmsList, isLoading } = useMyVMList();
  const { idBrand } = useZUserProfile();
  const { isOpenSideBar } = useZGlobalVar();
  const { width } = useWindowSize();
  const { updateThisVm, setUpdateThisVm } = useZGlobalVar();
  const { socketRef } = useZGlobalVar();

  const handlerFetchVMList = async (page: number = 0) => {
    let idBrandMasterParam: number | "null" | undefined;

    if (selectedMSP) {
      idBrandMasterParam = selectedMSP.idBrandMaster;
    } else if (onlyMyVMs) {
      idBrandMasterParam = idBrand;
    }

    const { totalCount, vmList } = await fetchMyVmsList({
      search: search || undefined,
      page: page || currentPage - 1 || 0,
      orderBy: orderBy ? `${orderBy}:${order}` : undefined,
      limit,
      idBrandMaster: idBrandMasterParam,
      status: status || undefined,
    });
    setVMList(vmList);
    setTotalCount(totalCount);
    if (isFirstLoading) setIsFirstLoading(false);
  };

  const onCloseAndEditVM = (edit: boolean) => {
    if (edit) handlerFetchVMList();
    setCurrentVM(null);
  };

  useEffect(() => {
    if (isLoading) return;
    setCurrentPage(1);
    handlerFetchVMList();
  }, [search, order, orderBy, selectedMSP, status, onlyMyVMs]);

  useEffect(() => {
    if (isOpenSideBar) return;
    if (isLoading) return;
    handlerFetchVMList(currentPage - 1);
  }, [currentPage]);

  useEffect(() => {
    if (isOpenSideBar) return;
    if (isLoading) return;
    if (!updateThisVm) return;
    const vmToUpdate = vmList.find((vm) => vm.idVM === updateThisVm);
    setUpdateThisVm(null);
    if (vmToUpdate) {
      handlerFetchVMList();
    }
  }, [updateThisVm, isOpenSideBar, isLoading]);

  useEffect(() => {
    if (!socketRef.connected) return;
    socketRef.on("updateTask", () => {
      handlerFetchVMList();
    });
    return () => {
      socketRef.off("updateTask");
    };
  }, [
    socketRef,
    currentPage,
    search,
    order,
    orderBy,
    selectedMSP,
    status,
    onlyMyVMs,
  ]);

  return (
    <ScreenFullPage
      title={<Title />}
      sxTitleSubTitle={{ paddingLeft: "40px", paddingRight: "40px" }}
    >
      <Stack
        sx={{
          maxWidth: "100%",
          width: "100%",
          gap: "32px",
          "@media (max-width: 659px)": { gap: "0" },
        }}
      >
        {/* Mobile separator */}
        {width < 660 ? (
          <Stack
            sx={{
              marginTop: "-24px",
              width: "100%",
              padding: "16px",
            }}
          >
            <Header />
          </Stack>
        ) : (
          <Stack
            sx={{
              width: "100%",
              padding: "0 24px",
            }}
          >
            <Header />
          </Stack>
        )}
        {/* Main content */}
        {isFirstLoading ? (
          <SkeletonTable />
        ) : (
          <Stack
            sx={{
              width: "100%",
              "@media (max-width: 1430px)": {
                padding: "16px",
                paddingBottom: "50px",
              },
            }}
          >
            {isLoading && <AbsoluteBackDrop open={isLoading} />}
            {/* Main table */}
            <Stack
              sx={{
                width: "100%",
              }}
            >
              <TableComponent />
            </Stack>
            {/* pagination */}
            <Stack
              sx={{
                width: "100%",
              }}
            >
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalCount}
                onPageChange={(page) => setCurrentPage(page)}
                limit={limit}
              />
            </Stack>
          </Stack>
        )}
        {Boolean(currentVM) && (
          <ModalEditVM open={Boolean(currentVM)} onClose={onCloseAndEditVM} />
        )}
      </Stack>
    </ScreenFullPage>
  );
};
