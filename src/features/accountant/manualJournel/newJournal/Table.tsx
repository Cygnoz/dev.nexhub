import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../../Components/SearchBar";
import NoDataFoundTable from "../../../../Components/skeleton/Table/NoDataFoundTable";
import TableSkelton from "../../../../Components/skeleton/Table/TableSkelton";
import { TableResponseContext } from "../../../../context/ContextShare";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import PencilEdit from "../../../../assets/icons/PencilEdit";
import Eye from "../../../../assets/icons/Eye";
import TrashCan from "../../../../assets/icons/TrashCan";
import ConfirmModal from "../../../../Components/ConfirmModal";
import toast from "react-hot-toast";
import Print from "../../../sales/salesOrder/Print";
import { useReactToPrint } from "react-to-print";

interface Journal {
  _id: string;
  date: string;
  journalId: string;
  reference: string;
  note: string;
  status: string;
  totalDebitAmount: string;
}

type Props = {};

function Table({ }: Props) {
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const [journalData, setJournalData] = useState<Journal[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setConfirmModalOpen(true);
  };

  const { request: AllJournals } = useApi("get", 7001);
  const { request: deleteJournal } = useApi("delete", 7001);

  const tableHeaders = [
    "Date",
    "Journal",
    "Reference#",
    "Notes",
    "Amount",
    "Actions",
    // "",
  ];

  const getAllJournals = async () => {
    try {
      const url = `${endponits.GET_ALL_JOURNALS}`;
      setLoading({ ...loading, skeleton: true });
      const { response, error } = await AllJournals(url);

      if (error || !response) {
        setLoading({ ...loading, skeleton: false, noDataFound: true });
        return;
      }
      setJournalData(response.data);
      setLoading({ ...loading, skeleton: false });
    } catch (error) {
      console.error("Something went wrong:", error);
      setLoading({ ...loading, noDataFound: true, skelton: false });
    }
  };

  useEffect(() => {
    getAllJournals();
  }, []);

  const filteredJournals = journalData.filter((journal) => {
    const searchValueLower = searchValue.toLowerCase().trim();

    return (
      journal.journalId
        ?.toString()
        .toLowerCase()
        .startsWith(searchValueLower) || false
    );
  });

  const handleEditClick = (id: any) => {
    navigate(`/accountant/editjournal/${id}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const url = `${endponits.DELET_JOURNAL}/${deleteId}`;
      const { response, error } = await deleteJournal(url);

      if (!error && response) {
        toast.success(response.data.message);
        if (journalData.length === 1) {
          setJournalData([]);
          setLoading({ ...loading, skeleton: false, noDataFound: true });
        } else {
          setJournalData((prevData) =>
            prevData.filter((journal) => journal._id !== deleteId)
          );
        }
        await getAllJournals();
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting the journal.");
    } finally {
      setConfirmModalOpen(false);
      setDeleteId(null);
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="overflow-x-auto my-1">
      <div className="flex items-center justify-between gap-4 mb-3">
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
      <div ref={contentRef} className="min-h-[25rem] overflow-y-auto mt-1">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">Sl No</th>
              {tableHeaders.map((heading, index) => (
                <th
                  className={`py-2 px-4 font-medium border-b border-tableBorder ${heading === "Actions" ? "hide-print" : ""}`}
                  key={index}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-dropdownText text-center text-[13px]">
            {loading.skeleton ? (
              [
                ...Array(filteredJournals.length ? filteredJournals.length : 5),
              ].map((_, idx) => (
                <TableSkelton key={idx} columns={[...tableHeaders, "rr"]} />
              ))
            ) : filteredJournals.length > 0 ? (
              filteredJournals.reverse().map((item, index) => (
                // Render actual data rows here
                <tr key={item._id} className="relative">
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {index + 1}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.date}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.journalId ? item.journalId : "-"}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.reference ? item.reference : "-"}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.note ? item.note : "-"}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.totalDebitAmount ? item.totalDebitAmount : "-"}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder gap-3 flex justify-center items-center hide-print">
                    <div onClick={() => handleEditClick(item._id)}>
                      <PencilEdit color={"#0B9C56"} className="cursor-pointer" />
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/accountant/manualjournal/view/${item._id}`)
                      }
                    >
                      <Eye color="#569FBC" className="cursor-pointer" />
                    </div>
                    <div onClick={() => confirmDelete(item._id)}>
                      <TrashCan color="red" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <NoDataFoundTable columns={[...tableHeaders, "rr"]} />
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
    </div>
  );
}

export default Table;
