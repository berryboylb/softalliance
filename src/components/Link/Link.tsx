import { Link } from 'react-router-dom';
import Style from './css/style.module.css'
const LinkComp = () => {
  return (
    <div>
      <Link to="/elements/element" className={Style.details}>Go To Elements</Link>
    </div>
  );
}

export default LinkComp;
