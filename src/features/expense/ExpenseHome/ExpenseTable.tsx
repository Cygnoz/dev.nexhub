import { useContext, useState, useEffect, useRef } from "react";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";
import SearchBar from "../../../Components/SearchBar";
import NoDataFoundTable from "../../../Components/skeleton/Table/NoDataFoundTable";
import CustomiseColumn from "../../../Components/CustomiseColum";
import PrintButton from "../../../Components/PrintButton";
import Pagination from "../../../Components/Pagination/Pagination";
import Eye from "../../../assets/icons/Eye";
// import Pen from "../../../assets/icons/Pen";
// import Trash2 from "../../../assets/icons/Trash2";
import { TableResponseContext } from "../../../context/ContextShare";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import { useNavigate } from "react-router-dom";
import PencilEdit from "../../../assets/icons/PencilEdit";
import TrashCan from "../../../assets/icons/TrashCan";
import ConfirmModal from "../../../Components/ConfirmModal";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";

const ExpenseTable = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allExpense, setAllExpense] = useState<any[]>([]);
  const { request: getExpense } = useApi("get", 7008);
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const navigate = useNavigate();
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setConfirmModalOpen(true);
  };

  const rowsPerPage = 10;

  const [columns, setColumns] = useState([
    { id: "expenseDate", label: "Date", visible: true },
    { id: "expense.expenseAccountName", label: "Name", visible: true },
    { id: "expenseNumber", label: "Expense", visible: true },
    { id: "expenseCategory", label: "Category", visible: true },
    { id: "supplierDisplayName", label: "Vendor Name", visible: true },
    { id: "paidThroughAccountName", label: "Paid Through", visible: true },
    { id: "grandTotal", label: "Amount", visible: true },
  ]);

  const filteredData = allExpense.reverse()?.filter((account) => {
    const searchValueLower = searchValue.toLowerCase().trim();
    return (
      account?.expenseAccount
        ?.toLowerCase()
        ?.trim()
        ?.startsWith(searchValueLower) ||
      account?.expenseCategory
        ?.toLowerCase()
        ?.trim()
        ?.startsWith(searchValueLower) ||
      account?.expenseDate
        ?.toLowerCase()
        ?.trim()
        ?.startsWith(searchValueLower) ||
      account?.supplierDisplayName
        ?.toLowerCase()
        ?.trim()
        ?.startsWith(searchValueLower)
    );
  });

  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const visibleColumns = columns?.filter((col: any) => col.visible);
  const skeletonColumns = [...visibleColumns, {}, {}, {}];

  const getAllExpenses = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });

      const url = `${endponits.GET_ALL_EXPENSE}`;
      const { response, error } = await getExpense(url);

      if (!error && response) {
        console.log("Fetched Expenses:", response.data);
        setAllExpense(response.data);
        setLoading({ ...loading, skeleton: false, noDataFound: false });
      } else {
        console.log("Error fetching data:", error);
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.error("API call error:", error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getAllExpenses();
  }, []);

  const renderColumnContent = (colId: string, item: any) => {
    const keys = colId.split(".");

    let columnValue = keys.reduce((current: any, key: string) => {
      return current ? current[key] : undefined;
    }, item);

    if (keys[0] === "expense" && Array.isArray(item.expense)) {
      columnValue = item.expense.map((expense: any, index: number) => (
        <div key={index} className="flex flex-col">
          <span>{expense[keys[1]] || "-"}</span>
        </div>
      ));
    }

    return columnValue || <span className="text-gray-500 italic">-</span>;
  };

  const handleEditClick = (id: any) => {
    navigate(`/expense/edit-expense/${id}`);
  };
  const { request: deleteExpense } = useApi("delete", 7008);
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const url = `${endponits.DELETE_EXPENSE}/${deleteId}`;
      const { response, error } = await deleteExpense(url);
      if (!error && response) {
        toast.success(response.data.message);
        getAllExpenses();
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

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      <div className="flex items-center gap-4 justify-between">
        <SearchBar
          placeholder="Search Expense"
          searchValue={searchValue}
          onSearchChange={(value) => {
            setSearchValue(value);
            setCurrentPage(1);
          }}
        />
        <div onClick={() => reactToPrintFn()}>
          <PrintButton />
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
                (col: any) =>
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
                <CustomiseColumn
                  columns={columns}
                  setColumns={setColumns}
                  tableId={"expense"}
                />
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {loading?.skeleton ? (
              [...Array(rowsPerPage)].map((_, idx) => (
                <TableSkelton key={idx} columns={skeletonColumns} />
              ))
            ) : paginatedData && paginatedData?.length > 0 ? (
              paginatedData?.map((item: any, rowIndex: number) => (
                <tr
                  key={item.id}
                  className="relative cursor-pointer  border-y border-tableBorder"
                >
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
                          {renderColumnContent(col.id, item)}
                        </td>
                      )
                  )}
                  <td className=" py-2.5 hide-print ">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEditClick(item._id)}>
                        <PencilEdit
                          color={"#0B9C56"}
                          className="cursor-pointer"
                        />
                      </button>
                      <button
                        onClick={() => navigate(`/expense/view/${item._id}`)}
                      >
                        <Eye color="#569FBC" className="cursor-pointer" />
                      </button>
                      <button onClick={() => confirmDelete(item._id)}>
                        <TrashCan color="red" />
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4 border-b border-tableBorder"></td>
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

export default ExpenseTable;
