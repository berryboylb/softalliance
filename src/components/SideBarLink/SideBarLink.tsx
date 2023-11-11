import { Suspense, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "../../utils";
import Styles from "./css/style.module.css";

type Icon = {
  isIconMode?: boolean;
  onClick?: () => void;
};

type Props = Link & Icon;

function SidebarLink({
  path,
  title,
  icon,
  isIconMode = false,
  subLinks,
  onClick,
}: Props) {
  const { pathname } = useLocation();

  const [subLinksState, setSubLinksState] = useState<boolean>(false);
  const toggleSublinks = (): void => setSubLinksState(!subLinksState);
  const body = (
    <div className={Styles.cont}>
      <>
        {isIconMode ? (
          <FontAwesomeIcon className={Styles.iconBig} icon={icon} />
        ) : (
          <FontAwesomeIcon className={Styles.iconSmall} icon={icon} />
        )}
      </>
      {isIconMode ? null : <span className={Styles.icon}>{title}</span>}
    </div>
  );

  return (
    <Suspense>
      {subLinks && subLinks.length > 0 ? (
        <div
          className={
            pathname.includes(path)
              ? isIconMode
                ? Styles.active_icon_mode
                : Styles.inactive_icon_mode
              : isIconMode
              ? Styles.normal_icon_mode
              : Styles.normal_not_icon_mode
          }
        >
          <div className={Styles.allow}>
            <NavLink className={Styles.linker} to={path}>
              {body}
            </NavLink>
            {!isIconMode && (
              <button className={Styles.button}>
                {" "}
                <FontAwesomeIcon
                  className={Styles.icon}
                  icon={subLinksState ? faChevronUp : faChevronDown}
                  onClick={toggleSublinks}
                />
              </button>
            )}
          </div>
        </div>
      ) : (
        <NavLink
          className={
            pathname === path
              ? isIconMode
                ? Styles.active_icon_mode
                : Styles.inactive_icon_mode
              : isIconMode
              ? Styles.normal_icon_mode
              : Styles.normal_not_icon_mode
          }
          to={path.includes("logout") ? "" : path}
          onClick={
            path.includes("logout") ? () => onClick && onClick() : () => null
          }
        >
          {body}
        </NavLink>
      )}

      {subLinksState &&
        subLinks?.map(({ title, path, icon }, i: number) => (
          <NavLink
            key={i}
            onClick={() => setSubLinksState(true)}
            className={
              pathname === path
                ? isIconMode
                  ? Styles.active_icon_mode_sublink
                  : Styles.inactive_icon_mode_sublink
                : isIconMode
                ? Styles.normal_icon_mode_sublink
                : Styles.normal_not_icon_mode_sublink
            }
            to={path}
          >
            <div>
              {isIconMode ? (
                <FontAwesomeIcon className={Styles.iconBig} icon={icon} />
              ) : (
                <span className={Styles.title}>{title}</span>
              )}
            </div>
          </NavLink>
        ))}
    </Suspense>
  );
}

export default SidebarLink;
