import { forwardRef, useState, useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import PencilEdit from "../../../assets/icons/PencilEdit";
import PlusCircle from "../../../assets/icons/PlusCircle";
import TrashCan from "../../../assets/icons/TrashCan";
import bgImage from "../../../assets/Images/6.png";
import Button from "../../../Components/Button";
import Modal from "../../../Components/model/Modal";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";

type Rack = {
  _id?: string;
  name: string;
  description: string;
  type?: string;
  createdDate?: string;
};

type Props = {
  onClose: () => void;
};

const RackModal = forwardRef<HTMLDivElement, Props>(({ onClose }, ref) => {
  const { request: fetchAllRacks } = useApi("put", 7003);
  const { request: deleteRackRequest } = useApi("delete", 7003);
  const { request: updateRackRequest } = useApi("put", 7003);
  const { request: addRackRequest } = useApi("post", 7003);
  const [rackData, setRackData] = useState<Rack>({
    name: "",
    description: "",
    type: "rack",
  });
  const [Allracks, setallRacks] = useState<Rack[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const closeModal = () => {
    setModalOpen(false);
  };
  const loadRacks = async () => {
    try {
      const url = `${endponits.GET_ALL_BRMC}`;
      const body = { type: "rack" };
      const { response, error } = await fetchAllRacks(url, body
      );
      if (!error && response) {
        setallRacks(response.data);
      } else {
        console.error("Failed to fetch racks data.");
      }
    } catch (error) {
      toast.error("Error fetching racks data.");
      console.error("Error fetching racks data", error);
    }
  };
  useEffect(() => {
    loadRacks();
  }, []);

  const openModal = (rack?: any) => {
    if (rack) {
      setIsEdit(true);
      setRackData({
        _id: rack.id,
        name: rack.rackName,
        description: rack.description,
        type: rack.type || "rack",
      });
    } else {
      setIsEdit(false);
      setRackData({
        name: "",
        description: "",
        type: "rack",
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const url = isEdit ? `${endponits.UPDATE_BRMC}` : `${endponits.ADD_BRMC}`;
      const apiCall = isEdit ? updateRackRequest : addRackRequest;

      const { response, error } = await apiCall(url, rackData);

      if (!error && response) {
        if (isEdit) {
          toast.success(response.data.message);

        }
        else {
          toast.success(response.data);

        }
        loadRacks();
        closeModal();
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error in save operation.");
    }
  };

  const handleDelete = async (rack: any) => {

    try {
      const url = `${endponits.DELETE_BRMC}/${rack.id}`;
      const { response, error } = await deleteRackRequest(url);
      if (!error && response) {
        toast.success("Rack deleted successfully!");
        loadRacks();
        if (Allracks.length == 1) {
          setallRacks((prevData) => prevData.filter((m: any) => m._id !== rack._id));
        }
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting rack.");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRackData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div ref={ref}>
      <Modal open={true} onClose={onClose} className="w-[90%] sm:w-[50%]">
        <div className="p-5 mt-3">
          <div className="mb-5 flex flex-col sm:flex-row p-4 rounded-xl bg-CreamBg relative overflow-hidden h-auto sm:h-24">
            <div
              className="absolute top-0 right-6 sm:right-12 h-20 sm:h-24 w-[150px] sm:w-[200px] bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <div className="relative z-10 overflow-x-auto">
              <h3 className="text-lg sm:text-xl font-bold text-textColor">Manage Rack</h3>
              <p className="text-dropdownText font-semibold text-sm mt-2 sm:mt-0">
                Have an insight on the profit or loss incurred due to the change in exchange rates
              </p>
            </div>
            <div
              className="ms-auto text-2xl sm:text-3xl cursor-pointer relative z-10 mt-2 sm:mt-0"
              onClick={onClose}
            >
              &times;
            </div>
          </div>


          <div className="flex justify-end me-2 my-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => openModal()}
              className="text-sm"
            >
              <PlusCircle color="white" />
              Add Rack
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {Allracks.length > 0 ? (
              Allracks.map((item: any) => (
                <div key={item._id} className="flex p-2">
                  <div className="border border-slate-200 text-textColor rounded-xl w-96 h-auto p-3 flex justify-between">
                    <div>
                      <h3 className="text-sm font-bold">{item.rackName}</h3>
                      <p className="text-xs text-textColor">{item.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <p className="cursor-pointer" onClick={() => openModal(item)}>
                        <PencilEdit color="currentColor" />
                      </p>
                      <p className="cursor-pointer" onClick={() => handleDelete(item)}>
                        <TrashCan color="currentColor" />
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-red-500 font-semibold">No racks found!</p>
            )}
          </div>

          <div className="flex justify-end my-3">
            <Button variant="primary" onClick={onClose} size="sm" className="text-sm">
              Done
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={isModalOpen} onClose={closeModal} className="w-[90%] sm:w-[40%]">
        <div className="p-5 mt-3">
          <div className="flex p-4 rounded-xl relative overflow-hidden">
            <h3 className="text-xl font-bold text-textColor">
              {isEdit ? "Edit Rack" : "Add Rack"}
            </h3>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="">
              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Name
                </label>
                <input
                  placeholder="Rack A1"
                  type="text"
                  name="name"
                  value={rackData.name}
                  onChange={handleInputChange}
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 text-zinc-700 h-10 "
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Description"
                  name="description"
                  value={rackData.description}
                  onChange={handleInputChange
                  }
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 "
                />
              </div>

              <div className="flex justify-end gap-2 mb-3">
                <Button onClick={closeModal} className="text-sm pl-6 pr-6" variant="tertiary" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="text-sm pl-6 pr-6" size="sm">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
});

export default RackModal;
