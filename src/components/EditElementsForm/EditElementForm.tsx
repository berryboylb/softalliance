import { useState, useMemo, useEffect } from "react";
import Styles from "../CreateElementForm/css/styles.module.css";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { monthsArray } from "../../constants";
import useDataFetching from "../CreateElementForm/useFetchLookups";
import { getById, update } from "../../store/reducers/elements-reducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Spinner from "../Spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
const EditElementForm = ({
  toggle,
  toggleSecond,
  linkId,
}: {
  toggle: () => void;
  toggleSecond: () => void;
  linkId: null | string;
}) => {
  const dispatch = useAppDispatch();
  const { loading, singleElement } = useAppSelector((state) => state.elements);
  useEffect(() => {
    if (linkId) dispatch(getById(linkId));
  }, [dispatch, linkId]);
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
    )
    .refine(
      (data) => {
        if (data.payFrequency === "selectedMonths") {
          return !!data.selectedMonths;
        }
        return true;
      },
      {
        message: "Please add selected months",
        path: ["selectedMonths"],
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

  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    if (singleElement?.selectedMonths) {
      setValue("selectedMonths", singleElement?.selectedMonths);
      setMonths(singleElement?.selectedMonths);
    }
  }, [singleElement]);

  useEffect(() => {
    if (singleElement?.categoryValueId) {
      setValue("categoryValueId", singleElement?.categoryValueId);
    }
  }, [singleElement]);

   useEffect(() => {
     if (singleElement?.effectiveEndDate) {
       setValue("effectiveEndDate", singleElement?.effectiveEndDate);
     }
   }, [singleElement]);

  useEffect(() => {
    if (singleElement?.effectiveStartDate) {
      setValue("effectiveStartDate", singleElement?.effectiveStartDate);
    }
  }, [singleElement]);
  const [toggleMonths, setToggleMonths] = useState<boolean>(false);
  const handletoggleMonths = () => setToggleMonths((k) => !k);
  const handleMonths = (val: string) => {
    if (months.includes(val)) {
      setMonths((prev) => {
        const newValue = prev.filter((item) => item !== val);
        setValue("selectedMonths", newValue);
        return newValue;
      });
    } else {
      setMonths((prev) => {
        const newValue = [...prev, val];
        setValue("selectedMonths", newValue);
        return newValue;
      });
    }
  };

  const onSubmit: SubmitHandler<FormSchmaType> = async (data) => {
    dispatch(
      update({
        id: linkId ? linkId : "",
        body: {
          ...data,
          modifiedBy: "olorunfemi Daramola",
          categoryId: 1,
          classificationId: 2,
          payRunId: 5,
        },
      })
    );
    reset();
    toggle();
    toggleSecond();
  };

  const [checked, setChecked] = useState(
    singleElement?.status && singleElement?.status === "active" ? true : false
  );

  useEffect(() => {
    if (singleElement?.status) {
      setValue(
        "status",
        singleElement?.status === "active" ? "active" : "inactive"
      );
      setChecked(singleElement?.status === "active" ? true : false);
    }
  }, [singleElement]);
  const handleToggle = () =>
    setChecked((k) => {
      if (k) {
        setValue("status", "inactive");
      } else {
        setValue("status", "active");
      }

      return !k;
    });

  const currentClassificationId = watch("classificationValueId");

  const filteredCategory = useMemo(() => {
    if (currentClassificationId === 7) {
      return (
        category &&
        category.filter((item) => item.name.toLowerCase().includes("deduction"))
      );
    }

    if (currentClassificationId === 8) {
      return (
        category &&
        category.filter((item) => item.name.toLowerCase().includes("earning"))
      );
    }

    if (currentClassificationId === 9) {
      return (
        category &&
        category.filter((item) =>
          item.name.toLowerCase().includes("contribution")
        )
      );
    }

    return category;
  }, [category, currentClassificationId]);
  const step1 = (
    <>
      <div className={Styles.con}>
        <div className={Styles.item}>
          <label htmlFor="name" className={Styles.label}>
            Name
          </label>
          <input
            className={`${Styles.input} ${
              errors.name && errors.name.message && Styles.highlight
            }`}
            aria-label="name"
            placeholder="Input Name"
            type="text"
            id="name"
            {...register("name", { required: "This is required." })}
            disabled={isSubmitting}
            defaultValue={singleElement?.name}
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
            defaultValue={singleElement?.classificationValueId}
            placeholder="Select Classification"
            className={`${Styles.select} ${
              errors.classificationValueId &&
              errors.classificationValueId.message &&
              Styles.highlight
            }`}
            id="classification"
            {...register("classificationValueId", {
              required: "This is required.",
              valueAsNumber: true,
            })}
          >
            <option value={singleElement?.classificationValueId}>
              {classification &&
                classification.length > 0 &&
                classification?.find(
                  (item) =>
                    String(item.id) ===
                    String(singleElement?.classificationValueId)
                )?.name}
            </option>
            {classification &&
              classification.length > 0 &&
              classification
                .filter(
                  (item) =>
                    String(item.id) !==
                    String(singleElement?.classificationValueId)
                )
                .map((item) => (
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
          <label htmlFor="categoryValueId" className={Styles.label}>
            Element Category
          </label>
          <select
            defaultValue={singleElement?.categoryValueId}
            disabled={!currentClassificationId ? true : false}
            className={`${Styles.select} ${
              errors.categoryValueId &&
              errors.categoryValueId.message &&
              Styles.highlight
            }`}
            id="categoryValueId"
            {...register("categoryValueId", {
              required: "This is required.",
              valueAsNumber: true,
            })}
          >
            <option value={singleElement?.categoryValueId}>
              {filteredCategory &&
                filteredCategory.length > 0 &&
                filteredCategory?.find(
                  (item) =>
                    String(item.id) === String(singleElement?.categoryValueId)
                )?.name}
            </option>
            {filteredCategory &&
              filteredCategory.length > 0 &&
              filteredCategory
                .filter(
                  (item) =>
                    String(item.id) !== String(singleElement?.categoryValueId)
                )
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
          </select>
          <ErrorMessage
            errors={errors}
            name="categoryValueId"
            render={({ message }) => (
              <p className={Styles.error}>{message} rdr</p>
            )}
          />
        </div>
        <div className={Styles.item}>
          <label htmlFor="Payrun" className={Styles.label}>
            Payrun
          </label>
          <select
            defaultValue={singleElement?.payRunValueId}
            className={`${Styles.select} ${
              errors.payRunValueId &&
              errors.payRunValueId.message &&
              Styles.highlight
            }`}
            id="Payrun"
            placeholder="Select Payrun"
            {...register("payRunValueId", {
              required: "This is required.",
              valueAsNumber: true,
            })}
          >
            <option value={singleElement?.payRunValueId}>
              {payrun &&
                payrun.length > 0 &&
                payrun?.find(
                  (item) =>
                    String(item.id) === String(singleElement?.payRunValueId)
                )?.name}
            </option>
            {payrun &&
              payrun.length > 0 &&
              payrun
                .filter(
                  (item) =>
                    String(item.id) !== String(singleElement?.payRunValueId)
                )
                .map((item) => (
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
          defaultValue={singleElement?.description}
          id="description"
          placeholder="Input Description"
          className={`${Styles.text} ${
            errors.description && errors.description.message && Styles.highlight
          }`}
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
          defaultValue={singleElement?.reportingName}
          id="reportingName"
          placeholder="Input Reporting Name"
          className={`${Styles.text} ${
            errors.reportingName &&
            errors.reportingName.message &&
            Styles.highlight
          }`}
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
            defaultValue={
              singleElement?.effectiveStartDate &&
              new Date(singleElement?.effectiveStartDate)
                .toISOString()
                .split("T")[0]
            }
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
            {...register("effectiveEndDate", {
              required: "This is required.",
            })}
            disabled={isSubmitting}
            defaultValue={
              singleElement?.effectiveEndDate &&
              new Date(singleElement?.effectiveEndDate)
                .toISOString()
                .split("T")[0]
            }
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
          <div
            className={`${Styles.pan} ${
              errors.processingType &&
              errors.processingType.message &&
              Styles.highlight
            }`}
          >
            <label>
              <span>Open</span>

              <input
                type="radio"
                value="open"
                {...register("processingType", {
                  required: "This is required.",
                })}
                defaultChecked={singleElement?.processingType === "open"}
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
                defaultChecked={singleElement?.processingType === "closed"}
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
          <div
            className={`${Styles.pan} ${
              errors.payFrequency &&
              errors.payFrequency.message &&
              Styles.highlight
            }`}
          >
            <label>
              <span>Monthly</span>

              <input
                id="payFrequency"
                type="radio"
                value="monthly"
                onClick={() => {
                  setValue("selectedMonths", undefined);
                  setMonths([]);
                }}
                {...register("payFrequency", {
                  required: "This is required.",
                })}
                defaultChecked={singleElement?.payFrequency === "monthly"}
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
                defaultChecked={
                  singleElement?.payFrequency === "selectedMonths"
                }
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

      <div className={`${Styles.months} `}>
        <label htmlFor="payFrequency" className={Styles.label}>
          Selected Pay Months
        </label>

        <div className={Styles.selected_}>
          <ul>
            {months.map((item) => (
              <li key={item}>
                {item.slice(0, 3)}{" "}
                <FontAwesomeIcon
                  className={Styles._icon_}
                  onClick={() => handleMonths(item)}
                  icon={faTimes}
                />
              </li>
            ))}
          </ul>
          <div>
            <button
              className={Styles.clear}
              type="button"
              onClick={() => {
                setMonths([]);
                setValue("selectedMonths", undefined);
              }}
              disabled={watch("payFrequency") === "monthly" ? true : false}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button
              className={Styles.toggle}
              type="button"
              onClick={handletoggleMonths}
              disabled={watch("payFrequency") === "monthly" ? true : false}
            >
              <FontAwesomeIcon
                icon={toggleMonths ? faChevronUp : faChevronDown}
              />
            </button>
          </div>
        </div>

        {watch("payFrequency") === "selectedMonths" && toggleMonths && (
          <div
            className={`${Styles.monthy_} ${
              errors.selectedMonths &&
              errors.selectedMonths.message &&
              Styles.highlight
            }`}
          >
            {monthsArray.map((item) => (
              <label className={Styles.label} key={item}>
                <input
                  type="checkbox"
                  name={item}
                  onChange={() => handleMonths(item)}
                  checked={months.includes(item) ? true : false}
                />{" "}
                {item}
              </label>
            ))}
          </div>
        )}

        <ErrorMessage
          errors={errors}
          name="selectedMonths"
          render={({ message }) => <p className={Styles.error}>{message}</p>}
        />
      </div>

      <div className={Styles.con}>
        <div className={`${Styles.item} `}>
          <label htmlFor="prorate" className={Styles.label}>
            Prorate
          </label>
          <div
            className={`${Styles.pan_} ${
              errors.status && errors.status.message && Styles.highlight
            }`}
          >
            <label>
              <span>Yes</span>{" "}
              <input
                type="radio"
                value="yes"
                {...register("prorate", {
                  required: "This is required.",
                })}
                defaultChecked={singleElement?.prorate === "yes"}
              />
            </label>{" "}
            <label>
              <span> No</span>{" "}
              <input
                type="radio"
                value="no"
                {...register("prorate", {
                  required: "This is required.",
                })}
                defaultChecked={singleElement?.prorate === "no"}
              />
            </label>
          </div>

          <ErrorMessage
            errors={errors}
            name="prorate"
            render={({ message }) => <p className={Styles.error}>{message}</p>}
          />
        </div>

        <div className={`${Styles.item} }`}>
          <label htmlFor="status" className={Styles.label}>
            Status
          </label>
          <div
            className={`${Styles.pan_} ${
              errors.status && errors.status.message && Styles.highlight
            }`}
          >
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
                defaultChecked={singleElement?.status === "active"}
              />
              {/* <span className="block w-10 h-5 bg-gray-300 rounded-full shadow-inner" /> */}
              <span
                className={`${Styles.normal} ${checked ? Styles.active : ""}`}
              />
            </label>
            {watch("status")}
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
  console.log(singleElement);

  return (
    <div>
      {linkId ? linkId : "null"}
      <h2 className={Styles.title}>Edit Element</h2>
      {loading && <Spinner toggle={false} />}
      {!loading && singleElement && (
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
                className={Styles.normal_}
                onClick={handleNext}
                // disabled={activeStep === steps.length - 1}
              >
                Next
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default EditElementForm;
