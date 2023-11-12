import { Suspense } from "react";
import { useLocation } from "react-router-dom";
import Styles from "./css/style.module.css";

export default function PagTitle() {
  const { pathname } = useLocation();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const lastSegment = Number(pathSegments[pathSegments.length - 1])
    ? pathSegments[pathSegments.length - 2]
    : pathSegments[pathSegments.length - 1];
  const formattedSegment = lastSegment
    ? lastSegment.replace(/-/g, " ")
    : "Dashboard";
  return (
    <Suspense>
      <div className={Styles.cont}>
        <h3 className={Styles.link_active}>{formattedSegment}</h3>
      </div>
    </Suspense>
  );
}
