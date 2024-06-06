import React from "react";
import css from "./Services.module.scss";
import Card from "./Card";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useGetServicesQuery } from "../../services/api/servicesApi/servicesApi";
import { ClipLoader } from "react-spinners";
import empty from "../../assets/empty.png";
import { Image } from "@nextui-org/react";

const Services = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetServicesQuery();

  return (
    <div className={css.services}>
      <div className={css.headingTop}>
        <h1>Services and prices</h1>
        <div className={css.bottom}>
          <p className="hidden md:block">Existing Services</p>
          <button type="button" onClick={() => navigate("/newService")}>
            <FaPlus /> <span>Add service</span>
          </button>
        </div>
      </div>

      {/* Loader  */}
      {isLoading && (
        <div className="w-full h-[60%] flex items-center justify-center">
          <ClipLoader color="#01AB8E" size={44} speedMultiplier={0.85} />
        </div>
      )}

      {/* No Data Message  */}
      {!isLoading && data?.employees?.length === 0 && (
        <div className="w-full h-[60%] flex flex-col gap-0 items-center justify-center">
          <Image src={empty} alt="" width={170} />
          <p className="font-medium text-blue-600">No Record Found!</p>
        </div>
      )}

      {/* Services Cards  */}
      <div
        className={`${css.cards} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 gap-y-7`}
      >
        {!isLoading &&
          data?.services?.map((item) => <Card key={item.id} item={item} />)}
      </div>
    </div>
  );
};

export default Services;
