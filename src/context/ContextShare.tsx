import React, { createContext, useState, ReactNode } from "react";
import { endponits } from "../Services/apiEndpoints";
import useApi from "../Hooks/useApi";

interface CashResponseContextType {
  cashResponse: any;
  setCashResponse: React.Dispatch<React.SetStateAction<any>>;
}

interface BankResponseContextType {
  bankResponse: any;
  setBankResponse: React.Dispatch<React.SetStateAction<any>>;
}

interface PosResponseContextType {
  posResponse: any;
  setPosResponse: React.Dispatch<React.SetStateAction<any>>;
}

interface GstResponseContextType {
  gstResponse: any;
  setGstResponse: React.Dispatch<React.SetStateAction<any>>;
}

interface VatResponseContextType {
  vatResponse: any;
  setVatResponse: React.Dispatch<React.SetStateAction<any>>;
}

interface CurrencyResponseContextType {
  currencyResponse: any;
  setCurrencyResponse: React.Dispatch<React.SetStateAction<any>>;
}

interface SupplierResponseContextType {
  supplierResponse: any;
  setsupplierResponse: React.Dispatch<React.SetStateAction<any>>;
}

interface CustomerResponseContextType {
  customerResponse: any;
  setcustomerResponse: React.Dispatch<React.SetStateAction<any>>;
}

interface CustomerEditResponseContextType {
  customerEditResponse: any;
  setcustomereditResponse: React.Dispatch<React.SetStateAction<any>>;

}

interface unitResponseContextType {
  unitResponse: any;
  setUnitResponse: React.Dispatch<React.SetStateAction<any>>;
}

interface unitEditResponseContextType {
  unitEditResponse: any;
  setEditUnitResponse: React.Dispatch<React.SetStateAction<any>>;
}

interface SettingsResponseType {
  settingsResponse: any;
  getSettingsData: () => void;
}

interface TableLoadingContextType {
  loading: any;
  setLoading: React.Dispatch<React.SetStateAction<any>>;
}

interface PreviousPathContextType {
  previousPath: any;
  setPreviousPath: React.Dispatch<React.SetStateAction<any>>;
}

interface CustomerDeatilsContextType {
  customerDatials: any;
  setCustomerDatials: React.Dispatch<React.SetStateAction<any>>;
}

interface SupplierDetailsContextType {
  supplierDetails: any;
  setSupplierDetails: React.Dispatch<React.SetStateAction<any>>;
}

interface OCRInvoiceContextType {
  ocrInvoice: any;
  setOcrInvoice: React.Dispatch<React.SetStateAction<any>>;
}


interface ocrAddItemContextType {
  ocrAddItem: any;
  setOcrAddItem: React.Dispatch<React.SetStateAction<any>>;
}

interface purchaseTableContextType {
  purchaseResponse: any;
  setPurchaseResponse: React.Dispatch<React.SetStateAction<any>>;
}

export const cashResponseContext = createContext<CashResponseContextType | undefined>(undefined);
export const BankResponseContext = createContext<BankResponseContextType | undefined>(undefined);
export const PosResponseContext = createContext<PosResponseContextType | undefined>(undefined);
export const CurrencyResponseContext = createContext<CurrencyResponseContextType | undefined>(undefined);
export const GstResponseContext = createContext<GstResponseContextType | undefined>(undefined);
export const VatResponseContext = createContext<VatResponseContextType | undefined>(undefined);
export const settingsdataResponseContext = createContext<SettingsResponseType | undefined>(undefined);
export const SupplierResponseContext = createContext<SupplierResponseContextType | undefined>(undefined);
export const CustomerResponseContext = createContext<CustomerResponseContextType | undefined>(undefined);
export const CustomerEditResponseContext = createContext<CustomerEditResponseContextType | undefined>(undefined);
export const UnitResponseContext = createContext<unitResponseContextType | undefined>(undefined);
export const UnitEditResponseContext = createContext<unitEditResponseContextType | undefined>(undefined);
export const TableResponseContext = createContext<TableLoadingContextType | undefined>(undefined);
export const PreviousPathContext = createContext<PreviousPathContextType | undefined>(undefined);
export const CustomerDeatilsContext = createContext<CustomerDeatilsContextType | undefined>(undefined);
export const SupplierDetailsContext = createContext<SupplierDetailsContextType | undefined>(undefined);
export const PurchaseContext = createContext<purchaseTableContextType | undefined>(undefined);
export const OCRInvoiceContext = createContext<OCRInvoiceContextType>({ ocrInvoice: null, setOcrInvoice: () => { }, });
export const octAddItemContext = createContext<ocrAddItemContextType>({ ocrAddItem: null, setOcrAddItem: () => { }, });

interface ContextShareProps {
  children: ReactNode;
}

const ContextShare: React.FC<ContextShareProps> = ({ children }) => {
  const [supplierDetails, setSupplierDetails] = useState("")
  const [customerDatials, setCustomerDatials] = useState("");
  const [previousPath, setPreviousPath] = useState("");
  const [cashResponse, setCashResponse] = useState<any>({});
  const [bankResponse, setBankResponse] = useState<any>({});
  const [posResponse, setPosResponse] = useState<any>({});
  const [currencyResponse, setCurrencyResponse] = useState<any>({});
  const [gstResponse, setGstResponse] = useState<any>({});
  const [vatResponse, setVatResponse] = useState<any>({});
  const [settingsResponse, setSettingsesponse] = useState<any>({});
  const { request: getAllSettingsData } = useApi("get", 7004);
  const [supplierResponse, setsupplierResponse] = useState<any>({});
  const [customerResponse, setcustomerResponse] = useState<any>({});
  const [customerEditResponse, setcustomereditResponse] = useState<any>({});
  const [unitResponse, setUnitResponse] = useState<any>({});
  const [unitEditResponse, setEditUnitResponse] = useState<any>({});
  const [ocrInvoice, setOcrInvoice] = useState<any>({})
  const [ocrAddItem, setOcrAddItem] = useState<any>({})
  const [purchaseResponse,setPurchaseResponse]=useState<any>({})

  const [loading, setLoading] = useState<any>({
    skelton: false,
    noDataFound: false
  })

  const getSettingsData = async () => {
    try {
      const url = `${endponits.GET_SETTINGS_DATA}`;
      const apiResponse = await getAllSettingsData(url);
      const { response, error } = apiResponse;
      if (!error && response) {
        setSettingsesponse(response);
      } else {
        console.error('API Error:', error?.response?.data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };




  return (
    <SupplierDetailsContext.Provider value={{ supplierDetails, setSupplierDetails }}>
      <CustomerDeatilsContext.Provider value={{ customerDatials, setCustomerDatials }}>
        <UnitEditResponseContext.Provider value={{ unitEditResponse, setEditUnitResponse }}>
          <UnitResponseContext.Provider value={{ unitResponse, setUnitResponse }}>
            <cashResponseContext.Provider value={{ cashResponse, setCashResponse }}>
              <BankResponseContext.Provider value={{ bankResponse, setBankResponse }}>
                <PosResponseContext.Provider value={{ posResponse, setPosResponse }}>
                  <CurrencyResponseContext.Provider value={{ currencyResponse, setCurrencyResponse }}>
                    <GstResponseContext.Provider value={{ gstResponse, setGstResponse }}>
                      <VatResponseContext.Provider value={{ vatResponse, setVatResponse }}>
                        <settingsdataResponseContext.Provider value={{ settingsResponse, getSettingsData }}>
                          <CustomerEditResponseContext.Provider value={{ customerEditResponse, setcustomereditResponse }}>
                            <SupplierResponseContext.Provider value={{ supplierResponse, setsupplierResponse }}>
                              <CustomerResponseContext.Provider value={{ customerResponse, setcustomerResponse }}>
                                <TableResponseContext.Provider value={{ loading, setLoading }}>
                                  <PreviousPathContext.Provider value={{ previousPath, setPreviousPath }}>
                                    <OCRInvoiceContext.Provider value={{ ocrInvoice, setOcrInvoice }}>
                                      <octAddItemContext.Provider value={{ ocrAddItem, setOcrAddItem }}>
                                       <PurchaseContext.Provider value={{purchaseResponse,setPurchaseResponse}}> {children}</PurchaseContext.Provider>
                                      </octAddItemContext.Provider>
                                    </OCRInvoiceContext.Provider>
                                  </PreviousPathContext.Provider>
                                </TableResponseContext.Provider>
                              </CustomerResponseContext.Provider>
                            </SupplierResponseContext.Provider>
                          </CustomerEditResponseContext.Provider>
                        </settingsdataResponseContext.Provider>
                      </VatResponseContext.Provider>
                    </GstResponseContext.Provider>
                  </CurrencyResponseContext.Provider>
                </PosResponseContext.Provider>
              </BankResponseContext.Provider>
            </cashResponseContext.Provider>
          </UnitResponseContext.Provider>
        </UnitEditResponseContext.Provider>
      </CustomerDeatilsContext.Provider>
    </SupplierDetailsContext.Provider>

  );
};

export default ContextShare;
