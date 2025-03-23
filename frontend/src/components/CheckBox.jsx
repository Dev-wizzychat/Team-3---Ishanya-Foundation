import { useState } from "react";

const CheckboxGroup = ({ label, name, options, register }) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleSelection = (event) => {
    const { value, checked } = event.target;

    if (value === "All") {
      setSelectedValues(checked ? options : []);
    } else {
      let updatedValues = checked
        ? [...selectedValues, value]
        : selectedValues.filter((item) => item !== value);

      if (updatedValues.length === options.length - 1) {
        updatedValues = options;
      } else if (updatedValues.includes("All")) {
        updatedValues = updatedValues.filter((item) => item !== "All");
      }

      setSelectedValues(updatedValues);
    }
  };

  return (
    <div className="relative z-0 w-full mb-5 group">
      <label className="text-sm font-medium text-black">{label}</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={option}
              {...register(name)}
              checked={selectedValues.includes(option)}
              onChange={handleSelection}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-black">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
