import { Suspense } from "react";
import Dialog from "../Dialog/Dialog";
import Button from "../LogoutButton/LogoutButton";
interface Props {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export default function Confirm(props: Props) {
  const { open, onClose, title, children, onConfirm } = props;
  if (!open) {
    return <></>;
  }

  return (
    <Suspense>
      <Dialog open={open} onClose={onClose}>
        <h2 className="text-xl text-black">{title}</h2>
        <div className="py-5 text-black">{children}</div>
        <div className="flex justify-end">
          <div className="p-1">
            <Button
              onClick={() => onClose()}
              className="bg-[#2CC213] hover:opacity-80"
            >
              No
            </Button>
          </div>
          <div className="p-1">
            <Button
              onClick={() => {
                onClose();
                onConfirm();
              }}
              className="bg-[#FF3B30] hover:opacity-80"
            >
              Yes
            </Button>
          </div>
        </div>
      </Dialog>
    </Suspense>
  );
}
