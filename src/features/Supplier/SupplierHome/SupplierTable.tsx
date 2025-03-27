import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomiseColmn from "../../../Components/CustomiseColum";
import SearchBar from "../../../Components/SearchBar";
import Print from "../../sales/salesOrder/Print";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";
import NoDataFoundTable from "../../../Components/skeleton/Table/NoDataFoundTable";
import Eye from "../../../assets/icons/Eye";
import PencilEdit from "../../../assets/icons/PencilEdit";
import EditSupplier from "./EditSupplier"; // Import the EditSupplier component
import { SupplierData } from "../../../Types/Supplier";
import TrashCan from "../../../assets/icons/TrashCan";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import toast from "react-hot-toast";
import ConfirmModal from "../../../Components/ConfirmModal";
import { useReactToPrint } from "react-to-print";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}
interface Supplier {
  _id: string;
  billingAttention: string;
  companyName: string;
  mobile: string;
  supplierEmail: string;
  skypeNameNumber?: string;
  billingPhone: string;
  billingCity: string;
  status: string;
  supplierDisplayName: string;
  [key: string]: any;
}

interface SupplierTableProps {
  supplierData: Supplier[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  loading: any;
  refreshSuppliers: () => void;
}

const SupplierTable = ({
  supplierData,
  searchValue,
  setSearchValue,
  loading,
  refreshSuppliers,
}: SupplierTableProps) => {
  const initialColumns: Column[] = [
    { id: "supplierDisplayName", label: "Name", visible: true },
    { id: "companyName", label: "Company Name", visible: true },
    { id: "mobile", label: "Mobile", visible: true },
    { id: "supplierEmail", label: "Email", visible: true },
    { id: "billingPhone", label: "Billing Phone", visible: true },
    { id: "billingCity", label: "Billing City", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "payables", label: "Payables(BCY)", visible: false },
    { id: "unused", label: "Unused Credit(BCY)", visible: false },
    { id: "supplierDetails", label: "Supplier details", visible: true },

  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierData | null>(
    null
  );

  const navigate = useNavigate();

  const handleView = (id: string) => {
    navigate(`/supplier/view/${id}`);
  };

  const handleEdit = (supplier: SupplierData) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  const filteredAccounts = supplierData.filter((account) => {
    const searchValueLower = searchValue.toLowerCase();
    return (
      account?.supplierDisplayName?.toLowerCase().includes(searchValueLower) ||
      account?.companyName?.toLowerCase().includes(searchValueLower) ||
      account?.mobile?.toLowerCase().includes(searchValueLower) ||
      account?.supplierEmail?.toLowerCase().includes(searchValueLower)
    );
  });

  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { request: deleteCustomer } = useApi("delete", 7009);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const url = `${endponits.DELETE_SUPPLIER}/${deleteId}`;
      const { response, error } = await deleteCustomer(url);
      if (!error && response) {
        toast.success(response.data.message);
        refreshSuppliers()
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting.");
    } finally {
      setConfirmModalOpen(false);
      setDeleteId(null);
    }
  };

  const renderColumnContent = (colId: string, item: SupplierData) => {
    if (colId === "supplierDetails") {
      return (
        <div className="flex justify-center items-center gap-3">
          <div onClick={() => handleView(item._id)} className="cursor-pointer">
            <Eye color={"#569FBC"} />
          </div>
          <div onClick={() => handleEdit(item)} className="cursor-pointer">
            <PencilEdit color={"#0B9C56"} />
          </div>
          <div onClick={() => confirmDelete(item._id)}>
            <TrashCan color="red" />
          </div>
        </div>
      );
    }

    if (colId === "status") {
      const statusStyles =
        item.status === "Active" ? "bg-[#78AA86]" : "bg-zinc-400";

      return (
        <p
          className={`${statusStyles} text-[13px] rounded text-white h-[18px] flex items-center justify-center`}
        >
          {item.status}
        </p>
      );
    }

    const columnValue = item[colId as keyof SupplierData];
    return columnValue ? (
      <span>{columnValue as string}</span>
    ) : (
      <span className="text-gray-500 italic">-</span>
    );
  };

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="w-full">
          <SearchBar
            placeholder="Search"
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        </div>
        <div className="flex gap-4" onClick={() => reactToPrintFn()}>
          <Print />
        </div>
      </div>
      <div ref={contentRef} className="mt-3 overflow-y-scroll max-h-[25rem] hide-scrollbar">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">Sl.No</th>
              {columns.map(
                (col) =>
                  col.visible && (
                    <th
                    key={col.id}
                    className={`py-2 px-4 font-medium border-b border-tableBorder ${col.id === "supplierDetails" ? "hide-print" : ""}`}
                  >
                      {col.label}
                    </th>
                  )
              )}
              <th className="py-2 px-4 font-medium border-b border-tableBorder relative hide-print">
                <CustomiseColmn
                  columns={columns}
                  setColumns={setColumns}
                  tableId={"supplier"}
                />
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {loading.skelton ? (
              [...Array(filteredAccounts.length || 5)].map((_, idx) => (
                <TableSkelton key={idx} columns={columns} />
              ))
            ) : filteredAccounts && filteredAccounts.length > 0 ? (
              filteredAccounts.reverse().map((item, index) => (
                <tr key={item._id} className="relative">
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {index + 1}
                  </td>
                  {columns.map(
                    (col) =>
                      col.visible && (
                        <td
                        key={col.id}
                        className={`py-2.5 px-4 border-y border-tableBorder ${col.id === "supplierDetails" ? "hide-print" : ""}`}
                      >
                          {renderColumnContent(col.id, item as any)}
                        </td>
                      )
                  )}
                  <td className="py-2.5 px-4 border-y border-tableBorder hide-print"></td>
                </tr>
              ))
            ) : (
              <NoDataFoundTable columns={columns} />
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete?"
      />

      {/* Edit Supplier Modal */}
      {isModalOpen && selectedSupplier && (
        <EditSupplier
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          supplier={selectedSupplier}
        />
      )}
    </div>
  );
};

export default SupplierTable;
