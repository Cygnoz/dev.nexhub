import { useContext, useRef, useState } from "react";
import TableSkelton from "../../../../Components/skeleton/Table/TableSkelton";
import SearchBar from "../../../../Components/SearchBar";
import NoDataFoundTable from "../../../../Components/skeleton/Table/NoDataFoundTable";
import CustomiseColmn from "../../../../Components/CustomiseColum";
import Pagination from "../../../../Components/Pagination/Pagination";
import Eye from "../../../../assets/icons/Eye";
import Trash2 from "../../../../assets/icons/Trash2"; // Include Trash Icon
import Pen from "../../../../assets/icons/Pen";
import useApi from "../../../../Hooks/useApi";
import toast from "react-hot-toast";
import { PurchaseContext } from "../../../../context/ContextShare";
import ConfirmModal from "../../../../Components/ConfirmModal";
import Print from "../../../sales/salesOrder/Print";
import { useReactToPrint } from "react-to-print";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (id: string) => void;
  onDelete?: (id: string) => void;
  renderColumnContent?: (colId: string, item: any) => JSX.Element;
  searchPlaceholder: string;
  loading: boolean;
  searchableFields: string[];
  setColumns?: any;
  page?: any;
  onEditClick?: (id: string) => void;
  deleteUrl?: string;
  fetchUrl?: string;
  fetchData?: any;
}

const PurchaseTable: React.FC<TableProps> = ({
  page,
  columns,
  data,
  onRowClick,
  renderColumnContent,
  searchPlaceholder,
  loading,
  searchableFields,
  setColumns,
  onEditClick,
  deleteUrl,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { request: deleteData } = useApi("delete", 7005);
  const { request: ocrDelete } = useApi("delete", 5000);
  const { setPurchaseResponse } = useContext(PurchaseContext)!;
  const rowsPerPage = 10;
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setConfirmModalOpen(true);
  };
  const filteredData = Array.isArray(data)
    ? data
        .slice()
        .reverse()
        .filter((item) => {
          return searchableFields
            .map((field) => item[field]?.toString().trim().toLowerCase())
            .some((fieldValue) =>
              fieldValue?.includes(searchValue.toLowerCase().trim())
            );
        })
    : [];

  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const visibleColumns = columns.filter((col) => col.visible);
  const skeletonColumns = [...visibleColumns, {}, {}, {}];

  const handleDelete = async () => {
    try {
      const url = `${deleteUrl}/${deleteId}`;
      const apiFunction = page === "OCR" ? ocrDelete : deleteData;
      const { response, error } = await apiFunction(url);
      if (!error && response) {
        console.log(response);
        if (page === "OCR") {
          toast.success(response?.data[0]?.message);
          setConfirmModalOpen(false);
        } else {
          toast.success(response?.data?.message);
          setConfirmModalOpen(false);
        }
        setPurchaseResponse((prevData: any) => {
          const updatedData = prevData?.data?.filter(
            (item: any) => item._id !== deleteId
          );
          return {
            ...prevData,
            data: updatedData,
          };
        });
      } else {
        console.log(error.response);
        if (page === "OCR") {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(error?.response?.data?.message);
        }
      }
    } catch (error) {
      console.error("Error in deleting item:", error);
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      <div className="flex items-center gap-4 justify-between">
        <SearchBar
          placeholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={(value) => {
            setSearchValue(value);
            setCurrentPage(1);
          }}
        />
        <div onClick={() => reactToPrintFn()}>
          <Print />
        </div>
      </div>

      <div
        ref={contentRef}
        className="overflow-x-auto mt-3 hide-scrollbar overflow-y-scroll max-h-[25rem]"
      >
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">Sl.No.</th>
              {columns?.map(
                (col) =>
                  col.visible && (
                    <th
                      key={col.id}
                      className="py-2 px-4 font-medium border-b border-tableBorder"
                    >
                      {col.label}
                    </th>
                  )
              )}
              <th className="py-3 px-2 font-medium border-b border-tableBorder hide-print">
                Action
              </th>
              <th className="py-3 px-2 font-medium border-b border-tableBorder hide-print">
                <CustomiseColmn
                  columns={columns}
                  setColumns={setColumns}
                  tableId={`${page}`}
                />
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {loading ? (
              [...Array(rowsPerPage)].map((_, idx) => (
                <TableSkelton key={idx} columns={skeletonColumns} />
              ))
            ) : paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr key={item.id} className="relative cursor-pointer">
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {(currentPage - 1) * rowsPerPage + rowIndex + 1}
                  </td>
                  {columns.map(
                    (col) =>
                      col.visible && (
                        <td
                          key={col.id}
                          className="py-2.5 px-4 border-y border-tableBorder text-center"
                        >
                          {renderColumnContent
                            ? renderColumnContent(col.id, item) || "-"
                            : item[col.id] !== undefined &&
                              item[col.id] !== null
                            ? item[col.id]
                            : "-"}
                        </td>
                      )
                  )}
                  <td className="py-3 px-4 border-b border-tableBorder flex items-center justify-center gap-2 hide-print">
                  { page!=="OCR" && <button
                      onClick={() => onEditClick && onEditClick(item._id)}
                    >
                      <Pen color={"green"} size={18} />
                    </button>}
                    <button onClick={() => onRowClick && onRowClick(item._id)}>
                      <Eye color={"#569FBC"} />
                    </button>
                    <button onClick={() => confirmDelete(item._id)}>
                      <Trash2 color="#EA1E4F" size={18} />
                    </button>
                  </td>

                  <td className="py-3 px-4 border-b border-tableBorder hide-print"></td>
                </tr>
              ))
            ) : (
              <NoDataFoundTable columns={skeletonColumns} />
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete?"
      />
    </div>
  );
};

export default PurchaseTable;
