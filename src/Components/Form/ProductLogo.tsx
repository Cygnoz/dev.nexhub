import bilbizz from "../../assets/icons/BillBizzIcon.tsx.svg";
import salonex from "../../assets/icons/SewnexIconn.svg";
import sewnex from "../../assets/icons/SewnexIconn.svg";
import sixnexd from "../../assets/icons/SixNexDIcon.svg";

type Props = {
    projectName:string
    size?:number
}

function ProductLogo({projectName,size=10}: Props) {
    const projectImages: Record<string, string> = {
        BillBizz: bilbizz,
        SewNex: sewnex,
        SaloNex: salonex,
        "6NexD": sixnexd,
      };
    
      // Get the image based on projectName, default to an empty string if not found
      const projectImage = projectImages[projectName] || "";
  return (
    <>
    {
        projectName&&
        <img src={projectImage} alt={projectName} className={` h-${size} w-${size} object-contain`} />
        
    }
    </>
  )
}

export default ProductLogo