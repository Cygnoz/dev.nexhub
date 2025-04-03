import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../../Components/Button';
import CheveronLeftIcon from '../../../../assets/icons/CheveronLeftIcon';
import PencilEdit from '../../../../assets/icons/PencilEdit';
import PdfView from './PdfView';
import { useEffect, useRef, useState } from 'react';
import useApi from '../../../../Hooks/useApi';
import { endponits } from '../../../../Services/apiEndpoints';
import { useOrganization } from '../../../../context/OrganizationContext';
import SideBar from './SideBar';
import Jornal from '../../bills/ViewBill/Jornal';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../../Components/ConfirmModal';
import Trash2 from '../../../../assets/icons/Trash2';
import Print from '../../../sales/salesOrder/Print';
import { useReactToPrint } from 'react-to-print';

type Props = {};

function PaymentView({ }: Props) {
  const [paymentData, setPaymentData] = useState<[] | any>([])
  const { request: getPayment } = useApi("get", 7005)
  const { organization } = useOrganization()
  const { request: deleteData } = useApi("delete", 7005);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const confirmDelete = () => {
    setConfirmModalOpen(true);
  };

  const { id } = useParams()

  const getPayments = async () => {
    try {
      const url = `${endponits.GET_PAYMENT}/${id}`;
      const apiResponse = await getPayment(url);
      const { response, error } = apiResponse;
      if (!error && response) {
        setPaymentData(response.data);
      } else {
        console.error('API Error:', error?.response?.data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleDelete = async () => {
    try {
      let url = `${endponits.DELETE_PAYMENT_MADE}/${id}`

      if (!url) return;

      const { response, error } = await deleteData(url);
      if (!error && response) {
        console.log("Deleted successfully:", response);
        toast.success(response.data.message)
        setConfirmModalOpen(false)
        setTimeout(() => {
          navigate("/purchase/payment-made");
        }, 1000);

      } else {
        toast.error(error.response.data.message)
      }
    } catch (error) {
      console.error("Error in deleting item:", error);
    }
  };

  useEffect(() => {
    getPayments()
  }, [])

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/purchase/payment-made/edit/${id}`);
  }
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="p-6 text-pdftext bg-white rounded-lg mx-7">
      <div className="flex items-center space-x-2 mb-4">
        <Link to={"/purchase/payment-made"}>
          <div
            style={{ borderRadius: "50%" }}
            className="w-[40px] h-[40px] flex items-center justify-center bg-[#F6F6F6]"
          >
            <CheveronLeftIcon />
          </div>
        </Link>
        <h1 className="text-[20px] font-bold text-[#303F58]">View Payment</h1>
      </div>
      <div className="flex-row sm:flex justify-between items-center">
        <div className="space-x-3 items-center flex text-[#303F58] font-bold text-[16px]">
          <h3>Payment</h3>
          <h3 className="font-normal">|</h3>
          <h3>{paymentData?.paymentId}</h3>
          <p className="w-[47px] h-[25px] bg-[#F3F3F3] rounded-lg flex items-center justify-center">Draft</p>
        </div>
        <div className="flex space-x-3 mb-4">
          <Button className="h-[38px] w-[100px] flex justify-center items-center" variant="secondary" onClick={handleEdit}>
            <PencilEdit color="black" />
            Edit
          </Button> <Button variant="secondary" size="sm" className="px-2" onClick={confirmDelete}>
            <Trash2 color="#565148" />
            Delete
          </Button>

          <div onClick={() => reactToPrintFn()}>
            <Print />
          </div>

        </div>
      </div>
      <hr className="mb-5 border-loremcolor" />
      <div className="grid grid-cols-1 sm:grid-cols-3 space-x-4">
        {/* Sidebar */}
        <SideBar data={paymentData} />
        {/* Main content */}
        <div className='col-span-2'   ref={contentRef}>
          <PdfView data={paymentData} organization={organization} />
        </div>
      </div>
      <Jornal page={"DebitNote"} />

      <ConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete?"
      />
    </div>
  );
}

export default PaymentView;
