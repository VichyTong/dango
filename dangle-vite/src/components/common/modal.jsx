import PropTypes from "prop-types";

function CloseButton({ onClick }) {
  return (
    <button
      type="button"
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 "
      onClick={onClick}
    >
      <svg
        className="h-3 w-3"
        aria-hidden="true"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
      <span className="sr-only">Close modal</span>
    </button>
  );
}
function ModalTitle({ title }) {
  return <h3 className="text-xl font-semibold text-gray-900">{title}</h3>;
}
function ButtonsGroup({ onClose }) {
  return (
    <div className="flex items-center rounded-b border-t border-gray-200 p-4  md:p-5">
      <button
        type="button"
        className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 "
        onClick={onClose}
      >
        OK
      </button>
    </div>
  );
}
function Modal({ isOpen, onClose, title, children, allowButtons }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="relative max-h-full w-full max-w-2xl p-4">
        <div className="relative rounded-lg bg-white shadow ">
          <div className="flex items-center justify-between rounded-t border-b p-4  md:p-5">
            <ModalTitle title={title} />
            <CloseButton onClick={onClose} />
          </div>
          <div className="space-y-4 p-4 md:p-5">{children}</div>

          {allowButtons && <ButtonsGroup onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
