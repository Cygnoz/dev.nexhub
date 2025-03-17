import NewUnit from "./NewUnit";
import UnitTable from "./UnitTable";

type Props = {};

const UnitHome = ({}: Props) => {
  return (
    <>
      <div className="mx-5 my-4  h-[100vh]  gap-3">
        <div className="flex">
          <div>
            <h1 className="font-bold text-2xl">
              Unit Of Measurement
            </h1>
            <p className="text-sm text-gray mt-1">
            Define precise units of measurement to ensure accurate inventory tracking and product management.
            </p>
          </div>
          <div className="ml-auto  flex items-center">
            <NewUnit/>
            <div className="ms-5">
              {/* <Ellipsis /> */}
            </div>
          </div>
        </div>
        
        <UnitTable/>

      </div>{" "}

    </>
  );
};

export default UnitHome;
