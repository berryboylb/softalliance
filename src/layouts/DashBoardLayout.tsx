import React, { Suspense } from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";
import BackButton from "../components/BackButton/BackButton";
import Styles from "./css/style.module.css";
const SideBar = React.lazy(() => import("../components/Sidebar/Sidebar"));
const NavLinks = React.lazy(() => import("../components/NavLinks/NavLinks"));
const Header = React.lazy(() => import("../components/Header/Header"));
const ConfirmDialogue = React.lazy(
  () => import("../components/ConfirmDialogue/ConfirmDialogue")
);
const Footer = React.lazy(() => import("../components/Footer/Footer"));
const PagTitle = React.lazy(() => import('../components/PageTitle/PageTitle'))

const item: boolean =
  localStorage.getItem("expand") && JSON.parse(localStorage.expand);
const choice: string =
  localStorage.getItem("choice") && JSON.parse(localStorage.choice);
console.log(typeof item);
const org: string =
  localStorage.getItem("organization") && JSON.parse(localStorage.organization);
console.log(typeof item);
const DashboardLayout = () => {
  const [modal, setModal] = React.useState<boolean>(false);
  const [expand, setExpand] = React.useState<boolean>(item);
  const [mobileNav, setmobileNav] = React.useState<boolean>(false);
  const [currentOption, setCurrentOption] = React.useState<string>(choice);
  const [organization, setOrganization] = React.useState<string>(org);
  const toggleOrganization = (organization: string): void =>
    setOrganization(() => {
      localStorage.setItem("organization", JSON.stringify(organization));
      return JSON.parse(localStorage.organization);
    });
  const toggleCurrentOption = (choice: string): void =>
    setCurrentOption(() => {
      localStorage.setItem("choice", JSON.stringify(choice));
      return JSON.parse(localStorage.choice);
    });
  const toggleExpand = (): void =>
    setExpand((prev) => {
      localStorage.setItem("expand", JSON.stringify(!prev));
      return JSON.parse(localStorage.expand);
    });
  const toggleModal = (): void => setModal(!modal);
  const isMobile: boolean = useMediaQuery({ query: `(max-width: 768px)` });
   const isNavMobile: boolean = useMediaQuery({ query: `(max-width: 1024px)` });
  const handleMobileNav = () => {
    if (isNavMobile) {
      setmobileNav(!mobileNav);
    }
  };
  return (
    <Suspense>
      <div className={Styles.layout}>
        <SideBar
          onclick={toggleExpand}
          expand={expand}
          mobileNav={mobileNav}
          handleLogout={toggleModal}
          currentOption={currentOption}
          toggleCurrentOption={toggleCurrentOption}
        />
        <div
          className={
            isMobile
              ? `my-container ${Styles.bg}`
              : Styles.expanded
          }
        >
          <div className={Styles.limit}>
            <Header
              mobileNav={mobileNav}
              handleMobileNav={handleMobileNav}
              handleLogout={toggleModal}
              toggleOrganization={toggleOrganization}
              organization={organization}
            />{" "}
            <NavLinks currentOption={currentOption} />
            <div className={Styles.bg}>
              <BackButton />
              <PagTitle />
              <ConfirmDialogue
                title=":( Logout?"
                open={modal}
                onClose={() => setModal(false)}
                onConfirm={() => {
                  //call the function to logout the user
                }}
              >
                Are you sure you want to log out?
              </ConfirmDialogue>
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Suspense>
  );
};

export default DashboardLayout;
