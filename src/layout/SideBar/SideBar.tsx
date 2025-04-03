import { Link } from "react-router-dom";
import logo from "../../../public/nexHubLogo.png.png";
import navlist from "../../assets/constants";
import { useEffect, useState } from "react";
import ThreelineIcon from "../../assets/icons/ThreelineIcon";
import CloseButton from "../../assets/icons/CloseButton";

type Props = {
  activeIndex: number | null;
  setActiveIndex: (index: number) => void;
};

const SideBar = ({ activeIndex, setActiveIndex }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  useEffect(() => {
    const savedIndex = localStorage.getItem("savedIndex");
    if (savedIndex !== null) {
      setActiveIndex(Number(savedIndex));
    }
  }, [activeIndex]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    localStorage.setItem("savedIndex", index.toString());
    localStorage.setItem("savedSelectedIndex", "0");
    setIsSidebarOpen(false); // Close sidebar when an item is clicked (for mobile)
  };


  return (
    <>
      {/* Hamburger Menu Button (Only Visible on Mobile) */}
      <button
        className="sm:hidden fixed top-3 left-3 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <CloseButton /> : <ThreelineIcon />}
      </button>

      {/* Sidebar (Hidden on Mobile unless Opened) */}
      <aside
        className={`bg-primary_main h-[100vh] overflow-y-scroll hide-scrollbar w-[72px] 
        fixed top-0 left-0 z-40 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0`}
      >
        <nav>
          <div  className="flex justify-center items-center my-3   cursor-pointer">
            <img src={logo} alt="logo" className="w-14 h-14" />
          </div>
        </nav>
        <ul className="flex-col">
          {navlist.map((item, index) => (
            <div className="flex justify-center" key={index}>
              <ul>
                <Link to={item.route}>
                <li className={`pb-3`} onClick={() => handleClick(index)}>
                  <div
                    className={`px-2 py-2 rounded-lg  flex justify-center ${
                      activeIndex === index ? "bg-[#D6EFFF]" : ""
                    }`}
                  >
                    {item.icon && <item.icon   color={activeIndex === index ? "#0099F8" : "#8D9BA2"}/>}
                  </div>
                  <p className="text-[8px] text-center text-[#8D9BA2]">
                    {item.nav}
                  </p>
                </li>
                </Link>
              </ul>
            </div>
          ))}
        </ul>
      </aside>

      {/* Background Overlay when Sidebar is Open on Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;
