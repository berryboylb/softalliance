import { Suspense } from "react";
import { useLocation } from "react-router-dom";
import Styles from "./css/style.module.css";

export default function PagTitle() {
  const { pathname } = useLocation();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const lastSegment = pathSegments[pathSegments.length - 1];

  return (
    <Suspense>
      <div className={Styles.cont}>
        <h3 className={Styles.link_active}>
          {lastSegment || "Dashboard"}
        </h3>
      </div>
    </Suspense>
  );
}
