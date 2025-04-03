import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import navlist from "../../assets/constants";
import SettingsIcons from "../../assets/icons/SettingsIcon";
import viewAppsIcon from "../../assets/Images/Frame 629925.png";
import ModuleSearch from "../../Components/ModuleSearch";
import { PreviousPathContext } from "../../context/ContextShare";
import { useOrganization } from "../../context/OrganizationContext";
import useApi from "../../Hooks/useApi";
import { endponits } from "../../Services/apiEndpoints";
import Notification from "./HeaderIcons/Notification";
import Organization from "./HeaderIcons/Organization";
import RefferEarn from "./HeaderIcons/RefferEarn";
type Props = {};

const Header = ({ }: Props) => {
  const navigate = useNavigate();
  const { setPreviousPath } = useContext(PreviousPathContext)!;

  const handleNavigate = () => {
    navigate("/landing#appsSection");
  };


  


  const { request: getOneOrganization } = useApi("get", 7004);

  const {organization,setOrganization}=useOrganization()

   const fetchOrganization = async () => {
       
               try {
                 const url = `${endponits.GET_ONE_ORGANIZATION}`;
                 const { response, error } = await getOneOrganization(url);
                 if (!error && response) {
                   setOrganization(response.data);
                 }
               } catch (error) {
                 console.log("Error in fetching Organization", error);
               }
             
       };

  const handleGoToSettings = () => {
    navigate("/settings");

    // Retrieve values from localStorage and parse them as numbers
    const savedIndex = localStorage.getItem('savedIndex');
    const savedSelectedIndex = localStorage.getItem('savedSelectedIndex');

    // Check if values are not null before parsing them as integers
    const index = savedIndex !== null ? parseInt(savedIndex, 10) : 0;
    const selectedIndex = savedSelectedIndex !== null ? parseInt(savedSelectedIndex, 10) : 0;

    // Ensure navlist has the appropriate structure and check index bounds
    if (navlist[index]?.subhead?.[selectedIndex]?.subRoute) {
      setPreviousPath(navlist[index].subhead[selectedIndex].subRoute);
    } else {
      console.warn("Invalid index or subhead in navlist.");
    }
  };

  useEffect(()=>{
    fetchOrganization()
  },[])


  return (
    <div
      className="p-4 flex items-center gap-2 w-full border-b-slate-400 border-y-orange-200"
      style={{ borderBottom: "1.5px solid rgba(28, 28, 28, 0.1)" }}
    >
      <Toaster reverseOrder={false} />

      {/* Search Bar (Hidden on Mobile) */}
      <div className="w-[55%] sm:w-auto flex-1 hidden sm:block">
        <ModuleSearch />
      </div>

      {/* View Apps */}
      {/* <div
        className="flex ms-14 justify-center items-center gap-2 cursor-pointer"
        onClick={handleNavigate}
      >
        <img src={viewAppsIcon} alt="View Apps Icon" />
        <span className="text-xs font-semibold text-dropdownText whitespace-nowrap">
          View Apps
        </span>
      </div> */}

      {/* Icons & Settings */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="tooltip" data-tooltip="Notifications">
          <Notification />
        </div>
        <div className="tooltip" data-tooltip="Refer & Earn">
          <RefferEarn />
        </div>
        <p onClick={handleGoToSettings} className="tooltip" data-tooltip="Settings">
          <SettingsIcons color="#4B5C79" size="md" />
        </p>
        <div className="tooltip" data-tooltip="Organization">
          <Organization organizationData={organization} />
        </div>
      </div>
    </div>
  );
};

export default Header;
