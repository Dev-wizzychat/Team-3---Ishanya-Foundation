import { useState } from "react";

const FileUpload = ({ label, name, register, validation  , accept}) => {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you can add file validation logic if necessary
      setUploadSuccess(true); // Set to true when a file is successfully uploaded
    }
  };

  return (
    <div className="w-full flex flex-col items-center mb-5">
    {label && <label htmlFor={name}   className="font-medium text-black-700 mb-1">{label}</label>}
      <label
        htmlFor={name}
        className="relative flex flex-row items-center justify-start w-full h-32 border-4 border-black border-dashed rounded-lg cursor-pointer bg-black hover:bg-gray-800 px-4"
      >
        <div className="flex flex-row items-center justify-center gap-4">
          <svg
            className="w-8 h-8 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <div>
            <p className="text-sm text-white font-semibold">Click to upload or drag and drop</p>
            <p className="text-xs text-white">PDF only (Max size: 2MB)</p>
          </div>
        </div>
        <input
          id="dropzone-file"
          type="file"
          {...register(name, validation)}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
      </label>

      {uploadSuccess && (
        <p className="text-green-500 text-sm mt-2">File successfully uploaded!</p>
      )}
    </div>
  );
};

export default FileUpload;
