import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import Avvvatars from "avvvatars-react";
import { useTranslation } from "react-i18next";

const EmployeesDropdown = ({ users, isLoading, setSelected }) => {  
  const {t} = useTranslation();
  const handleSelectionChange = (e) => {
    setSelected(e.target.value);
  };

  return (
    <Select
      items={users}
      label={t("assignChatTo")}
      placeholder={t("selectUser")}
      labelPlacement="outside"
      className="max-w-md"
      isLoading={isLoading}
      error
      dir="ltr"
      radius="sm"
      onChange={handleSelectionChange}
    >
      {!users ? (
        <SelectItem textValue={"Error fetching Employees. Try again"}>
          <div className="flex gap-2 items-center">
            <span>Error fetching data. Try again</span>
          </div>
        </SelectItem>
      ) : (
        (user) => (
          <SelectItem key={user?.id} textValue={user?.user?.name}>
            <div className="flex gap-2 items-center">
              <Avvvatars
                size={40}
                value={user?.user?.name}
                className="flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-small">{user?.user?.name}</span>
                <span className="text-tiny text-default-400">
                  {user?.user?.email}
                </span>
              </div>
            </div>
          </SelectItem>
        )
      )}
    </Select>
  );
};

export default EmployeesDropdown;
