import { Link } from "../utils";
import {
  faBars,
  faChevronRight,
  faUserFriends,
  faCog,
  faChartLine,
  faWeight,
  faUser,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export const results = [
  { id: "1", name: "Allie becker" },
  { id: "2", name: "Binge watch" },
  { id: "3", name: "Black bond" },
  { id: "4", name: "Becker james" },
  { id: "5", name: "lyold praise" },
  { id: "6", name: "George bush" },
  { id: "7", name: "Man zanga" },
  { id: "8", name: "George orwell" },
  { id: "9", name: "Bell braid" },
  { id: "10", name: "John Doe" },
];

export const dashBoardLinks: Link[] = [
  {
    path: "/",
    title: "Dashboard",
    icon: faBars,
  },
  {
    path: "/payroll",
    title: "Payroll Activities",
    icon: faChartLine,
    subLinks: [
      {
        path: "/my/dashboard/payroll/link",
        title: "Link 1",
        icon: faChevronRight,
      },
      {
        path: "/my/dashboard/payroll/link2",
        title: "Link 2",
        icon: faChevronRight,
      },
      {
        path: "/my/dashboard/payroll/link2",
        title: "Link 3",
        icon: faChevronRight,
      },
    ],
  },
  {
    path: "/salary",
    title: "Salary Structure",
    icon: faWeight,
  },
  {
    path: "/elements",
    title: "Element Setup",
    icon: faCog,
    subLinks: [
      {
        path: "/elements/element",
        title: "Elements",
        icon: faChevronRight,
      },
      {
        path: "/elements/balances",
        title: "Balances",
        icon: faChevronRight,
      },
    ],
  },
  {
    path: "/employee",
    title: "Employees",
    icon: faUserFriends,
  },
];

export const utilsLinks: Link[] = [
  {
    path: "/payroll-settings",
    title: "Payroll Settings",
    icon: faCog,
    subLinks: [
      {
        path: "/elements/element",
        title: "Element Setup",
        icon: faChevronRight,
      },
      {
        path: "/elements/balances",
        title: "Balances",
        icon: faChevronRight,
      },
    ],
  },
  {
    path: "/account",
    title: "My Account",
    icon: faUser,
  },
  {
    title: "Logout",
    path: "/logout",
    icon: faArrowRightFromBracket,
  },
];

export const options = [
  "Payroll Management",
  "Payroll settings",
  "Payroll something",
];

export const organizations = [
  "PaperSoft Limited ",
  "Softsuite",
  "Soft Alliance",
];

export const baseUrl = "https://650af6bedfd73d1fab094cf7.mockapi.io";


export const elementAccesor = [
  { Header: "Name", accessor: "name" },
  { Header: "Element Category", accessor: "categoryValueId" },
  { Header: "Element Classification", accessor: "classificationValueId" },
  { Header: "status", accessor: "status" },
  { Header: "Date & Time Modified", accessor: "createdAt" },
  { Header: "Modified By", accessor: "modifiedBy" },
];

export const elementLinkAccessor = [
  { Header: "Name", accessor: "name" },
  { Header: "Sub-Organization", accessor: "suborganizationId" },
  { Header: "Department", accessor: "departmentId" },
  { Header: "Employee Category", accessor: "employeeCategoryValueId" },
  { Header: "amount", accessor: "amount" },
];

export const monthsArray = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const tableStatusColors: Record<string, string> = {
  active: "rgba(75, 170, 121, 1)",
  inactive: "#F15046",
};


export const tableBackgroundColors: Record<string, string> = {
  active: "rgba(244, 250, 247, 1)",
  inactive: "rgba(255, 154, 152, 0.3)",
};
