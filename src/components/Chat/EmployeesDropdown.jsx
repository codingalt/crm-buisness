import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import Avvvatars from "avvvatars-react";

const EmployeesDropdown = ({ users, isLoading, setSelected }) => {

  const handleSelectionChange = (e) => {
    setSelected(e.target.value);
  };

  return (
    <Select
      items={users}
      label="Assigned chat to"
      placeholder="Select a user"
      labelPlacement="outside"
      className="max-w-md"
      isLoading={isLoading}
      dir="ltr"
      radius="sm"
      onChange={handleSelectionChange}
    >
      {(user) => (
        <SelectItem key={user.id} textValue={user.user.name}>
          <div className="flex gap-2 items-center">
            <Avvvatars size={40} value={user.user.name} className="flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-small">{user.user.name}</span>
              <span className="text-tiny text-default-400">
                {user.user.email}
              </span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};

export default EmployeesDropdown;
