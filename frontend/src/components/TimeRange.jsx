function TimeRangePicker({ label, nameFrom, nameUntil, register, validation, errors }) {
    return (
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-1">{label}</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            {...register(nameFrom, validation)}
            className="border p-2 rounded-md"
          />
          <input
            type="time"
            {...register(nameUntil, validation)}
            className="border p-2 rounded-md"
          />
        </div>
        {errors[nameFrom] && <span className="text-red-500 text-sm">{errors[nameFrom].message}</span>}
        {errors[nameUntil] && <span className="text-red-500 text-sm">{errors[nameUntil].message}</span>}
      </div>
    );
  }
  
  export default TimeRangePicker;
  