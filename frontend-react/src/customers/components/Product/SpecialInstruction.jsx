// SpecialInstruction.jsx

const SpecialInstruction = () => (
  <div className="bg-white mt-3 border-t border-gray-100 p-5 rounded-lg shadow-sm">
    <div
      className="flex justify-between items-center cursor-pointer"
      // onClick={onToggle}
    >
      <h2 className="text-lg font-bold text-gray-800">Ghi chú</h2>
    </div>
    <textarea
      className="w-full text-black mt-3 p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
      rows="3"
      placeholder="Ví dụ: không hành, không ớt..."
      // value={notes}
      // onChange={(e) => setNotes(e.target.value)}
    />
  </div>
);

export default SpecialInstruction;
