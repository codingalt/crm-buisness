import React, { useState } from "react";
import css from "./Employees.module.scss";
import { FaPlus } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { useGetEmployeesQuery } from "../../services/api/employeesApi/employeesApi";
import { ClipLoader } from "react-spinners";
import empty from "../../assets/empty.png";
import { Image, useDisclosure } from "@nextui-org/react";
import { truncateText } from "@/utils/helpers/helpers";
import { useMediaQuery } from "@uidotdev/usehooks";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import { Tooltip } from "@mui/material";

const Employees = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetEmployeesQuery();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  return (
    <div className={`${css.wrapper} mx-auto`}>
      <div className={css.headingTop}>
        <h1>Workers Managment</h1>
        <div className={css.bottom}>
          <p>Employees</p>
          <button type="button" onClick={() => navigate("/addEmployee")}>
            <FaPlus /> <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Employees  */}
      <div
        className={`${css.employeesTable} max-w-screen-2xl w-full my-6 md:my-5 overflow-x-auto scrollbar-hide`}
      >
        {/* Table Header  */}
        <div className={css.tableHeader}>
          <div className={css.item}>Employee Name</div>
          <div className={css.item}>Employee Email</div>
          <div className={css.item}>Employee Contact</div>
          <div className={css.item}>Action</div>
        </div>

        {/* Loader  */}
        {isLoading && (
          <div className="w-full h-[360px] flex items-center justify-center">
            <ClipLoader color="#01AB8E" size={44} speedMultiplier={0.85} />
          </div>
        )}

        {/* No Data Message  */}
        {!isLoading && data?.employees?.length === 0 && (
          <div className="w-full h-[400px] flex flex-col gap-0 items-center justify-center">
            <Image src={empty} alt="" width={170} />
            <p className="font-medium text-[#01ab8e]">No Record Found!</p>
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
