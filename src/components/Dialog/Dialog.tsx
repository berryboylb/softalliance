import ExitIcon from "../ExitIcon/ExitIcon";
import IconButton from "../IconButton/IconButton";
interface Props {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}
export default function Dialog(props: Props) {
  const { open, onClose } = props;
  if (!open) {
    return <></>;
  }
  return (
    <div className="fixed inset-0 z-[9999999999999999999999] overflow-auto bg-[rgba(0,0,0,0.4)] flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <div>{props.children}</div>
        <span className="absolute top-0 right-0 p-4">
          <IconButton onClick={() => onClose()}>
            <ExitIcon />
          </IconButton>
        </span>
      </div>
    </div>
  );
}
