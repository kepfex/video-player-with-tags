import { useEffect } from "react";

type useKeyboardNavigationProps = {
  onSpace: () => void;
  onArrowRight: () => void;
  onArrowLeft: () => void;
}

export const useKeyboardNavigation = ({
  onSpace,
  onArrowRight,
  onArrowLeft
}: useKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitamos el comportamiento por defecto (scroll) para estas teclas
      const keys = ["Space", "ArrowRight", "ArrowLeft"];
      if (keys.includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case "Space":
          onSpace();
          break;
        case "ArrowRight":
          onArrowRight();
          break;
        case "ArrowLeft":
          onArrowLeft();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSpace, onArrowRight, onArrowLeft]);
};