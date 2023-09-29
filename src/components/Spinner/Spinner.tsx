import { BounceLoader, PacmanLoader } from "react-spinners";
import { useMediaQuery } from "react-responsive";
import Styles from "./css/style.module.css";
type Props = {
  toggle?: boolean;
};

const Index: React.FC<Props> = ({ toggle }) => {
  const isMobile: boolean = useMediaQuery({ query: `(max-width: 768px)` });
  return (
    <div className={toggle ? Styles.big : Styles.small}>
      {toggle ? (
        <PacmanLoader
          data-testid="full-loader"
          color="#716767"
          loading={true}
          size={isMobile ? 15 : 30}
        />
      ) : (
        <BounceLoader
          data-testid="free-loader"
          color="#716767"
          loading={true}
          size={isMobile ? 15 : 30}
        />
      )}
    </div>
  );
};

Index.defaultProps = {
  toggle: true,
};

export default Index;
