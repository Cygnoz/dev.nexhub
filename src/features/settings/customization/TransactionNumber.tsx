import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Ellipsis from "../../../assets/icons/Ellipsis";
import Pen from "../../../assets/icons/Pen";
import PlusCircle from "../../../assets/icons/PlusCircle";
import StarYellow from "../../../assets/icons/StarYellow";
import TrashCan from "../../../assets/icons/TrashCan";
import bgImage from "../../../assets/Images/14.png";
import Button from "../../../Components/Button";
import MenuDropdown from "../../../Components/menu/MenuDropdown";
import Modal from "../../../Components/model/Modal";
import SearchBar from "../../../Components/SearchBar";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import Banner from "../banner/Banner";
import CustomiseColmn from "../../../Components/CustomiseColum";

// Define the data types
type Column = {
  id: string;
  label: string;
  visible: boolean;
};

type SeriesData = {
  seriesName: string;
  [key: string]: string; // Allow dynamic keys
};

type SeriesModalData = {
  module: string;
  prefix: string;
  startingNumber: string;
  preview: string;
};

function TransactionNumber() {
  const { request: GetPrefix } = useApi("get", 7004);
  const { request: AddPrefix } = useApi("post", 7004);
  const { request: EditPrefix } = useApi("put", 7004);
  const { request: StatusPrefix } = useApi("put", 7004);
  const { request: DeletePrefix } = useApi('delete', 7004)
  const modules = [
    "journal",
    "creditNote",
    "receipt",
    "purchaseOrder",
    "salesOrder",
    "payment",
    "bill",
    "debitNote",
    "invoice",
    "quote",
    "deliveryChallan",
    "expense",
  ];

  const initialColumns: Column[] = [
    { id: "seriesName", label: "Series Name", visible: true },
    ...modules.map((module) => ({
      id: module,
      label: module
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/^\w/, (c) => c.toUpperCase()),
      visible: true,
    })),
    { id: "actions", label: "Actions", visible: true },
  ];

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>(
    "New Transaction Number Series"
  );
  const [modalAction, setModalAction] = useState<string>("Add"); // "Add" or "Edit"
  const [editDatas, setEditDatas] = useState([]);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [data, setData] = useState<SeriesData[]>([]);
  const [modalData, setModalData] = useState<SeriesModalData[]>([]); // modalData could be populated based on the
  const [newSeriesData, setNewSeriesData] = useState({
    seriesName: "", // This could be a dynamic value based on user input
  });
  // requirement
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [search, setSearch] = useState<string>("");

  const openModal = (action: string, id?: any) => {
    if (action === "Edit" && id) {
      const editableData =
        editDatas?.find((item: any) => item.seriesId === id) || null;
      console.log("editable", editableData);
      setEditData(editableData || {}); // Set it directly, null is handled by the state type
      setModalTitle("Edit Transaction Number Series");
      setModalAction("Edit");
    } else {
      setModalTitle("New Transaction Number Series");
      setModalAction("Add");
    }
    setModalOpen(true);
  };


  const closeModal = () => {
    setModalOpen(false);
  };

  const addPrefixDatas = async (e: any) => {
    e.preventDefault();

    // Format the data to store prefix and number separately
    const formattedData = modalData.reduce((acc, item) => {
      acc[item.module] = item.prefix; // Store prefix separately
      acc[`${item.module}Num`] = item.startingNumber; // Store number separately
      return acc;
    }, {} as Record<string, string>);

    // Update the state with the new formatted data
    const updatedData = {
      ...newSeriesData,
      ...formattedData,
    };

    setNewSeriesData(updatedData);

    // Now that the state is updated, make the API call
    await makeApiCall(updatedData);
  };

  const makeApiCall = async (data: Record<string, string>) => {
    const emptyField = validateData(data);

    if (emptyField) {
      toast.error(`The field "${emptyField}" is empty. Please fill it out.`);
      return;
    }

    try {
      const url = `${endponits.ADD_PREFIX}`;
      const apiResponse = await AddPrefix(url, data);
      const { response, error } = apiResponse;
      if (!error && response) {
        toast.success(response.data.message);
        closeModal();
        getPrefixDatas();
      } else {
        toast.error(`${error.response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error during API call: ${error}`);
    }
  };

  const validateData = (data: Record<string, any>) => {
    for (const key in data) {
      const value = data[key];

      // Check for empty strings, null, undefined, or NaN (for numbers)
      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "") ||
        (typeof value === "number" && isNaN(value))
      ) {
        return key;
      }
    }
    return null;
  };

  const getPrefixDatas = async () => {
    try {
      const url = `${endponits.GET_PREFIX}`;
      const { response, error } = await GetPrefix(url);

      if (!error && response) {
        const data = response.data.prefix.series;
        console.log("Api data", response.data);

        // Initial data
        const initialData: SeriesData[] = data.map((item: any) => ({
          orgId: response.data.prefix.organizationId,
          _id: item._id, // Include _id in the initialData
          seriesName: item.seriesName,
          status: item.status, // Add status from item.status
          ...modules.reduce((acc, module) => {
            const prefix = item[module];
            const num = item[`${module}Num`];
            acc[module] = `${prefix}${num}`;
            return acc;
          }, {} as Record<string, string>),
        }));

        // Update state with fetched data
        setData(initialData);

        // Dynamically create the editDatas array
        const formattedData = data.map((item: any) => {
          // Define seriesData with organizationId
          const seriesData: Record<string, string | number> = {
            seriesName: item.seriesName || "",
            organizationId: response.data.prefix.organizationId || "", // Ensure organizationId is added here
            seriesId: item._id || "",
            status: item.status, // Add status from item.status
          };
          console.log("status", item.status);
          // Add all dynamic modules
          Object.keys(item).forEach((key) => {
            if (key !== "seriesName" && key !== "_id" && key !== "status") {
              seriesData[key] =
                item[key] || (typeof item[key] === "number" ? 0 : "");
            }
          });

          return seriesData;
        });

        // Update state with fetched and formatted data
        setEditDatas(formattedData);
      } else {
        toast.error(`API Error: ${error}`);
      }
    } catch (error) {
      toast.error(`Error fetching invoice settings: ${error}`);
    }
  };

  const editPrefixData = async (e: any) => {
    e.preventDefault();
    const emptyField = validateData(editData);

    if (emptyField) {
      toast.error(`The field "${emptyField}" is empty. Please fill it out.`);
      return;
    }
    try {
      const url = `${endponits.EDIT_PREFIX}`;
      const apiResponse = await EditPrefix(url, editData);
      const { response, error } = apiResponse;
      if (!error && response) {
        toast.success(response.data.message);
        closeModal();
        getPrefixDatas();
      } else {
        toast.error(`${error.response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error during API call: ${error}`);
    }
  };

  const handleDeletePrefix = async (sId: any) => {
    console.log("SId", sId);

    const seriesId = sId

    try {
      const url = `${endponits.DELETE_PREFIX}/${seriesId}`;
      const apiResponse = await DeletePrefix(url);
      const { response, error } = apiResponse;
      console.log("res", response);
      console.log("err", error);
      if (!error && response) {
        toast.success(response.data.message);
        getPrefixDatas();
      } else {
        toast.error(`${error.response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error during API call: ${error}`);
    }
  }

  useEffect(() => {
    getPrefixDatas();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const firstSeriesData = data[0];

      const constructedModalData = modules.map((module) => {
        const fullString = firstSeriesData[module] || "";
        const prefix = fullString.match(/^[^\d]+/)?.[0] || ""; // Extract non-digit prefix
        const startingNumber = fullString.match(/\d+$/)?.[0] || ""; // Extract digit suffix

        // No padding in preview
        const preview = `${prefix}${startingNumber}`;

        return {
          module,
          prefix,
          startingNumber,
          preview,
        };
      });

      setModalData(constructedModalData);
    }
  }, [data]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedData = [...modalData];

    // Update the prefix and starting number separately, and construct the preview
    if (field === "startingNumber") {
      updatedData[index].startingNumber = value; // Store the number as is
    } else if (field === "prefix") {
      updatedData[index].prefix = value; // Store the prefix as is
    }

    updatedData[
      index
    ].preview = `${updatedData[index].prefix}${updatedData[index].startingNumber}`;

    setModalData(updatedData);
  };

  const handleStatusPrefix = async (sId: any) => {
    const payload = {
      seriesId: sId,
    };
    try {
      const url = `${endponits.STATUS_PREFIX}`;
      const apiResponse = await StatusPrefix(url, payload);
      const { response, error } = apiResponse;
      if (!error && response) {
        toast.success(response.data.message);
        getPrefixDatas();
      } else {
        toast.error(`${error.response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error during API call: ${error}`);
    }
  };

  return (
    <div className="p-5 w-[1100px]">
      <Banner />
      <div className="mt-5 flex gap-7 rounded-[40px] bg-[#EAEBEB] p-3">
        <button className="px-4 py-2 rounded-[40px] text-sm bg-white font-semibold text-dropdownText">
          Transaction Number Series
        </button>
      </div>

      <div className="flex justify-between mt-4">
        <p className="text-textColor font-bold text-lg">
          Transaction Number Series
        </p>
        <div className="flex gap-4">
          <Button
            className="text-sm font-medium"
            onClick={() => openModal("Add")}
            size="sm"
          >
            <PlusCircle color="white" /> New Series
          </Button>
        </div>
      </div>

      <Modal
        open={isModalOpen && modalAction === "Add"}
        onClose={closeModal}
        className="px-8 py-4 w-[55.5%]"
      >
        <div className="mb-5">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
            <div
              className="absolute top-0 -right-8 w-[178px] h-[89px]"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-textColor">{modalTitle}</h3>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>
          <form onSubmit={(e) => addPrefixDatas(e)}>
            <div className="text-dropdownText text-sm mb-5 flex items-center gap-2">
              <label htmlFor="seriesName" className="font-semibold">
                Series Name
              </label>
              <input
                type="text"
                id="seriesName"
                onChange={(e) =>
                  setNewSeriesData({
                    ...newSeriesData,
                    seriesName: e.target.value,
                  })
                }
                className="pl-2 text-sm w-[40%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                placeholder="Series Name"
              />
            </div>

            <div className="max-h-[380px] overflow-y-auto">
              <table className="min-w-full bg-white mb-5">
                <thead
                  className="text-[12px] text-center text-dropdownText sticky top-0 z-10"
                  style={{ backgroundColor: "#F9F7F0" }}
                >
                  <tr>
                    <th className="py-2 px-4 font-medium border-b border-tableBorder">
                      Module
                    </th>
                    <th className="py-2 px-4 font-medium border-b border-tableBorder">
                      Prefix
                    </th>
                    <th className="py-2 px-4 font-medium border-b border-tableBorder">
                      Starting Number
                    </th>
                    <th className="py-2 px-4 font-medium border-b border-tableBorder">
                      Preview
                    </th>
                  </tr>
                </thead>
                <tbody className="text-dropdownText text-[13px]">
                  {modalData.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2.5 px-4 border-y border-tableBorder">
                        {item.module.charAt(0).toUpperCase() + item.module.slice(1)}
                      </td>
                      <td className="py-2.5 px-4 border-y border-tableBorder">
                        <input
                          type="text"
                          className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                          value={item.prefix}
                          onChange={(e) =>
                            handleInputChange(index, "prefix", e.target.value)
                          }
                        />
                      </td>
                      <td className="py-2.5 px-4 border-y border-tableBorder">
                        <input
                          type="number"
                          className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                          value={item.startingNumber}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "startingNumber",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="py-2.5 px-4 border-y border-tableBorder">
                        {`${item.prefix}${item.startingNumber.padStart(
                          4,
                          "0"
                        )}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end items-center mt-6 gap-2">
              <Button
                variant="secondary"
                onClick={closeModal}
                className="pl-10 pr-10 h-[38px] text-sm"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="pl-10 pr-10 h-[38px] text-sm"
                size="sm"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        open={isModalOpen && modalAction === "Edit"}
        onClose={closeModal}
        className="px-8 py-4 w-[55.5%]"
      >
        <div className="mb-5">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
            <div
              className="absolute top-0 -right-8 w-[178px] h-[89px]"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-textColor">{modalTitle}</h3>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>
          <form onSubmit={(e) => editPrefixData(e)}>
            <div className="text-dropdownText text-sm mb-5 flex items-center gap-2">
              <label htmlFor="seriesName" className="font-semibold">
                Series Name
              </label>
              <input
                type="text"
                id="seriesName"
                onChange={(e) =>
                  setEditData({ ...editData, seriesName: e.target.value })
                }
                className="pl-2 text-sm w-[40%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                placeholder="Series Name"
                value={editData?.seriesName}
              />
            </div>

            <div className="max-h-[380px] overflow-y-auto">
              <table className="min-w-full bg-white mb-5">
                <thead
                  className="text-[12px] text-center text-dropdownText sticky top-0 z-10"
                  style={{ backgroundColor: "#F9F7F0" }}
                >
                  <tr>
                    <th className="py-2 px-4 font-medium border-b border-tableBorder">
                      Module
                    </th>
                    <th className="py-2 px-4 font-medium border-b border-tableBorder">
                      Prefix
                    </th>
                    <th className="py-2 px-4 font-medium border-b border-tableBorder">
                      Starting Number
                    </th>
                    <th className="py-2 px-4 font-medium border-b border-tableBorder">
                      Preview
                    </th>
                  </tr>
                </thead>
                <tbody className="text-dropdownText text-[13px]">
                  {modalData.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2.5 px-4 border-y border-tableBorder">
                        {item.module.charAt(0).toUpperCase() + item.module.slice(1)}
                      </td>
                      <td className="py-2.5 px-4 border-y border-tableBorder">
                        <input
                          type="text"
                          className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                          value={editData[item.module] || ""} // Ensure safe access with a default value
                          onChange={(e) => {
                            setEditData((prevState) => ({
                              ...prevState,
                              [item.module]: e.target.value, // Update the specific prefix in editData
                            }));
                          }}
                        />
                      </td>
                      <td className="py-2.5 px-4 border-y border-tableBorder">
                        <input
                          type="number"
                          className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                          value={editData[`${item.module}Num`] || ""} // Ensure safe access with a default value
                          onChange={(e) => {
                            setEditData((prevState) => ({
                              ...prevState,
                              [`${item.module}Num`]: e.target.value, // Update the specific starting number in editData
                            }));
                          }}
                        />
                      </td>
                      <td className="py-2.5 px-4 border-y border-tableBorder">
                        {`${editData[item.module] || ""}${(
                          editData[`${item.module}Num`] || 0
                        )
                          .toString()
                          .padStart(4, "0")}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end items-center mt-6 gap-2">
              <Button
                variant="secondary"
                onClick={closeModal}
                className="pl-10 pr-10 h-[38px] text-sm"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="pl-10 pr-10 h-[38px] text-sm"
                size="sm"
                type="submit"
              >
                Update
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="bg-white rounded-lg p-5 mt-3">
        <div className="flex justify-between items-center">
          <div className="w-[89%]">
            <SearchBar
              placeholder="Search"
              onSearchChange={setSearch}
              searchValue={search}
            />
          </div>
          <div className="flex gap-2">
            <CustomiseColmn columns={columns} setColumns={setColumns} tableId={"transactionNumber"} />
          </div>
        </div>

        <div className="overflow-x-auto mt-3 relative">
          <table className="bg-white mb-5 relative z-10">
            <thead className="text-[12px] text-center text-dropdownText">
              <tr style={{ backgroundColor: "#F9F7F0" }}>
                {columns.map(
                  (col) =>
                    col.visible && (
                      <th
                        key={col.id}
                        className="py-2 px-8 font-medium border-b border-tableBorder"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <p>{col.label}</p>
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody className="text-dropdownText text-center text-[13px]">
              {data
                .filter((item) =>
                  item.seriesName.toLowerCase().includes(search.toLowerCase())
                )
                .map((item, index) => (
                  <tr style={{ whiteSpace: "nowrap" }} key={index}>
                    {columns.map(
                      (col) =>
                        col.visible && (
                          <td
                            key={col.id}
                            className="py-2.5 px-4 border-y border-tableBorder relative"
                          >
                            {col.id === "seriesName" && (
                              <div className="flex items-center gap-1 justify-center">
                                {item.seriesName}
                                {item.status && <StarYellow size={16} />}
                              </div>
                            )}
                            {col.id !== "seriesName" &&
                              col.id !== "actions" &&
                              item[col.id] && (
                                <>
                                  {`${item[col.id].replace(
                                    /(\D+)(\d+)/,
                                    (_, prefix, number) =>
                                      `${prefix}${number.padStart(4, "0")}`
                                  )}`}
                                </>
                              )}
                            {col.id === "actions" && (
                              <div className="flex justify-center items-center cursor-pointer relative">
                                {/* Dynamically create menuItems based on item.status */}
                                <MenuDropdown
                                  menuItems={[
                                    {
                                      label: "Edit",
                                      icon: <Pen color="blue" />,
                                      onClick: () => {
                                        openModal("Edit", item._id); // Directly use item properties
                                      },
                                    },
                                    ...(!item.status
                                      ? [
                                        {
                                          label: "Mark as Default",
                                          icon: <StarYellow />,
                                          onClick: () => {
                                            handleStatusPrefix(
                                              item._id
                                            ); // Directly use item properties
                                          },
                                        },
                                        {
                                          label: "Delete",
                                          icon: <TrashCan color="red" />,
                                          onClick: () => {
                                            handleDeletePrefix(item._id)
                                            // handleDelete(item._id); // Directly use item properties
                                          },
                                        },
                                      ]
                                      : [
                                        // {
                                        //   label: "Delete",
                                        //   icon: <TrashCan color="red" />,
                                        //   onClick: () => {
                                        //     handleDeletePrefix(item._id)
                                        //     // handleDelete(item._id); // Directly use item properties
                                        //   },
                                        // },
                                      ]),

                                  ]}
                                  backgroundColor="bg-white"
                                  trigger={<Ellipsis height={16} />}
                                  position="center"
                                />
                              </div>
                            )}
                          </td>
                        )
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionNumber;
