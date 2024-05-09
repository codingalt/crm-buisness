import React from "react";
import css from "./Employees.module.scss";
import { FaPlus } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { useGetEmployeesQuery } from "../../services/api/employeesApi/employeesApi";
import { ClipLoader } from "react-spinners";
import empty from "../../assets/empty.png"
import { Image } from "@nextui-org/react";

const Employees = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetEmployeesQuery();

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
      <div className={`${css.employeesTable} w-full mx-auto my-5 h-14`}>
        {/* Table Header  */}
        <div className={css.tableHeader}>
          <div className={css.item}>Employee Name</div>
          <div className={css.item}>Employee Contact</div>
          <div className={css.item}>Role</div>
          <div className={css.item}>Action</div>
        </div>

        {/* Loader  */}
        {isLoading && (
          <div className="w-full h-[400px] flex items-center justify-center">
            <ClipLoader color="#01AB8E" size={44} speedMultiplier={0.85} />
          </div>
        )}

        {/* No Data Message  */}
        {
         !isLoading && data?.employees?.length === 0 && (
            <div className="w-full h-[400px] flex flex-col gap-0 items-center justify-center">
              <Image src={empty} alt="" width={170} />
              <p className="font-medium text-blue-600">No Record Found!</p>
            </div>
          )
        }

        {/* Table Body  */}
        <div className={css.tableBody}>
          {!isLoading &&
            data?.employees?.map((item) => (
              <div className={css.tableRow} key={item.id}>
                <p>{item.name}</p>
                <p>{item.contact}</p>
                <p>{item.role}</p>
                <div className={css.action}>
                  <div
                    className={`${css.stats} shadow-lg border cursor-pointer`}
                  >
                    <IoStatsChart />
                  </div>
                  <div className="w-[30px] h-[2px] rotate-90 bg-[#AFACAC]"></div>
                  <div className={css.delete}>
                    <FaRegTrashAlt />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Employees;
