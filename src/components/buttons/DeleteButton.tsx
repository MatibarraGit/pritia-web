import { Trash2 } from "lucide-react";
import { Button } from "../ui";

export const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      className="center-flex"
      variant="destructive"
      onClick={() => onClick()}
    >
      <Trash2 size={18} color="red" />
    </Button>
  );
};

