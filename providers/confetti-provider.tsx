import { useConfettiStore } from "@/hooks/use-confetti-store";
import ReactConfetti from "react-confetti";

export const ConfettiProvider = () => {
  const confetti = useConfettiStore();

  if (!confetti.isOpen) return null;

  return (
    <ReactConfetti
      numberOfPieces={550}
      recycle={false}
      onConfettiComplete={() => confetti.onClose()}
    />
  );
};
