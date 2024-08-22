import React, { useState } from "react";
import css from "./Employees.module.scss";
import { FaPlus } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { useGetEmployeesQuery } from "../../services/api/employeesApi/employeesApi";
import { ClipLoader } from "react-spinners";
import empty from "../../assets/empty.png";
import { Button, Image, useDisclosure } from "@nextui-org/react";
import { truncateText } from "@/utils/helpers/helpers";
import { useMediaQuery } from "@uidotdev/usehooks";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import { Tooltip } from "@mui/material";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";

const Employees = () => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const { data, isLoading,error,refetch } = useGetEmployeesQuery();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  return (
    <div className={`${css.wrapper} mx-auto`}>
      <div className={css.headingTop}>
        <h1>{t("workersManagement")}</h1>
        <div className={css.bottom}>
          <p>{t("employees")}</p>
          <button type="button" onClick={() => navigate("/addEmployee")}>
            <FaPlus /> <span>{t("addEmployee")}</span>
          </button>
        </div>
      </div>

      {/* Employees  */}
      <div
        className={`${css.employeesTable} max-w-screen-2xl w-full my-6 md:my-5 overflow-x-auto scrollbar-hide`}
      >
        {/* Table Header  */}
        {!isLoading && data?.employees?.length > 0 && (
          <div className={css.tableHeader}>
            <div className={css.item}>{t("employeeName")}</div>
            <div className={css.item}>{t("employeeEmail")}</div>
            <div className={css.item}>{t("employeeContact")}</div>
            <div className={css.item}>{t("action")}</div>
          </div>
        )}

        {/* Loader  */}
        {isLoading && (
          <div className="w-full h-[360px] flex items-center justify-center">
            <ClipLoader color="#01AB8E" size={44} speedMultiplier={0.85} />
          </div>
        )}

        {/* No Data Message  */}
        {/* {!isLoading && data?.employees?.length === 0 && (
          <div className="w-full h-[400px] flex flex-col gap-0 items-center justify-center">
            <Image src={empty} alt="" width={170} />
            <p className="font-medium text-[#01ab8e]">No Record Found!</p>
          </div>
        )} */}

        {!isLoading && data?.employees?.length === 0 && (
          <div className="w-full h-[345px] flex flex-col gap-0 items-center justify-center">
            <Empty
              description={
                <span className="text-sm">{t("noEmployeesAvailable")}</span>
              }
            >
              <Button
                size="sm"
                className="border-[#01AB8E] text-[#01AB8E]"
                variant="bordered"
                startContent={<FaPlus />}
                onClick={() => navigate("/addEmployee")}
              >
                {t("createNow")}
              </Button>
            </Empty>
          </div>
        )}

        {/* Show Error If data fails to load  */}
        {!isLoading && error && (
          <div className="px-4 mx-auto pt-32 w-full flex justify-center flex-col gap-2 items-center">
            <p className="font-medium text-[17px] text-[#01ab8e]">
              {t("letsTryAgain")}
            </p>
            <span className="px-6 text-xs text-default-600 text-center max-w-xs">
              {t("fetchError")}
            </span>
            <Button
              size="sm"
              radius="sm"
              className="mt-2 py-1 px-6 text-white bg-[#01ab8e]"
              onClick={refetch}
            >
              {t("tryAgain")}
            </Button>
          </div>
        )}

        {/* Table Body  */}
        <div className={css.tableBody}>
          {!isLoading &&
            data?.employees?.map((item) => (
              <div className={css.tableRow} key={item.id}>
                <div className={css.item}>
                  {truncateText(item.user.name, 12)}
                </div>
                <div className={css.item}>
                  {truncateText(item.user.email, isSmallDevice ? 15 : 24)}
                </div>
                <div className={css.item}>
                  {truncateText(
                    item.user.phone_number,
                    isSmallDevice ? 15 : 24
                  )}
                </div>
                <div className={css.action}>
                  <div
                    className={`${css.stats} shadow-lg border cursor-pointer`}
                  >
                    <IoStatsChart />
                  </div>
                  <div className="w-[30px] h-[2px] rotate-90 bg-[#AFACAC]"></div>
                  <Tooltip title="Delete Record">
                    <div
                      className={css.delete}
                      onClick={() => {
                        setSelectedEmployeeId(item.id);
                        onOpen();
                      }}
                    >
                      <FaRegTrashAlt className="text-red-400" />
                    </div>
                  </Tooltip>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Delete Service Modal  */}
      <DeleteEmployeeModal
        employeeId={selectedEmployeeId}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default Employees;
