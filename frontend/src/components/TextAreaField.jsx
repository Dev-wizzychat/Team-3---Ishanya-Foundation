const TextAreaField = ({ label, name, register, validation, errors }) => (
    <div className="relative z-0 w-full mb-5 group">
      <textarea
        {...register(name, validation)}
        className={`block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
      />
      <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
        {label}
      </label>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
    </div>
  );
  export default TextAreaField;