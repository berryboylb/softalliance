import { useState } from "react";
import Styles from "./css/styles.module.css";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { monthsArray } from "../../constants";
import useDataFetching from "./useFetchLookups";
const CreateElementForm = () => {
  const { payrun, classification, category } = useDataFetching();
  const formSchema = z
    .object({
      name: z.string().min(3),
      categoryValueId: z.number().positive(),
      classificationValueId: z.number().positive(),
      payRunValueId: z.number().positive(),
      description: z.string().min(3),
      reportingName: z.string().min(3),
      effectiveStartDate: z
        .string()
        .refine((date) => /\d{4}-\d{2}-\d{2}/.test(date), {
          message: "Invalid date format. Please use YYYY-MM-DD.",
        })
        .refine(
          (date) => {
            const currentDate = new Date();
            const selectedDate = new Date(date);
            return selectedDate >= currentDate;
          },
          {
            message:
              "Effective start date must be the current day or a future date.",
          }
        ),
      effectiveEndDate: z
        .string()
        .refine((date) => /\d{4}-\d{2}-\d{2}/.test(date), {
          message: "Invalid date format. Please use YYYY-MM-DD.",
        }),
      processingType: z.enum(["open", "closed"]),
      payFrequency: z.enum(["selectedMonths", "monthly"]),
      prorate: z.enum(["yes", "no"]),
      status: z.enum(["active", "inactive"]),
      selectedMonths: z.array(z.string()).min(1).optional(),
    })
    .refine(
      (data) => {
        const startDate = new Date(data.effectiveStartDate);
        const endDate = new Date(data.effectiveEndDate);
        return endDate >= startDate;
      },
      {
        message: "End Date must be after start date",
        path: ["effectiveEndDate"],
      }
    );
  type FormSchmaType = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormSchmaType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchmaType> = async (data) => {
    console.log({
      ...data,
      modifiedBy: "olorunfemi Daramola",
      categoryId: 1,
      classificationId: 2,
      payRunId: 5,
    });
  };

  const [checked, setChecked] = useState(false);
  const handleToggle = () =>
    setChecked((k) => {
      if (k) {
        setValue("status", "active");
      } else {
        setValue("status", "inactive");
      }
      return !k;
    });
  const step1 = (
    <>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="name" className={Styles.label}>
            Name
          </label>
          <input
            className={Styles.input}
            aria-label="name"
            placeholder="Input Name"
            type="text"
            id="name"
            {...register("name", { required: "This is required." })}
            disabled={isSubmitting}
          />

          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
        <div className={Styles.item}>
          <label htmlFor="classification" className={Styles.label}>
            Element Classification
          </label>
          <select
            placeholder="Select Classification"
            className={Styles.select}
            id="classification"
            {...register("classificationValueId", {
              required: "This is required.",
              valueAsNumber: true,
            })}
          >
            <option value="">Select Classification</option>
            {classification &&
              classification.length > 0 &&
              classification.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name="classificationValueId"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      </div>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="name" className={Styles.label}>
            Element Category
          </label>
          <select
            placeholder="Select Element Category"
            className={Styles.select}
            id="category"
            {...register("categoryValueId", {
              required: "This is required.",
              valueAsNumber: true,
            })}
          >
            <option value="">Select Element Category</option>
            {category &&
              category.length > 0 &&
              category.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

          <ErrorMessage
            errors={errors}
            name="categoryValueId"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
        <div className={Styles.item}>
          <label htmlFor="Payrun" className={Styles.label}>
            Payrun
          </label>
          <select
            className={Styles.select}
            id="Payrun"
            placeholder="Select Payrun"
            {...register("payRunValueId", {
              required: "This is required.",
              valueAsNumber: true,
            })}
          >
            <option value="">Select Payrun</option>
            {payrun &&
              payrun.length > 0 &&
              payrun.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name="payRunValueId"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      </div>
      <div className={Styles.textarea}>
        <label htmlFor="description" className={Styles.label}>
          Description
        </label>
        <textarea
          id="description"
          placeholder="Input Description"
          className={Styles.text}
          {...register("description", {
            required: "This is required.",
          })}
        />

        <ErrorMessage
          errors={errors}
          name="description"
          render={({ message }) => <p className={Styles.error}>{message}</p>}
        />
      </div>

      <div className={Styles.textarea}>
        <label htmlFor="reportingName" className={Styles.label}>
          Reporting Name
        </label>
        <textarea
          id="reportingName"
          placeholder="Input Reporting Name"
          className={Styles.text}
          {...register("reportingName", {
            required: "This is required.",
          })}
        />

        <ErrorMessage
          errors={errors}
          name="reportingName"
          render={({ message }) => <p className={Styles.error}>{message}</p>}
        />
      </div>
    </>
  );
  const step2 = (
    <>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="effectiveStartDate" className={Styles.label}>
            Effective Start Date
          </label>
          <input
            className={Styles.input}
            aria-label="effectiveStartDate"
            placeholder="Input Name"
            type="date"
            id="effectiveStartDate"
            {...register("effectiveStartDate", {
              required: "This is required.",
            })}
            disabled={isSubmitting}
          />

          <ErrorMessage
            errors={errors}
            name="effectiveStartDate"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
        <div className={Styles.item}>
          <label htmlFor="effectiveEndDate" className={Styles.label}>
            Effective End Date
          </label>
          <input
            className={Styles.input}
            aria-label="effectiveEndDate"
            placeholder="Input Name"
            type="date"
            id="effectiveEndDate"
            {...register("effectiveEndDate", {
              required: "This is required.",
            })}
            disabled={isSubmitting}
          />
          <ErrorMessage
            errors={errors}
            name="effectiveEndDate"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      </div>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="effectiveStartDate" className={Styles.label}>
            Processing Type
          </label>
          <div className={Styles.pan}>
            <label>
              <span>Open</span>

              <input
                type="radio"
                value="open"
                {...register("processingType", {
                  required: "This is required.",
                })}
              />
            </label>
            <label>
              <span> Closed</span>

              <input
                type="radio"
                value="closed"
                {...register("processingType", {
                  required: "This is required.",
                })}
              />
            </label>
          </div>

          <ErrorMessage
            errors={errors}
            name="processingType"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>

        <div className={Styles.item}>
          <label htmlFor="payFrequency" className={Styles.label}>
            Pay Frequency
          </label>
          <div className={Styles.pan}>
            <label>
              <span>Monthly</span>

              <input
                id="payFrequency"
                type="radio"
                value="monthly"
                {...register("payFrequency", {
                  required: "This is required.",
                })}
              />
            </label>
            <label>
              <span> Selected Months</span>

              <input
                id="payFrequency"
                type="radio"
                value="selectedMonths"
                {...register("payFrequency", {
                  required: "This is required.",
                })}
              />
            </label>
          </div>

          <ErrorMessage
            errors={errors}
            name="payFrequency"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      </div>

      {
        <div className={Styles.months}>
          <label htmlFor="payFrequency" className={Styles.label}>
            Selected Pay Months
          </label>
          <select name="selectedMonth">
            <option value="">Select </option>
            {monthsArray.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>

          <ErrorMessage
            errors={errors}
            name="selectedMonths"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      }

      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="prorate" className={Styles.label}>
            Prorate
          </label>
          <div className={Styles.pan}>
            <label>
              <span>Yes</span>

              <input
                type="radio"
                value="yes"
                {...register("prorate", {
                  required: "This is required.",
                })}
              />
            </label>
            <label>
              <span> No</span>

              <input
                type="radio"
                value="no"
                {...register("prorate", {
                  required: "This is required.",
                })}
              />
            </label>
          </div>

          <ErrorMessage
            errors={errors}
            name="prorate"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>

        <div className={Styles.item}>
          <label htmlFor="status" className={Styles.label}>
            Status
          </label>
          <div className={Styles.pan_}>
            <label
              className={`${Styles.switch} ${
                checked ? Styles.active_switch : ""
              }`}
            >
              <input
                type="checkbox"
                className={Styles.none}
                checked={checked}
                onChange={handleToggle}
              />
              {/* <span className="block w-10 h-5 bg-gray-300 rounded-full shadow-inner" /> */}
              <span
                className={`${Styles.normal} ${checked ? Styles.active : ""}`}
              />
            </label>

            <span className={Styles.status}>
              {checked ? "Active" : "Inactive"}
            </span>
          </div>

          <ErrorMessage
            errors={errors}
            name="status"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      </div>
    </>
  );
  const steps = [
    { title: "Element Details", content: step1 },
    { title: "Additional Details", content: step2 },
  ];
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = async () => {
    try {
      const resName = await trigger("name");
      const resclassification = await trigger("classificationValueId");
      const rescategory = await trigger("categoryValueId");
      const respayrun = await trigger("payRunValueId");
      const resDescription = await trigger("description");
      const resReportingName = await trigger("reportingName");
      if (
        resName &&
        resclassification &&
        rescategory &&
        respayrun &&
        resDescription &&
        resReportingName
      )
        setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        console.error(`Validation error:`, error.message);
      }
      return error;
    }

    // setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  return (
    <div>
      <h2 className={Styles.title}>Create Element</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={Styles.step}>
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={() => handleStepClick(index)}
              className={`${Styles.md_step} ${
                index === activeStep ? "active" : "inactive"
              }`}
            >
              <h2
                className={
                  index === activeStep
                    ? Styles.step_title_active
                    : Styles.step_title_normal
                }
              >
                {step.title}
              </h2>
              <div
                className={
                  index !== activeStep
                    ? Styles.md_step_circle_active
                    : Styles.md_step_circle_normal
                }
              >
                <span>{index + 1}</span>
              </div>

              <div
                className={
                  activeStep >= index
                    ? Styles.md_step_bar_left_active
                    : Styles.md_step_bar_left
                }
              ></div>
              <div
                className={
                  activeStep > index
                    ? Styles.md_step_bar_right_active
                    : Styles.md_step_bar_right
                }
              ></div>
            </div>
          ))}
        </div>
        <div>{steps[activeStep].content}</div>
        <div className={Styles.btn__}>
          <button
            className={Styles.back}
            type="button"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </button>
          {activeStep === steps.length - 1 ? (
            <button className={Styles.normal_} type="submit">
              Submit
            </button>
          ) : (
            <div
              className={Styles.normal_}
              onClick={handleNext}
              // disabled={activeStep === steps.length - 1}
            >
              Next
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateElementForm;
