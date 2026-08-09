
export const ReturnEditDialogue = ({
  isOpen,
  onClose,
  returnRequest,
  status,
  note,
  onStatusChange,
  onNoteChange,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg">
        <div className="w-full overflow-hidden rounded-xl bg-white font-sans">
          <div className="flex items-center justify-between rounded-t-xl bg-[#4F30A9] px-6 py-4">
            <h2 className="m-0 text-[15px] font-semibold text-white">Update Return Status</h2>
          </div>

          <div className="px-6 py-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Resolution Note</label>
                <textarea
                  placeholder="Add a note about this return..."
                  value={note}
                  onChange={(e) => onNoteChange(e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300 min-h-[80px]"
                />
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  className="rounded-lg bg-[#4F30A9] px-5 py-2 text-sm text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};