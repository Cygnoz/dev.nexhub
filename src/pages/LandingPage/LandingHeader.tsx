import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/nexHubLogo.png.png";
// import logoLight from "../../../public/bill-bizz-logo.png";
import ArrowrightUp from "../../assets/icons/ArrowrightUp";
import BellDot from "../../assets/icons/BellDot";
import Sun from "../../assets/icons/Sun";
import Moon from "../../assets/icons/Moon";
import SettingsIcons from "../../assets/icons/SettingsIcon";
import ModuleSearch from "../../Components/ModuleSearch";
import { useOrganization } from "../../context/OrganizationContext";
import organizationIcon from "../../assets/Images/Ellipse 1.png";
import User from "../../assets/icons/User";
import LogOut from "../../assets/icons/LogOut";
import SubscriptionDrawer from "./SubscriptionDrawer";

type Props = {
  setMode?: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: boolean;
};

function LandingHeader({ mode, setMode }: Props) {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown
  const navigate = useNavigate();
  const { organization } = useOrganization();

  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    if (storedMode !== null) {
      setMode?.(storedMode === "true");
    }
  }, [setMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleMode = () => {
    if (setMode) {
      setMode((prev) => {
        const newMode = !prev;
        localStorage.setItem("mode", newMode.toString());
        return newMode;
      });
    }
  };


  const handleLogout = () => {
    ["authToken", "savedIndex", "savedSelectedIndex"].forEach((item) =>
      localStorage.removeItem(item)
    );
    navigate("/login");
  };



  return (
    <header
      className={`${mode ? "bg-[#EAEBEB]" : "bg-[#2C353B]"
        } text-[#DFD1B4] flex items-center justify-between p-4 rounded-full mb-8 px-3 sm:px-6 w-full max-w-full overflow-hidden`}
    >
     <div
        onClick={() => navigate("/landing")}
        className="flex items-center space-x-2 cursor-pointer"
      >
        <img
          src={logo}
          alt=""
          className="w-7 h-7"
        />
        <h1
          className={`text-lg font-medium ${mode ? "text-[#303F58]" : "text-[#F7E7CE]"
            }`}
        >
          NEXHUB
        </h1>
      </div>

      <div className="hidden absolute right-[35%] md:block md:w-[45%]">
        <ModuleSearch mode={mode} page="landing" />
      </div>

      <div className="flex items-center space-x-1 sm:space-x-4">
        <button
          className={`${mode ? "bg-white" : "bg-[#404B52]"
            } text-[#DFD1B4] w-[60px] sm:w-[38px] h-[38px] flex justify-center items-center rounded-full`}
        >
          <BellDot color={mode ? "#4B5C79" : "white"} />
        </button>
        <button
          onClick={() => navigate("/settings")}
          className={`${mode ? "bg-white" : "bg-[#404B52]"
            } text-[#DFD1B4] w-[60px] sm:w-[38px] h-[38px] flex justify-center items-center rounded-full`}
        >
          <SettingsIcons color={mode ? "#4B5C79" : "white"} />
        </button>

        {/* Profile dropdown */}
        <div ref={dropdownRef} className="">
          <img
            src={organization?.organizationLogo || organizationIcon}
            className="w-[55px] sm:w-9 h-9 rounded-full object-cover cursor-pointer"
            alt="Organization Logo"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          />

          {isDropdownOpen && (
            <div className={`absolute right-[20%] mt-3 rounded-xl px-7 py-4 text-sm space-y-4 shadow-lg z-9999 w-48
          ${!mode ? "bg-[#3C474D] text-[#DFE1E2]" : "bg-white text-[#4B5C79]"}
          `}>
              <div className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/settings/organization/profile")}
              >
                <User width={18} height={18} color={mode ? "#4B5C79" : "#DFE1E2"} />
                <p>My Profile</p>
              </div>
              <SubscriptionDrawer mode={mode} />
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut color={mode ? "#4B5C79" : "#DFE1E2"} />
                <p>Log out</p>
              </div>
            </div>
          )}
        </div>

        <button className="hidden md:flex bg-[#FCFFED] text-[#585953] text-[12px] w-[138px] h-[38px] rounded-full font-semibold items-center justify-center gap-1">
          Let's Connect
          <ArrowrightUp />
        </button>

        {mode ? (
          <button
            className="bg-white border-white rounded-full border-4"
            onClick={toggleMode}
          >
            <div className="bg-[#EAEBEB] p-1 rounded-full">
              <Moon />
            </div>
          </button>
        ) : (
          <button
            className="bg-[#F3F3F3] border-[#7A8087] p-1 rounded-full border-4"
            onClick={toggleMode}
          >
            <div className="bg-[#F3F3F3] rounded-full">
              <Sun />
            </div>
          </button>
        )}
      </div>
    </header>

  );
}

export default LandingHeader;
