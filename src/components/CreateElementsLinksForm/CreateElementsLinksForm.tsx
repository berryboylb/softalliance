import { useState, useEffect } from "react";
import Styles from "../CreateElementForm/css/styles.module.css";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import useFetchData from "./useFetchData";
import Spinner from "../Spinner/Spinner";
import { add } from "../../store/reducers/elementslink-reducer";
import { useAppDispatch } from "../../store/hooks";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { handleBeforeUnload } from "../../utils";
export const lookupSchema = z.object({
  lookupId: z.number(),
  lookupValueId: z.number(),
});

const CreateElementsLinksForm = ({
  toggle,
  toggleSecond,
}: {
  toggle: () => void;
  toggleSecond: () => void;
}) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const formSchema = z
    .object({
      name: z.string().min(3),
      amountType: z.enum(["fixed", "rated"]),
      amount: z.number().positive().optional(),
      rate: z.number().positive().optional(),
      status: z.enum(["active", "inactive"]).optional(),
      automate: z.enum(["yes", "no"]).optional(),
      suborganizationId: z.number().positive().optional(),
      departmentId: z.number().positive().optional(),
      jobTitleId: z.number().positive().optional(),
      locationId: z.number().positive().optional(),
      employeeTypeValueId: z.number().positive().optional(),
      employeeCategoryValueId: z.number().positive().optional(),
      grade: z.number().positive().optional(),
      gradeStep: z.number().positive().optional(),
      unionId: z.number().positive().optional(),
      additionalInfo: z.array(lookupSchema).optional(),
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
        )
        .optional(),
      effectiveEndDate: z
        .string()
        .refine((date) => /\d{4}-\d{2}-\d{2}/.test(date), {
          message: "Invalid date format. Please use YYYY-MM-DD.",
        })
        .optional(),
    })
    .refine(
      (data) => {
        if (data.amountType === "fixed") {
          return !!data.amount;
        }
        return true;
      },
      {
        message: "Please add an amount",
        path: ["amount"],
      }
    )
    .refine(
      (data) => {
        if (data.amountType === "rated") {
          return !!data.rate;
        }
        return true;
      },
      {
        message: "Please add a rate",
        path: ["rate"],
      }
    )
    .refine(
      (data) => {
        if (data.suborganizationId) {
          if (!!data.departmentId === false) handleRedirects();
          return !!data.departmentId;
        }
        return true;
      },
      {
        message: "Please add a department if you choose a suborganization",
        path: ["departmentId"],
      }
    )
    .refine(
      (data) => {
        if (data.grade) {
          if (!!data.gradeStep === false) handleRedirects();
          return !!data.gradeStep;
        }
        return true;
      },
      {
        message: "Please add a gradeStep when you add a grade",
        path: ["gradeStep"],
      }
    );

  type FormSchmaType = z.infer<typeof formSchema>;
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormSchmaType>({
    resolver: zodResolver(formSchema),
  });

  const subOrganizationid = watch("suborganizationId");
  const deptId = watch("departmentId");
  const gradeId = watch("grade");
  const gradeSteps = watch("gradeStep");
  const addInfo = watch("additionalInfo");
  const {
    subOrganization,
    department,
    jobtitle,
    location,
    employeeType,
    employeeCategory,
    grades,
    steps: stepper,
    union,
    housing,
    pension,
    security,
  } = useFetchData(subOrganizationid, gradeId);
  const handleSelectChange = (value: string, lookupId: number) => {
    if (!value) {
      return setValue(
        "additionalInfo",
        addInfo && addInfo.filter((item) => item.lookupId !== lookupId)
      );
    }

    const newValue = {
      lookupId,
      lookupValueId: Number(value),
    };

    if (addInfo) {
      const existingItemIndex = addInfo.findIndex(
        (item) => item.lookupId === lookupId
      );

      if (existingItemIndex !== -1) {
        const updatedAddInfo = [
          ...addInfo.slice(0, existingItemIndex),
          { ...addInfo[existingItemIndex], lookupValueId: Number(value) },
          ...addInfo.slice(existingItemIndex + 1),
        ];
        setValue("additionalInfo", updatedAddInfo);
      } else {
        setValue("additionalInfo", [newValue, ...addInfo]);
      }
    } else {
      setValue("additionalInfo", [newValue]);
    }
  };

  const onSubmit: SubmitHandler<FormSchmaType> = async (data) => {
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );
    const body = {
      ...cleanedData,
      modifiedBy: "olorunfemi Daramola",
      employeeCategoryId: 3,
      employeeTypeId: 4,
    };
    const values = {
      id: Number(id),
      body,
    };
    dispatch(add(values));
    reset();
    toggle();
    toggleSecond();
     window.removeEventListener("beforeunload", handleBeforeUnload);
  };
  const [checked, setChecked] = useState(false);
  const handleToggle = () =>
    setChecked((k) => {
      if (k) {
        setValue("status", "inactive");
      } else {
        setValue("status", "active");
      }
      return !k;
    });
  const step1 = (
    <>
      <div className={Styles.textarea}>
        <label htmlFor="description" className={Styles.label}>
          Element Link Name
        </label>
        <input
          type="text"
          id="description"
          placeholder="Input Name"
          className={`${Styles.text} ${
            errors.name && errors.name.message && Styles.highlight
          } `}
          {...register("name", { required: "This is required." })}
          disabled={isSubmitting}
        />
        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => <p className={Styles.error}>{message}</p>}
        />
      </div>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="suborganization" className={Styles.label}>
            Suborganization
          </label>
          <select
            className={`${Styles.select} ${
              errors.suborganizationId &&
              errors.suborganizationId.message &&
              Styles.highlight
            }  `}
            id="suborganization"
            {...register("suborganizationId", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          >
            <option value={""}>Select a Suborganization</option>
            {subOrganization && subOrganization.length > 0 ? (
              subOrganization.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))
            ) : (
              <option value="">loading...</option>
            )}
          </select>
          <ErrorMessage
            errors={errors}
            name="suborganizationId"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
        <div className={Styles.item}>
          <label htmlFor="Department" className={Styles.label}>
            Department
          </label>
          <select
            disabled={!subOrganizationid ? true : false}
            className={`${Styles.select} ${
              errors.departmentId &&
              errors.departmentId.message &&
              Styles.highlight
            }`}
            id="Department"
            {...register("departmentId", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          >
            <option value="">Select a Department</option>
            {department &&
              department.length > 0 &&
              department.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name="departmentId"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      </div>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="JobTitle" className={Styles.label}>
            Job Title
          </label>
          <select
            className={`${Styles.select} ${
              errors.jobTitleId && errors.jobTitleId.message && Styles.highlight
            }`}
            id="JobTitle"
            {...register("jobTitleId", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          >
            <option value="">Select a Job Title</option>
            {jobtitle &&
              jobtitle.length > 0 &&
              jobtitle.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name="jobTitleId"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
        <div className={Styles.item}>
          <label htmlFor="Location" className={Styles.label}>
            Location
          </label>
          <select
            className={`${Styles.select} ${
              errors.locationId && errors.locationId.message && Styles.highlight
            }`}
            id="Location"
            {...register("locationId", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          >
            <option value="">Select a Location</option>
            {location &&
              location.length > 0 &&
              location.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name="locationId"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      </div>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="EmployeeType" className={Styles.label}>
            Employee Type
          </label>
          <select
            placeholder="Select Element Category"
            className={`${Styles.select} ${
              errors.employeeTypeValueId &&
              errors.employeeTypeValueId.message &&
              Styles.highlight
            }`}
            id="Employee Type"
            {...register("employeeTypeValueId", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          >
            <option value="">Select an employee Type</option>
            {employeeType &&
              employeeType.length > 0 &&
              employeeType.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name="employeeTypeValueId"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
        <div className={Styles.item}>
          <label htmlFor="EmployeeCategory" className={Styles.label}>
            Employee Category
          </label>
          <select
            className={`${Styles.select} ${
              errors.employeeCategoryValueId &&
              errors.employeeCategoryValueId.message &&
              Styles.highlight
            }`}
            id="EmployeeCategory"
            {...register("employeeCategoryValueId", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          >
            <option value="">Select a Employee Category</option>
            {employeeCategory &&
              employeeCategory.length > 0 &&
              employeeCategory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name="employeeCategoryValueId"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      </div>
    </>
  );
  const step2 = (
    <>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="Grade" className={Styles.label}>
            Grade
          </label>
          <select
            className={`${Styles.select} ${
              errors.grade && errors.grade.message && Styles.highlight
            }`}
            id="Grade"
            {...register("grade", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          >
            <option value="">Select a Grade</option>
            {grades &&
              grades.length > 0 &&
              grades.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

          <ErrorMessage
            errors={errors}
            name="grade"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
        <div className={Styles.item}>
          <label htmlFor="GradeStep" className={Styles.label}>
            Grade Step
          </label>
          <select
            disabled={!watch("grade") ? true : false}
            className={`${Styles.select} ${
              errors.gradeStep && errors.gradeStep.message && Styles.highlight
            }`}
            id="GradeStep"
            {...register("gradeStep", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          >
            <option value="">Select a Grade Step</option>
            {stepper &&
              stepper.length > 0 &&
              stepper.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name="gradeStep"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      </div>
      <div className={Styles.textarea}>
        <label htmlFor="Union" className={Styles.label}>
          Union
        </label>
        <select
          className={`${Styles.select} ${
            errors.unionId && errors.unionId.message && Styles.highlight
          }`}
          id="Union"
          {...register("unionId", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
        >
          <option value="">Select a Union</option>
          {union &&
            union.length > 0 &&
            union.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>

        <ErrorMessage
          errors={errors}
          name="unionId"
          render={({ message }) => <p className={Styles.error}>{message}</p>}
        />
      </div>
      <div className={Styles.additional}>
        <label
          htmlFor="Union"
          className={`${Styles.label} ${Styles.add_label}`}
        >
          Additional Assignment Information
        </label>
        <div className={Styles.con}>
          <div className={Styles.item}>
            <label htmlFor="Pension" className={`${Styles.label} `}>
              Pension
            </label>
            <select
              className={`${Styles.select} `}
              id="Pension"
              onChange={(e) => handleSelectChange(e.target.value, 10)}
            >
              <option value="">Select Pension</option>
              {pension &&
                pension.length > 0 &&
                pension.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className={Styles.item}>
            <label htmlFor="Housing" className={Styles.label}>
              Housing
            </label>
            <select
              className={`${Styles.select} `}
              id="Housing"
              onChange={(e) => handleSelectChange(e.target.value, 9)}
            >
              <option value="">Housing</option>
              {housing &&
                housing.length > 0 &&
                housing.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className={Styles.con}>
          <div className={Styles.item}>
            {JSON.stringify(watch("additionalInfo"))}
            <label htmlFor="LoyaltyBonus" className={Styles.label}>
              Loyalty Bonus
            </label>
            <select
              className={`${Styles.select} `}
              id="Loyalty Bonus"
              onChange={(e) => handleSelectChange(e.target.value, 11)}
            >
              <option value="">Select Loyalty Bonus</option>
              {security &&
                security.length > 0 &&
                security.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <ErrorMessage
        errors={errors}
        name="additionalInfo"
        render={({ message }) => <p className={Styles.error}>{message}</p>}
      />
    </>
  );
  const step3 = (
    <>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="AmountType" className={Styles.label}>
            Amount Type
          </label>
          <select
            className={`${Styles.select} ${
              errors.amountType && errors.amountType.message && Styles.highlight
            } `}
            id="AmountType"
            {...register("amountType", { required: "This is required." })}
          >
            <option value="">Select an Amount Type</option>
            <option value="rated">Rate Of money</option>
            <option value="fixed">Fixed</option>
          </select>
          <ErrorMessage
            errors={errors}
            name="amountType"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
        {watch("amountType") ? (
          <>
            {watch("amountType") === "fixed" && (
              <div className={Styles.item}>
                <label htmlFor="amount" className={Styles.label}>
                  Amount
                </label>
                <input
                  {...register("amount", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  id="amount"
                  placeholder="Input Amount"
                  className={`${Styles.text} ${
                    errors.amount && errors.amount.message && Styles.highlight
                  } `}
                />
                <ErrorMessage
                  errors={errors}
                  name="amount"
                  render={({ message }) => (
                    <p className={Styles.error}>{message}</p>
                  )}
                />
              </div>
            )}

            {watch("amountType") === "rated" && (
              <div className={Styles.item}>
                <label htmlFor="Rate" className={Styles.label}>
                  Rate
                </label>
                <input
                  {...register("rate", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  id="Rate"
                  placeholder="Input Rate"
                  className={`${Styles.text} ${
                    errors.amount && errors.amount.message && Styles.highlight
                  } `}
                />
                <ErrorMessage
                  errors={errors}
                  name="amount"
                  render={({ message }) => (
                    <p className={Styles.error}>{message}</p>
                  )}
                />
              </div>
            )}
          </>
        ) : (
          <div className={Styles.item}>
            <label htmlFor="select" className={Styles.label}>
              ..
            </label>
            <input
              disabled={true}
              type="number"
              id="select"
              placeholder="Select"
              className={`${Styles.text} ${
                errors.amountType &&
                errors.amountType.message &&
                Styles.highlight
              } `}
            />
            <ErrorMessage
              errors={errors}
              name="amountType"
              render={({ message }) => (
                <p className={Styles.error}>{message}</p>
              )}
            />
          </div>
        )}
      </div>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="effectiveStartDate" className={Styles.label}>
            Effective Start Date
          </label>
          <input
            className={`${Styles.input} ${
              errors.effectiveStartDate &&
              errors.effectiveStartDate.message &&
              Styles.highlight
            }`}
            aria-label="effectiveStartDate"
            placeholder="Input Name"
            type="date"
            id="effectiveStartDate"
            {...(register("effectiveStartDate"),
            {
              setValueAs: (v: string) =>
                v === "" ? undefined : new Date(v).toISOString().split("T")[0],
            })}
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
            className={`${Styles.input} ${
              errors.effectiveEndDate &&
              errors.effectiveEndDate.message &&
              Styles.highlight
            }`}
            aria-label="effectiveEndDate"
            placeholder="Input Name"
            type="date"
            id="effectiveEndDate"
            {...(register("effectiveEndDate"),
            {
              setValueAs: (v: string) =>
                v === "" ? undefined : new Date(v).toISOString().split("T")[0],
            })}
          />
          <ErrorMessage
            errors={errors}
            name="effectiveEndDate"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>
      </div>
      <div className={Styles.con}>
        <div
          className={`${Styles.item} ${
            errors.automate && errors.automate.message && Styles.highlight
          }`}
        >
          <label htmlFor="Automate" className={Styles.label}>
            Automate
          </label>
          <div
            className={`${Styles.pan_}  ${
              errors.automate && errors.automate.message && Styles.highlight
            }`}
          >
            <label>
              <span>Yes</span>{" "}
              <input
                type="radio"
                value="yes"
                {...(register("automate"),
                {
                  setValueAs: (v: string) => (v === "" ? undefined : v),
                })}
              />
            </label>{" "}
            <label>
              <span> No</span>{" "}
              <input
                type="radio"
                value="no"
                {...(register("automate"),
                {
                  setValueAs: (v: string) => (v === "" ? undefined : v),
                })}
              />
            </label>
          </div>
          <ErrorMessage
            errors={errors}
            name="automate"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>

        <div className={`${Styles.item} }`}>
          <label htmlFor="status" className={Styles.label}>
            Status
          </label>
          <div className={`${Styles.pan_} `}>
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
              <span
                className={`${Styles.normal} ${checked ? Styles.active : ""}`}
              />
            </label>
            <span className={Styles.status}>
              {watch("status") ? (
                <> {checked ? "Active" : "Inactive"}</>
              ) : (
                "Select an option"
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
  const steps = [
    { title: "Create Element Link", content: step1 },
    { title: "Additional Information", content: step2 },
    { title: "Processing Information", content: step3 },
  ];
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = async () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const handleRedirects = () => {
    if (subOrganizationid) {
      if (!deptId) {
        return handleStepClick(0);
      }
    }
    if (gradeId) {
      if (!gradeSteps) return handleStepClick(1);
    }
  };

  const validateAndProceed = async () => {
    try {
      if (activeStep === 0) {
        const name = await trigger("name");
        if (name) return handleNext();
      }
      if (activeStep === 1) handleNext();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        console.error(`Validation error:`, error.message);
      }
      return error;
    }
  };
  return (
    <div>
      <h2 className={Styles.title}>Create Element Link</h2>
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
                    ? activeStep > index
                      ? Styles.md_step_passed
                      : Styles.md_step_circle_active
                    : Styles.md_step_circle_normal
                }
              >
                <span>
                  {activeStep > index ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    index + 1
                  )}
                </span>
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
            <>
              {isSubmitting ? (
                <Spinner toggle={false} />
              ) : (
                <button
                  className={Styles.normal_}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              )}
            </>
          ) : (
            <div
              role="button"
              className={Styles.normal_}
              onClick={validateAndProceed}
            >
              Next
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateElementsLinksForm;
