import toast from "react-hot-toast";

interface ConfirmToastOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

export function confirmToast({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}: ConfirmToastOptions) {
  return toast((t) => (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-600 text-sm font-bold">!</span>
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        {message && <p className="text-xs text-gray-600 mt-1">{message}</p>}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: "top-center",
  });
}
