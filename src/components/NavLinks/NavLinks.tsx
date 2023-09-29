import React, { Suspense } from "react";
// import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Styles from "./css/style.module.css";
export default function NavHeader({
  currentOption,
}: {
  currentOption: string;
}) {
  //   const router = useRouter();
  const { pathname } = useLocation();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <Suspense>
      <div className={Styles.cont}>
        <button
          className={Styles.big}
          // onClick={() => router.push("/")}
        >
          {currentOption || "Payroll management"}
        </button>

        {pathSegments.map((segment, index) => (
          <React.Fragment key={segment}>
            <FontAwesomeIcon className={Styles.icon} icon={faChevronRight} />

            <span
              className={
                index === pathSegments.length - 1
                  ? Styles.link_active
                  : Styles.link
              }
            >
              {segment.replace(/%20/g, " ")}
            </span>
          </React.Fragment>
        ))}
      </div>
    </Suspense>
  );
}
