import { useForm } from "react-hook-form";
import { useState } from "react";
import CheckboxGroup from "../components/CheckBox";
import SubmitButton from "../components/SubmitButton";
import InputField from "../components/InputField";
import TextAreaField from "../components/TextAreaField";
import FileUploadPreview from "../components/FileUploadPreview";
import TimeRangePicker from "../components/TimeRange";
import FileUpload from "../components/FileUpload";
import SelectField from "../components/SelectField";

const daysOfWeek = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function EnrollForm() {
  const { register, handleSubmit, formState: { errors } , watch } = useForm({ mode: "onBlur" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [file, setFile] = useState();

  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmissionMessage("");

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Submission failed");

      setSubmissionMessage("Successfully submitted");
    } catch (error) {
      setSubmissionMessage("Try again");
    }

    setIsSubmitting(false);
  };

  const handleMouseMove = (e) => {
    const { clientX: mouseX, clientY: mouseY } = e;
    document.querySelector('.enroll-card').style.backgroundPosition = `${mouseX / 10}px ${mouseY / 10}px`;
  };

  return (
    <div
      className="enroll-card max-w-4xl mx-auto p-4 bg-responsive"
      onMouseMove={handleMouseMove}
      style={{
        backgroundImage: "url('your-image-url.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        transition: "background-position 0.1s ease, transform 0.3s ease",
      }}
    >
      <div className="max-w-4xl mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Enrollment Form</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
            <FileUploadPreview label="Upload Photo" name="photo" register={register} validation={{ required: "Photo is required" }} errors={errors} accept="image/png,image/jpeg,image/jpg" />
          </div>
          <InputField label="Name" type="text" name="name" register={register} validation={{ required: "Name is required", pattern: { value: /^[A-Za-z ]+$/i, message: "Invalid name" } }} errors={errors} />
          <SelectField label="Select Gender" name="gender" register={register} validation={{ required: "Gender is required" }} options={["Male", "Female", "Other"]} errors={errors} />
          <InputField label="Father's Name" type="text" name="father_name" register={register} validation={{ required: "Required", pattern: { value: /^[A-Za-z ]+$/i, message: "Invalid name" } }} errors={errors} />
          <InputField label="Mother's Name" type="text" name="mother_name" register={register} validation={{ required: "Required", pattern: { value: /^[A-Za-z ]+$/i, message: "Invalid name" } }} errors={errors} />
          <InputField label="Student Email ID" type="email" name="student_email" register={register} validation={{ required: "Email is required" }} errors={errors} />
          <InputField label="Parent Email ID" type="email" name="parent_email" register={register} validation={{ required: "Required" }} errors={errors} />
          <InputField label="Contact Number" type="number" name="contact_number" register={register} validation={{ required: "Required", pattern: { value: /^[0-9]{10}$/, message: "Invalid number" } }} errors={errors} />
          <InputField label="Alternate Contact Number" type="number" name="alt_contact_number" register={register} validation={{ required: "Required", pattern: { value: /^[0-9]{10}$/, message: "Invalid number" } }} errors={errors} />
          <TextAreaField label="Address" name="address" register={register} validation={{ required: "Required" }} errors={errors} />
          <InputField label="Pin Code" type="number" name="pincode" register={register} validation={{ required: "Required", pattern: { value: /^[0-9]{6}$/, message: "Invalid pin" } }} errors={errors} />
          <InputField label="Date of Birth" type="date" name="dob" register={register} validation={{ required: "Date of Birth is required" }} errors={errors} />
          <SelectField label="Select Blood Group" name="blood_group" register={register} validation={{ required: "Blood Group is required" }} options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} errors={errors} />
          <SelectField label="Comorbidity?" name="comorbidity" register={register} validation={{ required: "Selection is required" }} options={["Yes", "No"]} errors={errors} />
          <SelectField label="UDID?" name="udid" register={register} validation={{ required: "Selection is required" }} options={["Yes", "No"]} errors={errors} />
          <InputField label="Primary Diagnosis" type="text" name="diagnosis" register={register} validation={{ required: "Diagnosis is required" }} errors={errors} />
          <TextAreaField label="Allergies" name="allergies" register={register} errors={errors} />
          <CheckboxGroup label="Days Attending" name="days_attending" options={daysOfWeek} register={register} />
          <TimeRangePicker label="Available Timings" nameFrom="available_from" nameUntil="available_until" register={register} validation={{ required: "Time is required" }} errors={errors} />
          <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
            <div className="w-64 h-32 flex justify-center items-center">
              <FileUpload label="Health report" name="document" register={register} validation={{ required: "Document is required" }} errors={errors} accept="application/pdf" />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnrollForm;
