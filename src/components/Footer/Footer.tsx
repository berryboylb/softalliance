
import { Suspense } from "react";
import Styles from "./css/style.module.css";
const Footer = () => {
  return (
    <Suspense>
      <footer className={Styles.footer}>
        <p>© 2022 SoftSuite. All rights reserved.</p>
        <a href="mailto:support@softsuite.com">support@softsuite.com</a>
      </footer>
    </Suspense>
  );
};

export default Footer;
