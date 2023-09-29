import React, { Suspense } from "react";
import { Logo } from "../../assets";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import {
  faChevronLeft,
  faChevronRight,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dashBoardLinks, utilsLinks } from "../../constants";
import Styles from "./css/style.module.css";
import { options } from "../../constants";
const SideBarLink = React.lazy(() => import("../SideBarLink/SideBarLink"));
const Switch = React.lazy(() => import("../SwitchModule/SwitchModule"));
type Props = {
  mobileNav: boolean;
  expand: boolean;
  onclick: () => void;
  handleLogout?: () => void;
  currentOption: string;
  toggleCurrentOption: (choice:string) => void
};

const Index: React.FC<Props> = ({
  mobileNav,
  expand,
  onclick,
  handleLogout,
  currentOption,
  toggleCurrentOption,
}): JSX.Element => {
  const isMobile: boolean = useMediaQuery({ query: `(max-width: 768px)` });
  return (
    <Suspense>
      <div
        className={expand ? Styles.sidebar_collasped : Styles.sidebar_expanded}
      >
        <button className={Styles.btn} onClick={onclick}>
          <FontAwesomeIcon icon={expand ? faChevronLeft : faChevronRight} />
        </button>
      </div>
      <div
        className={
          isMobile
            ? mobileNav
              ? Styles.mobileNav
              : Styles.notMobileNav
            : expand
            ? Styles.inner_
            : Styles.innerr_
        }
      >
        <Link
          to="/dashboard"
          className={expand ? Styles.logo_collapse : Styles.logo_expand}
        >
          <img src={Logo} alt="Soft Allaince" />
        </Link>

        <div className={Styles.list}>
          <Switch
            mainIcon={faLocationArrow}
            title="Switch Module"
            header={currentOption || "Payroll Management"}
            links={options}
            action={toggleCurrentOption}
          />
          {dashBoardLinks &&
            dashBoardLinks.map((link, i) => (
              <SideBarLink key={i} isIconMode={expand} {...link} />
            ))}
        </div>
        <hr className={Styles.rule} />
        <div className={Styles.utils_list}>
          {utilsLinks &&
            utilsLinks.map((link, i) => (
              <SideBarLink
                key={i}
                isIconMode={expand}
                onClick={handleLogout}
                {...link}
              />
            ))}
        </div>
      </div>
    </Suspense>
  );
};

export default Index;
