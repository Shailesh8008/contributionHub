import { type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
}

export default function Modal({ isOpen, children }: ModalProps) {
  if (!isOpen) return null;

  const portalElement = document.getElementById("portal");
  if (!portalElement) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card border border-gray-700/50 p-8 rounded-lg max-w-sm w-full mx-4">
        {children}
      </div>
    </div>,
    portalElement,
  );
}
