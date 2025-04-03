import Bell from "../icons/Bell";
import box from "../icons/box";
import circleDollar from "../icons/circle-dollar-sign";
import newspapper from "../icons/newspaper";
import receiptIndianRupee from "../icons/receipt-indian-rupee";
import shoppingBag from "../icons/shopping-bag";
import shoppingCart from "../icons/ShoppingCart";
import squreUserRound from "../icons/squre-user-round";
import truck from "../icons/truck";
import userRound from "../icons/user-round";
// import usersRound from "../icons/users-round";
// import Wallet from "../icons/Wallet";
import VectorDashboard from "../icons/VectorBashboard";
const navlist = [
  {
    nav: "Home",
    icon: VectorDashboard,
    route: "/",
    subhead: [
      {
        headName: "Dashboard",
        subRoute: "/dashboard",
      },
    ],
  },
  {
    nav: "Inventory",
    icon: box,
    route: "/inventory",
    subhead: [
      {
        headName: "Dashboard",
        subRoute: "/inventory",
      },
      {
        headName: "Item",
        subRoute: "/inventory/Item",
      },
      {
        headName: "Unit of Measurement",
        subRoute: "/inventory/unit",
      },
      // {
      //   headName:"Item Tracking",
      //   subRoute: "/inventory/item-tracking",
      // }
    ],
  },
  {
    nav: "Customer",
    icon: userRound,
    route: "/customer",
    subhead: [
      {
        headName: "Dashboard",
        subRoute: "/customer",
      },
      {
        headName: "Customer",
        subRoute: "/customer/home",
      },
    ],
  },
  {
    nav: "Sales",
    icon: shoppingCart,
    route: "/sales",
    subhead: [
      {
        headName: "Dashboard",
        subRoute: "/sales",
      },
      {
        headName: "Sales Order",
        subRoute: "/sales/salesorder",
      },
      {
        headName: "Quote",
        subRoute: "/sales/quote",
      },
      {
        headName: "Invoice",
        subRoute: "/sales/invoice",
      },
      {
        headName: "Receipt",
        subRoute: "/sales/receipt",
      },
      {
        headName: "POS",
        subRoute: "/pos",
      },
      // {
      //   headName: "Sales Return",
      //   subRoute: "/sales/salesreturn",
      // },
      {
        headName: "Credit Note",
        subRoute: "/sales/credit-note",
      },
    ],
  },
  {
    nav: "Accounts",
    icon: squreUserRound,
    route: "/accountant",
    subhead: [
      {
        headName: "Dashboard",
        subRoute: "/accountant",
      },
      {
        headName: "Chart Of Account",
        subRoute: "/accountant/chart-OF-accountant",
      },
      {
        headName: "Manual Journals",
        subRoute: "/accountant/manualjournal",
      },
      {
        headName: "Bank",
        subRoute: "/accountant/bank",
      },
      {
        headName: "Cash",
        subRoute: "/accountant/cash",
      },
    ],
  },
  {
    nav: "Supplier",
    icon: truck,
    route: "/supplier",
    subhead: [
      {
        headName: "Dashboard",
        subRoute: "/supplier",
      },
      {
        headName: "Supplier",
        subRoute: "/supplier/home",
      },
    ],
  },
  {
    nav: "Expense",
    icon: circleDollar,
    route: "/expense",
    subhead: [
      { headName: "Dashboard", subRoute: "/expense" },
      { headName: "Expense", subRoute: "/expense/home" },
    ],
  },
  // {
  //   nav: "Staff",
  //   icon: usersRound,
  //   route: "/staffs/home",
  //   subhead: [
  //     // {
  //     //   headName: "Dashboard",
  //     //   subRoute: "/",
  //     // },
  //     {
  //       headName: "Staff",
  //       subRoute: "/staffs/home",
  //     },
  //   ],
  // },
  {
    nav: "Purchase",
    icon: shoppingBag,
    route: "/purchase",
    subhead: [
      {
        headName: "Dashboard",
        subRoute: "/purchase",
      },
      {
        headName: "Purchase Order",
        subRoute: "/purchase/purchase-order",
      },
      {
        headName: "Bills",
        subRoute: "/purchase/bills",
      },
      {
        headName: "Payment Made",
        subRoute: "/purchase/payment-made",
      },
      {
        headName: "Debit Note",
        subRoute: "/purchase/debitnote",
      },
    ],
  },

  // {
  //   nav: "Payroll",
  //   icon: receiptIndianRupee,
  //   route: "/home",
  // },
  {
    nav: "Reports",
    icon: newspapper,
    route: "/reports",
  },
];

export default navlist;

export const paymentTermsList = [
  {
    title: "Net 30",
    text: "Payment is due within 30 days from the invoice date",
  },
  {
    title: "2/10 Net 30",
    text: "A 2% discount is available if payment is made within 10 days; otherwise, the full amount is due within 30 days.",
  },
  {
    title: "Due on Receipt",
    text: ": Payment is due immediately upon receiving the invoice",
  },
  {
    title: "EOM",
    text: "Payment is due by the end of the month in which the invoice is dated",
  },
  {
    title: "Net 15",
    text: "Payment is due within 15 days from the invoice date",
  },
  { title: "COD", text: "Payment is due at the time of delivery" },
  {
    title: "Net 60",
    text: "Payment is due within 60 days from the invoice date",
  },
  {
    title: "15 MFI: ",
    text: ": Payment is due on the 15th day of the month following the invoice date",
  },
];

export const organizationList = [
  { title: "Profile", route: "/settings/organization/profile" },
  { title: "Currencies", route: "/settings/currencies" },
  { title: "Accounts", route: "/settings/accounts" },
  { title: "Additional Details", route: "/settings/invoice" },
];

export const taxList = [{ title: "Taxes", route: "/settings/taxes" }];

export const usersAndRoleList = [
  { title: "Users", route: "/settings/users" },
  { title: "Roles", route: "/settings/roles" },
  { title: "User Preferences", route: "/settings/user-preferences" },
];

export const preferencesList = [
  { title: "General", route: "/settings/general" },
  { title: "Customer & Vendors", route: "/settings/customer-vendors" },
  { title: "Accountant", route: "/settings/accountant" },
  { title: "Projects", route: "/settings/projects" },
  { title: "Timesheets", route: "/settings/timesheets" },
  { title: "Customer Portal", route: "/settings/customer-portal" },
  { title: "Vendor Portal", route: "/settings/vendor-portal" },
];

export const SalesList = [
  { title: "Sales Order", route: "/settings/sales-order" },
  { title: "Shipments", route: "/settings/sales/shipments" },
  { title: "Invoices", route: "/settings/sales/invoices" },
  { title: "Delivery Challans", route: "/settings/sales/deliverychallans" },
  { title: "Credit Notes", route: "/settings/credit-notes" },
];

export const purchasesList = [
  { title: "Purchase Orders", route: "/settings/purchase-orders" },
  { title: "Expense", route: "/settings/expense" },
];

export const itemsList = [
  { title: "Item", route: "/settings/item" },
  { title: "Inventory Adjustment", route: "/settings/inventory-adjustment" },
];

export const onlinePaymentList = [
  { title: "Customer Payments", route: "/settings/customer-payments" },
  { title: "Vendor Payments", route: "/settings/vendor-payments" },
];

export const customizationList = [
  { title: "Reporting Tags", route: "/settings/reporting-tags" },
  { title: "Web Tabs", route: "/settings/web-tabs" },
  { title: "Digital Signature", route: "/settings/digital-signature" },
  {
    title: "Transaction Number Series",
    route: "/settings/transaction-number-series",
  },
  { title: "PDF Templates", route: "/settings/pdf-templates" },
];

export const ReminderList = [
  { title: "Reminders", route: "/settings/reminders" },
  { title: "Email Notification", route: "/settings/email-notification" },
  { title: "SMS Notification", route: "/settings/sms-notification" },
];

export const newPurchaseOrderTableHead = [
  "Sl.No.",
  "Product",
  "Quantity",
  "Rate",
  "Tax",
  "Discount",
  "Amount",
  "Actions",
];
export const newDebitTableHead = [
  "Sl.No.",
  "Product",
  "Quantity",
  "Rate",
  "Tax",
  "Amount",
  "Actions",
];

export const PaymentMadeUnpaidBillTable = [
  "Sl.No.",
  "Date",
  "Due Date",
  "Bill Number",
  "Bill Amount",
  "Amount Due",
  "Payment",
];

export const newCreditTableHead = [
  "Product",
  "Quantity",
  "Rate",
  "Tax",
  "Amount",
  "Actions",
];

export const SalesRecieptTable = [
  "Date",
  "Due Date",
  "Invoice Number",
  "Invoice Amount",
  "Amount Due",
  "Payment",
];

export const bankAccountviewTableHaed = [
  "Date",
  "Transaction Details",
  "Type",
  "Debit",
  "Credit",
];

export const settingsList = [
  {
    nav: "Organization",
    icon: userRound,
    subhead: [
      { headName: "Profile", subRoute: "/settings/organization/profile" },
      { headName: "Currencies", subRoute: "/settings/organization/currencies" },
      // {headName:"Accounts",subRoute:"/settings/organization/accounts"},
      {
        headName: "Additional Details",
        subRoute: "/settings/organization/invoice",
      },
    ],
  },
  {
    nav: "Items",
    icon: box,
    subhead: [
      { headName: "Item", subRoute: "/settings/items/item" },
      // {
      //   headName: "Inventory Adjustment",
      //   subRoute: "/settings/inventory-adjustment",
      // },
    ],
  },
  {
    nav: "Tax & Compliance",
    icon: circleDollar,
    subhead: [
      { headName: "Taxes", subRoute: "/settings/taxes" },
      { headName: "MSME Settings", subRoute: "/settings/taxes/msme" },
    ],
  },
  // {
  //   nav: "Rewards Settings",
  //   icon: Wallet,
  //   subhead: [
  //     { headName: "Rewards", subRoute: "/settings/rewards" },
  //     { headName: "Refer & Earn", subRoute: "/settings/rewards/refferandearn" },
  //     {
  //       headName: "Membership Card",
  //       subRoute: "/settings/rewards/membershipcard",
  //     },
  //   ],
  // },
  {
    nav: "Sales",
    icon: shoppingCart,
    subhead: [
      { headName: "Sales Order", subRoute: "/settings/sales/salesOrder" },
      { headName: "Shipments", subRoute: "/settings/sales/shipments" },
      { headName: "Invoices", subRoute: "/settings/sales/invoices" },
      {
        headName: "Delivery Challans",
        subRoute: "/settings/sales/deliverychallans",
      },
      { headName: "Credit Notes", subRoute: "/settings/sales/CreditNotes" },
    ],
  },

  {
    nav: "Purchases",
    icon: shoppingBag,
    subhead: [
      {
        headName: "Purchase Orders",
        subRoute: "/settings/purchase/puschaseOrder",
      },
      { headName: "Expense", subRoute: "/settings/purchases/expenses" },
    ],
  },
  {
    nav: "Customization",
    icon: squreUserRound,
    subhead: [
      { headName: "Reporting Tags", subRoute: "/settings/reporting-tags" },
      { headName: "Web Tabs", subRoute: "/settings/web-tabs" },
      {
        headName: "Digital Signature",
        subRoute: "/settings/digital-signature",
      },
      {
        headName: "Transaction Number Series",
        subRoute: "/settings/transaction-number-series",
      },
      { headName: "PDF Templates", subRoute: "/settings/pdf-templates" },
    ],
  },
  // {
  //   nav: "Users & Roles",
  //   icon: usersRound,
  //   subhead: [
  //     { headName: "Users", subRoute: "/settings/users" },
  //     { headName: "Roles", subRoute: "/settings/roles" },
  //     { headName: "User Preferences", subRoute: "/settings/user-preferences" },
  //   ],
  // },
  {
    nav: "Preferences",
    icon: newspapper,
    subhead: [
      { headName: "General", subRoute: "/settings/general" },
      {
        headName: "Customer & Supplier",
        subRoute: "/settings/preferences/CustomerAndSupplier",
      },
      { headName: "Accountant", subRoute: "/settings/accountant" },
      { headName: "Projects", subRoute: "/settings/projects" },
      { headName: "Timesheets", subRoute: "/settings/timesheets" },
      { headName: "Customer Portal", subRoute: "/settings/customer-portal" },
      { headName: "Vendor Portal", subRoute: "/settings/vendor-portal" },
    ],
  },
  {
    nav: "Reminder & Notification",
    icon: Bell,
    subhead: [
      { headName: "Reminders", subRoute: "/settings/reminders" },
      {
        headName: "Email Notification",
        subRoute: "/settings/email-notification",
      },
      { headName: "SMS Notification", subRoute: "/settings/sms-notification" },
    ],
  },
  {
    nav: "Online Payments",
    icon: receiptIndianRupee,
    subhead: [
      {
        headName: "Customer Payments",
        subRoute: "/settings/customer-payments",
      },
      { headName: "Vendor Payments", subRoute: "/settings/vendor-payments" },
    ],
  },
];
