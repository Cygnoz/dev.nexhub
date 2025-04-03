// import CehvronDown from "../../../assets/icons/CehvronDown"
import PencilEdit from "../../../assets/icons/PencilEdit"
import PlusCircle from "../../../assets/icons/PlusCircle"
import TrashCan from "../../../assets/icons/TrashCan"
import Button from "../../../Components/Button"
import Modal from "../../../Components/model/Modal"
import SearchBar from "../../../Components/SearchBar"
import bgImage from "../../../assets/Images/Frame 6.png";
import CirclePlus from "../../../assets/icons/circleplus"
import { ChangeEvent, useEffect, useState } from "react"
import useApi from "../../../Hooks/useApi"
import { endponits } from "../../../Services/apiEndpoints"
import toast from "react-hot-toast"

type Props = {}

type CategoryData = {
    _id?: string;
    expenseCategory: string;
    description: string;
    createdDate?: string;
  };

function AddExpenseCategory({}: Props) {

   const {request:addCategory}=useApi('post',7008)
   const {request:updateCategory}=useApi('put',7008)
   const {request:deleteCategory}=useApi('delete',7008)
   const {request:getAllCategory}=useApi('get',7008)
   const [allCategory,setAllCategory]=useState([])
    const [categories, setCategories] = useState<CategoryData>({
        expenseCategory: "",
        description: "",
      });
  const [isOpen, setIsOpen] = useState({
    main:false,
    add:false,
    edit:false
  });

  const closeModal = (main:boolean,add:boolean,edit:boolean) => {
    setIsOpen({main:main,edit:edit,add:add})
    setCategories({
      expenseCategory:"",
      description:""
    })
  };
  const openModal=(main:boolean,add:boolean,edit:boolean)=>{
    setIsOpen({main:main,edit:edit,add:add})
  }

  const handleSave = async () => {
    try {
      const url = isOpen.edit ? `${endponits.UPDATE_EXPENSE_CATEGORY}/${categories._id}` : `${endponits.ADD_EXPENSE_CATEGORY}`;
      const apiCall = isOpen.edit ? updateCategory :addCategory ;
      const { response, error } = await apiCall(url, categories);
      console.log("res",response);
      console.log("err",error);
      if (!error || response) {
        toast.success(`Category ${isOpen.edit ? "updated" : "added"} successfully.`);
        closeModal(true,false,false)
        setCategories({
          expenseCategory: "",
          description: "",
          _id:""
        })
        loadCategories();
      } else{
        toast.error(error.response.data.message);
        console.error(`Error saving category: ${error.message}`);
      }
    } catch (error) {
      toast.error("Error in save operation.");
      console.error("Error in save operation", error);
    }
  };

  const loadCategories = async () => {
    try {
      const url = `${endponits.GET_ALL_EXPENSE_CATEGORY}`;
      const { response, error } = await getAllCategory(url)
      if (!error && response) {
        console.log("fs",response.data);
        
        setAllCategory(response.data);
      } else {
        console.error("Failed to fetch Category data.");
      }
    } catch (error) {
      toast.error("Error in fetching Category data.");
      console.error("Error in fetching Category data", error);
    }
  };

  const handleDelete=async (id:any)=>{
    try{
      const url=`${endponits.DELETE_EXPENSE_CATEGORY}/${id}`
      const {response , error}=await deleteCategory(url)
      if(!error || response){ 
        toast.success(response?.data.message)
        if(allCategory.length==1){
          setAllCategory([])
        }
        loadCategories()
      }else{
        console.error("Failed to fetch Category data.");
      }
    }catch(err){
      toast.error("Error in delete Category data.");
      console.error("Error in delete Category data", err);
    }
  }

  useEffect(()=>{
    loadCategories()
  },[])

  console.log("all",allCategory);
  

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategories((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(categories);
  }
  
  
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredCategories = allCategory?.filter((category: any) => {
    return (
      category.expenseCategory?.toLowerCase().includes(searchValue.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchValue.toLowerCase())
    );
  });
    
  return (
    <div >
        <Button variant="secondary" className="flex items-center" size="sm" onClick={()=>openModal(true,false,false)}>
            <CirclePlus color="currentColor" size="14" />{" "}
            <p className="text-md">Add Category</p>
          </Button>
    <Modal open={isOpen.main} onClose={()=>closeModal(false,false,false)} className="w-[90%]  h-[90%] sm:w-[65%] overflow-x-auto"  >
      <div className="p-5 mt-3">
        <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden h-24">
          <div
            className="absolute top-0 right-12 h-24 w-[200px] bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-textColor">
              Manage Category
            </h3>
            <p className="text-dropdownText font-semibold text-sm mt-2">
              Have an insight on the profit or loss incurred due to the change
              in exchange rates
            </p>
          </div>
          <div
            className="ms-auto text-3xl cursor-pointer relative z-10"
            onClick={()=>closeModal(false,false,false)}
          >
            &times;
          </div>
        </div>

        <div className="sm:flex">
            <div className="grid grid-flow-col items-center gap-3 ">
              <div className="sm:w-96">
                <SearchBar
                  placeholder="Search Name or Description"
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                />
              </div>
              {/* <div>
                <div className="relative w-full items-center justify-center flex">
                  <select className="block appearance-none w-full h-10 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <option value="" className="text-gray">
                      All Category
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div> */}
            </div>
          <div className="flex ml-auto me-2 my-4">
            <Button variant="primary" size="xl" onClick={()=>openModal(true,true,false)}>
              <PlusCircle color="white" />
              <p className="text-sm">Add Category</p>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {allCategory.length === 0 ? (
            <p className="text-center col-span-3 text-red-500 font-semibold">
              No categories found !
            </p> 
          ) : ( 
            filteredCategories?.map((category: any) => (
              <div key={category._id} className="flex-row sm:flex p-2">
                <div className="border border-slate-200 text-textColor rounded-xl w-full  sm:w-96 h-auto p-3 flex justify-between">
                  <div>
                    <h3 className="text-sm font-bold">{category.expenseCategory}</h3>
                    <p className="text-xs text-textColor">{category.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <p
                      className="cursor-pointer"
                      onClick={() => {
                        openModal(true, false, true);
                        setCategories({
                          expenseCategory: category.expenseCategory,
                          description: category.description,
                          _id: category._id,
                        });
                      }}
                    >
                      <PencilEdit color="currentColor" />
                    </p>
                    <p
                      className="cursor-pointer"
                      onClick={() => handleDelete(category?._id)}
                    >
                      <TrashCan color="currentColor" />
                    </p>
                  </div>
                </div>
              </div>
            ))
         )} 
        </div>



        <Modal open={isOpen.edit?isOpen.edit:isOpen.add} onClose={()=>closeModal(true,false,false)}  className="w-[90%] sm:w-[35%]">
          <div className="p-5">
            <div className="flex p-4 rounded-xlrelative overflow-hidden h-24">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-textColor">
                  {isOpen.edit ? "Edit" : "Add"} Category
                </h3>
              </div>
              <div
                className="ms-auto text-3xl cursor-pointer relative z-10"
                onClick={()=>closeModal(true,false,false)}
              >
                &times;
              </div>
            </div>

            <form className="grid gap-5">
              <div className="w-full">
                <label className="block text-sm mb-1 text-labelColor">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  name="expenseCategory"
                  value={categories.expenseCategory}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 mt-1 text-sm bg-white border border-inputBorder rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm mb-1 text-labelColor">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter description"
                  name="description"
                  value={categories.description}
                  onChange={handleInputChange}
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 "
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" className="text-sm pl-6 pr-6" onClick={()=>closeModal(true,false,false)}>
                  Cancel
                </Button>{" "}
                <Button variant="primary" size="sm" className="text-sm pl-8 pr-8" 
                onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </Modal>
    </div>
  )
}

export default AddExpenseCategory;