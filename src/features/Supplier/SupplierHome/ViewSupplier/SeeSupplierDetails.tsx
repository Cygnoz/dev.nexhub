import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import ArrowRightLeft from "../../../../assets/icons/ArrowRightLeft";
import CheveronLeftIcon from "../../../../assets/icons/CheveronLeftIcon";
// import Info from "../../../../assets/icons/Info";
import {
  SupplierDetailsContext,
  SupplierResponseContext,
} from "../../../../context/ContextShare";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import { SupplierData } from "../../../../Types/Supplier";
import Overview from "./Overview";
import Transaction from "./Transaction";
import EditSupplier from "../EditSupplier";
import Button from "../../../../Components/Button";
import Pen from "../../../../assets/icons/Pen";
import toast from "react-hot-toast";
import ConfirmModal from "../../../../Components/ConfirmModal";
import TrashCan from "../../../../assets/icons/TrashCan";
import Info from "../../../../assets/icons/Info";
import ArrowRightLeft from "../../../../assets/icons/ArrowRightLeft";

type Props = {};

interface Status {
  status: string;
}

function SeeSupplierDetails({}: Props) {
  const { setSupplierDetails } = useContext(SupplierDetailsContext)!;

  const { request: getOneSupplier } = useApi("get", 5009);
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [tabSwitch,setTabSwitch] = useState<string>("overview");
  const { supplierResponse } = useContext(SupplierResponseContext)!;
  const [statusData, setStatusData] = useState<Status>({ status: "" });
  const { request: deleteData } = useApi("delete", 5009);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const confirmDelete = () => {
    setConfirmModalOpen(true);
  };
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false); // Define modal state

  const openModal = () => setIsModalOpen(true); // Function to open modal
  const closeModal = () => setIsModalOpen(false); // Function to close modal

  const getOneSupplierData = async () => {
    if (!id) return;
    try {
      const url = `${endponits.GET_ONE_SUPPLIER}/${id}`;
      const body = { organizationId: "INDORG0001" };
      const { response, error } = await getOneSupplier(url, body);
      if (!error && response) {
        setSupplier(response.data);
        setSupplierDetails(response.data);
        // setStatusData((prevData) => ({
        //   ...prevData,
        //   status: response.data.status,
        // }));
      }
    } catch (error) {
      console.error("Error fetching supplier:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getOneSupplierData();
    }
  }, [id, supplierResponse]);

  useEffect(() => {
    if (supplier) {
      setStatusData({ status: supplier.status });
    }
  }, [supplier]);

  const handleTabSwitch = (tabName: string) => {
    setTabSwitch(tabName);
  };

  const handleDelete = async () => {
    try {
      let url = `${endponits.DELETE_SUPPLIER}/${id}`;
      if (!url) return;
      const { response, error } = await deleteData(url);
      if (!error && response) {
        toast.success(response.data.message);
        setConfirmModalOpen(false);
        setTimeout(() => {
          navigate("/supplier/home");
        }, 1000);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error("Error in deleting item:", error);
    }
  };

  return (
    <div className="px-6">
      <div className="bg-white shadow-md rounded-lg p-6 flex-row sm:flex items-center justify-between">
        {/* Left Section */}
        <div className="flex gap-5 items-center">
          <Link to="/supplier/home">
            <div
              style={{ borderRadius: "50%" }}
              className="w-[40px] h-[40px] flex items-center justify-center bg-[#F6F6F6]"
            >
              <CheveronLeftIcon />
            </div>
          </Link>
          <p className="text-textColor text-xl font-bold">Office Vendors</p>
        </div>

        {/* Right Section */}
        <div className="flex gap-4">
          <Button
            onClick={openModal}
            variant="secondary"
            className="h-[26px] w-[68px] text-[12px] flex items-center justify-center"
          >
            <Pen size={14} color="#565148" />{" "}
            <p className="text-sm font-medium">Edit</p>
          </Button>
          <EditSupplier
            isModalOpen={isModalOpen}
            openModal={openModal}
            closeModal={closeModal}
            supplier={supplier}
          />
          <Button
            onClick={confirmDelete}
            variant="secondary"
            className="h-[26px] w-[68px] text-[12px] flex items-center justify-center"
          >
            <TrashCan color="#565148" />{" "}
            <p className="text-sm font-medium">Delete</p>
          </Button>
        </div>
      </div>

      <div className=" bg-white h-auto rounded-md text-textColor  px-2 mt-5 p-2">
        <div className="flex items-center w-full gap-2">
          <div
            onClick={() => handleTabSwitch("overview")}
            className={`text-[14px] font-semibold ${tabSwitch === "overview" ? "bg-[#F7E7CE]" : ""} w-[187px] py-2 justify-center flex gap-2 items-center rounded-[8px] cursor-pointer`}
          >
            <Info color="#303F58" size={20} /> Overview
          </div>

          <div
            onClick={() => handleTabSwitch("transaction")}
            className={`text-[14px] font-semibold ${tabSwitch === "transaction" ? "bg-[#F7E7CE]" : ""} w-[187px] py-2 justify-center flex gap-2 items-center rounded-[8px] cursor-pointer`}
          >
            <ArrowRightLeft size={20} color="#303F58" /> Transaction
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white h-auto rounded-md text-textColor p-5 space-y-4 mt-5">
        {tabSwitch === "overview" && (
          <Overview
            supplier={supplier}
            statusData={statusData}
            setStatusData={setStatusData}
          />
        )}
        {tabSwitch === "transaction" && <Transaction supplierId={id}  />}
      </div>
      <ConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete?"
      />
    </div>
  );
}

export default SeeSupplierDetails;
