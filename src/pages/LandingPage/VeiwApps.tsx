import { useState } from "react";
import exploreTextLight from "../../assets/AppsIcons/app-title.png";
import exploreTextDark from "../../assets/AppsIcons/app-title-lite.png";
import IconGrid from "./LandingIcons/IconGrid";
import invoice from "../../assets/AppsIcons/Invoice.png";
import quotes from "../../assets/AppsIcons/Quote.png";
import reciept from "../../assets/AppsIcons/Reciept.png";
import creditNote from "../../assets/AppsIcons/Credit-note.png";
import salesReturn from "../../assets/AppsIcons/Sales-return.png";
import purchasOrder from "../../assets/AppsIcons/Purchase-order.png";
import bills from "../../assets/AppsIcons/Bills.png";
import PaymentMade from "../../assets/AppsIcons/Payment-made.png";
import debitNote from "../../assets/AppsIcons/Debit-note.png";
import chartOfAcc from "../../assets/AppsIcons/Chart-of-account.png";
import manualJournal from "../../assets/AppsIcons/Manual-Journals.png";
import bank from "../../assets/AppsIcons/Bank.png";
import cash from "../../assets/AppsIcons/Cash.png";
import daybook from "../../assets/AppsIcons/Day-book.png";
import itemTracking from "../../assets/AppsIcons/Item-tracking.png";
import unitofMeasurment from "../../assets/AppsIcons/Unit of Measure.png";
import settings from "../../assets/AppsIcons/Settings.png";
import report from "../../assets/AppsIcons/Report.png";
import salesOrder from "../../assets/AppsIcons/sales order.png"
import item from "../../assets/AppsIcons/Items.png"
import customer from "../../assets/AppsIcons/customer_5939790.png"
import supplier from "../../assets/AppsIcons/supplier_12112191.png"
import expense from "../../assets/AppsIcons/expense_12139704.png"
import organization from "../../assets/AppsIcons/organization_12966863.png"
import tax from "../../assets/AppsIcons/tax_2863333.png"
import userAndRolls from "../../assets/AppsIcons/Users And Role.png"
import prefernces from "../../assets/AppsIcons/Preference.png"
import sales from "../../assets/AppsIcons/sale-tag_1374072.png"
import purchase from "../../assets/AppsIcons/Purchase.png"
import onlinePayment from "../../assets/AppsIcons/Online Payment.png"
import customization from "../../assets/AppsIcons/Customization.png"
import reminder from "../../assets/AppsIcons/reminder_16766291.png"
import reward from "../../assets/AppsIcons/Reward.png"
import posIcon from "../../assets/AppsIcons/POS.png"



const iconDataMap: any = {
  All: [
    { icon: salesOrder, label: "Sales Order", route: "/sales/salesorder", index: 3, subIndex: 0 },
    { icon: quotes, label: "Quotes", route: "/sales/quote", index: 3, subIndex: 1 },
    { icon: invoice, label: "Invoice", route: "/sales/invoice", index: 3, subIndex: 2 },
    { icon: reciept, label: "Receipt", route: "/sales/receipt", index: 3, subIndex: 3 },
    { icon: creditNote, label: "Credit Note", route: "/sales/credit-note", index: 3, subIndex: 5 },
    { icon: salesReturn, label: "Sales Return", route: "/item-tracking", index: 5, subIndex: 2 },
    { icon: purchasOrder, label: "Purchase Order", route: "/purchase/purchase-order", index: 8, subIndex: 0 },
    { icon: posIcon, label: "POS", route: "/pos", state: { from: "/landing" }, index: 0, subIndex: 0, },
    { icon: bills, label: "Bills", route: "/purchase/bills", index: 8, subIndex: 1 },
    { icon: PaymentMade, label: "Payment Made", route: "/purchase/payment-made", index: 8, subIndex: 2 },
    { icon: debitNote, label: "Debit Note", route: "/purchase/debitnote", index: 8, subIndex: 3 },
    { icon: chartOfAcc, label: "Chart of Account", route: "/accountant/chart-OF-accountant", index: 4, subIndex: 0 },
    { icon: manualJournal, label: "Manual Journals", route: "/accountant/manualjournal", index: 4, subIndex: 1 },
    { icon: bank, label: "Bank", route: "/accountant/bank", index: 4, subIndex: 2 },
    { icon: cash, label: "Cash", route: "/accountant/cash", index: 4, subIndex: 3 },
    { icon: daybook, label: "Day Book", route: "/accountant/daybook", index: 4, subIndex: 5 },
    { icon: item, label: "Item", route: "/inventory/Item", index: 1, subIndex: 1 },
    { icon: unitofMeasurment, label: "Unit of Measure", route: "/inventory/unit", index: 1, subIndex: 2 },
    { icon: itemTracking, label: "Item Tracking", route: "/inventory/item-tracking", index: 1, subIndex: 3 },
    { icon: customer, label: "Customer", route: "/customer/home", index: 2, subIndex: 0 },
    { icon: supplier, label: "Supplier", route: "/supplier/home", index: 5, subIndex: 0 },
    { icon: expense, label: "Expense", route: "/expense/home", index: 6, subIndex: 0 },
    { icon: settings, label: "Settings", route: "/settings", index: 21, subIndex: 0 },
    { icon: report, label: "Report", route: "/report", index: 22, subIndex: 1 },
  ],
  Sales: [
    { icon: salesOrder, label: "Sales Order", route: "/sales/salesorder", index: 3, subIndex: 0 },
    { icon: quotes, label: "Quotes", route: "/sales/quote", index: 3, subIndex: 1 },
    { icon: invoice, label: "Invoice", route: "/sales/invoice", index: 3, subIndex: 2 },
    { icon: reciept, label: "Receipt", route: "/sales/receipt", index: 3, subIndex: 3 },
    { icon: posIcon, label: "POS", route: "/pos", state: { from: "/sales" }, index: 3, subIndex: 2, },
    { icon: creditNote, label: "Credit Note", route: "/sales/credit-note", index: 3, subIndex: 5 },
  ],
  Purchase: [
    { icon: purchasOrder, label: "Purchase Order", route: "/purchase/purchase-order", index: 8, subIndex: 0 },
    { icon: bills, label: "Bills", route: "/purchase/bills", index: 8, subIndex: 1 },
    { icon: PaymentMade, label: "Payment Made", route: "/purchase/payment-made", index: 8, subIndex: 2 },
    { icon: debitNote, label: "Debit Note", route: "/purchase/debitnote", index: 8, subIndex: 3 },
  ],
  Inventory: [
    { icon: item, label: "Item", route: "/inventory/Item", index: 1, subIndex: 1 },
    { icon: unitofMeasurment, label: "Unit of Measure", route: "/inventory/unit", index: 1, subIndex: 2 },
    { icon: itemTracking, label: "Item Tracking", route: "/inventory/item-tracking", index: 1, subIndex: 3 },
  ],
  Accounts: [
    { icon: chartOfAcc, label: "Chart of Account", route: "/accountant/chart-OF-accountant", index: 4, subIndex: 0 },
    { icon: manualJournal, label: "Manual Journals", route: "/accountant/manualjournal", index: 4, subIndex: 1 },
    { icon: bank, label: "Bank", route: "/accountant/bank", index: 4, subIndex: 2 },
    { icon: cash, label: "Cash", route: "/accountant/cash", index: 4, subIndex: 3 },
    { icon: daybook, label: "Day Book", route: "/accountant/daybook", index: 4, subIndex: 4 },
  ],
  Settings: [
    { icon: organization, label: "Organization", route: "/settings/organization/profile", index: 0, subIndex: 0 },
    { icon: tax, label: "Taxes & Compliance", route: "/settings/taxes", index: 0, subIndex: 0 },
    { icon: userAndRolls, label: "Users & Roles", route: "/settings/users-roles", index: 0, subIndex: 0 },
    { icon: prefernces, label: "Preferences", route: "/settings/preferences", index: 0, subIndex: 0 },
    { icon: sales, label: "Sales", route: "/settings/sales/salesOrder", index: 0, subIndex: 0 },
    { icon: purchase, label: "Purchases", route: "/settings/purchase/puschaseOrder", index: 0, subIndex: 0 },
    { icon: item, label: "Items", route: "/settings/items/item", index: 0, subIndex: 0 },
    { icon: onlinePayment, label: "Online Payments", route: "/settings/online-payments", index: 0, subIndex: 0 },
    { icon: customization, label: "Customization", route: "/settings/customization", index: 0, subIndex: 0 },
    { icon: reminder, label: "Reminder & Notification", route: "/settings/reminder-notification", index: 0, subIndex: 0 },
    { icon: reward, label: "Reward Settings", route: "/settings/rewards", index: 0, subIndex: 0 },

  ]
};

type Props = {
  mode?: boolean;
  setMode?: boolean
};

const ViewApps: React.FC<Props> = ({ mode }) => {
  const [selectedTab, setSelectedTab] = useState("All");


  return (
    <>
      <div className="flex items-center justify-center mt-16">
        <img
          src={mode ? exploreTextDark : exploreTextLight}
          className="w-[100%] sm:w-[45%]"
          alt="App Title"
        />
      </div>
      <div className="mt-9 flex justify-center items-center">
        <div className={`flex items-center w-[100%] sm:w-[80%] justify-start sm:justify-center gap-2 sm:gap-4 px-3 sm:px-6 py-4 rounded-full 
  shadow-md overflow-x-auto scrollbar-hide border 
  ${mode ? "bg-[#F3F3F3] border-0" : "bg-[#FFFFFF1A] border-[#73796f]"}`}
          style={{
            scrollbarWidth: 'none',  /* Firefox */
            msOverflowStyle: 'none',  /* IE and Edge */
          }}>

          {["All", "Sales", "Purchase", "Inventory", "Accounts", "Settings"].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 whitespace-nowrap rounded-full text-sm sm:text-base transition-colors duration-200 ease-in-out
  ${mode ? (selectedTab === tab ? "bg-white font-semibold" : "") : (selectedTab === tab ? "bg-white font-semibold" : "")}
  ${mode ? (selectedTab === tab ? "text-[#303F58]" : "text-[#303F58]") : (selectedTab === tab ? "text-textColor" : "text-[#F6F6F6]")}
`}
            >
              <span>{tab}</span>
            </button>
          ))}
        </div>
      </div>


      <div className="mt-9 px-0 sm:px-44 h-[100%]">
        {iconDataMap[selectedTab] ? (
          <IconGrid
            key={selectedTab} // Key added to reset on tab change
            iconData={iconDataMap[selectedTab]}
            mode={mode}
          />
        ) : (
          <p>Select a category</p>
        )}
      </div>

    </>
  );
};

export default ViewApps;
