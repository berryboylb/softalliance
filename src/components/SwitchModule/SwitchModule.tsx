import React, { Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Styles from "./css/style.module.css";

type Props = {
  mainIcon: IconDefinition;
  header: string;
  title: string;
  links: Array<string>;
  action: (string: string) => void;
  background?: string
};

const SwitchModule = (props: Props) => {
  const [linksVisible, setLinksVisible] = React.useState<boolean>(false);
  const toggle = (): void => setLinksVisible((link) => !link);

  return (
    <Suspense>
      <div className={Styles.container} style={{ background: props.background }}>
        <div className={Styles.flex}>
          <FontAwesomeIcon className={Styles.iconBig} icon={props.mainIcon} />
          <div className={Styles.content}>
            <p>{props.title}</p>
            <h1>{props.header}</h1>
          </div>

          <button className={Styles.button}>
            {" "}
            <FontAwesomeIcon
              className={Styles.icon}
              icon={linksVisible ? faChevronUp : faChevronDown}
              onClick={toggle}
            />
          </button>
        </div>

        {linksVisible && (
          <div className={Styles.list}>
            {props.links &&
              props.links.length > 0 &&
              props.links.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    props.action(item), toggle();
                  }}
                >
                  {item}
                </button>
              ))}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default SwitchModule;
