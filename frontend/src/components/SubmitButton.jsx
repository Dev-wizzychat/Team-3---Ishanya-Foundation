const SubmitButton = ({ isSubmitting }) => (
    <div className="flex justify-center mt-6">
      <button 
        type="submit"
        className="px-6 py-2 text-base bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
  
  export default SubmitButton;
  