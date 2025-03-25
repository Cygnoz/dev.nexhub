import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowDownIcon from "../../../assets/icons/ArrowDownIcon";
import ArrowUpIcon from "../../../assets/icons/ArrowUpIcon";
import PlusCircle from "../../../assets/icons/PlusCircle";
import RefreshIcon from "../../../assets/icons/RefreshIcon";
import Button from "../../../Components/Button";
// import BillsType from "./BillsType";
import Table from "./Table";
import SacnIcon from "../../../assets/icons/SacnIcon";

type Props = {};

function BillsHomes({}: Props) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownItems = [
    {
      icon: <ArrowDownIcon />,
      text: "Import Bill",
      onClick: () => {
        console.log("Import Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Bill",
      onClick: () => {
        console.log("Export Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Current View",
      onClick: () => {
        console.log("Export Current View clicked");
      },
    },
    {
      icon: <RefreshIcon color="#4B5C79" />,
      text: "Refresh List",
      onClick: () => {
        console.log("Refresh List clicked");
      },
    },
  ];
  return (
    <>
      <div className="px-6 sm:flex   items-center relative">
        <div>
          <h3 className="font-bold text-2xl text-textColor">Bills</h3>
          <p className="text-sm text-gray mt-1">
          Comprehensive invoicing that includes purchase details such as order date, supplier name, total amounts due for clear and accurate financial tracking
          </p>
        </div>
        <div className="ml-auto gap-3 flex items-center">
        <Button
            onClick={() => navigate("/purchase/bills/invoice")}
            variant="secondary"
            size="sm"
          >
            <SacnIcon/>
            <p className="text-sm font-medium">Scan Invoice</p>
          </Button>

          <Button
            onClick={() => navigate("/purchase/bills/new")}
            variant="primary"
            size="sm"
          >
            <PlusCircle color="white" />
            <p className="text-sm font-medium">New Bill</p>
          </Button>

          <div onClick={toggleDropdown} className="cursor-pointer">
            {/* <Ellipsis /> */}
          </div>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-16 right-4 mt-2 w-48 bg-white shadow-xl z-10"
            >
              <ul className="py-1 text-dropdownText">
                {dropdownItems.map((item, index) => (
                  <li
                    key={index}
                    onClick={item.onClick}
                    className="px-4 py-2 flex items-center gap-2 hover:bg-orange-100 rounded-md text-sm cursor-pointer"
                  >
                    {item.icon}
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 mt-3">
        <div className="bg-white p-5">
          <div className="w-[100%] p-3 bg-gray-100">
            {/* <BillsType /> */}
          </div>
         
          <div className="p-3">
            {/* table */}
            <Table />
          </div>
        </div>
      </div>
    </>
  );
}

export default BillsHomes;
