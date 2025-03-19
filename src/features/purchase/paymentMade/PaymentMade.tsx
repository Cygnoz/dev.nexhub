import { useEffect, useRef, useState } from "react";
import ArrowDownIcon from "../../../assets/icons/ArrowDownIcon";
import ArrowUpIcon from "../../../assets/icons/ArrowUpIcon";
import PlusCircle from "../../../assets/icons/PlusCircle";
import RefreshIcon from "../../../assets/icons/RefreshIcon";
import Button from "../../../Components/Button";
import Table from "./Table";
import { Link } from "react-router-dom";

type Props = {};

const PaymentMade = ({}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

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
      text: "Import Payment",
      onClick: () => {
        console.log("Import Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Payment",
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
      <div className="px-6 flex   items-center relative">
        <div>
          <h3 className="font-bold text-2xl text-textColor">Payment</h3>
          <p className="text-sm text-gray mt-1">
          Comprehensive invoicing that includes purchase details such as order date, supplier name, total amounts due for clear and accurate financial tracking
          </p>
        </div>
        <div className="ml-auto gap-3 flex items-center">
        <Link to={"/purchase/payment-made/new-payment-made"}>
          <Button variant="primary" size="sm">
            <PlusCircle color="white" />
            <p className="text-sm font-medium">New Payment</p>
          </Button></Link>

          {/* <div onClick={toggleDropdown} className="cursor-pointer">
            <Ellipsis />
          </div> */}

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
            {/* <PaymentsType /> */}
          </div>
         
          <div className="p-3">
            {/* table */}
            <Table />
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentMade;
