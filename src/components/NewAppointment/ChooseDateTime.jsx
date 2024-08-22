import React, { useEffect, useState } from "react";
import css from "./NewAppointment.module.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, DatePicker, TimeInput } from "@nextui-org/react";
import {
  parseDate,
  getLocalTimeZone,
  Time,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import moment from "moment";
import { LuClock } from "react-icons/lu";
import { useTranslation } from "react-i18next";

const ChooseDateTime = ({
  handleNext,
  handleBack,
  activeStep,
  stepsLength,
  dateTimeValues,
  setDateTimeValues,
}) => {
  const {t} = useTranslation();
  const [date, setDate] = useState(parseDate(dateTimeValues.date));
  const [time, setTime] = useState(parseAbsoluteToLocal(dateTimeValues.time));

  const handleSubmit = (values) => {
    handleNext();
  };

  useEffect(() => {
    setDateTimeValues({
      ...dateTimeValues,
      date: moment(date?.toDate(getLocalTimeZone())).format("YYYY-MM-DD"),
    });
  }, [date]);

  console.log(dateTimeValues);

  useEffect(() => {
    setDateTimeValues({
      ...dateTimeValues,
      time: moment(time?.toDate()).utc().format("YYYY-MM-DDTHH:mm:ss[Z]"),
    });
  }, [time]);

  const StepsButton = () => {
    return (
      <div className="mb-2 mt-14">
        <div>
          <Button
            size="lg"
            radius="sm"
            className="mr-3 mt-1 bg-[#01ab8e] text-white"
            type="submit"
          >
            {activeStep === stepsLength - 1 ? "Finish" : "Continue"}
          </Button>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className="mr-1 mt-1 bg-transparent"
          >
            {t("back")}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={css.dateTimeWrapper}>
      <div className={css.left}>
        <Formik
          initialValues={dateTimeValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, setFieldValue, touched }) => (
            <Form className={css.formData}>
              <div className={`${css.inputContainer} relative`}>
                <label htmlFor="appointmentDate">{t("appointmentDate")}</label>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <DatePicker
                    isRequired
                    label={t("chooseDate")}
                    value={date}
                    onChange={setDate}
                  />
                </div>
              </div>

              <div className={`${css.inputContainer} relative`}>
                <label htmlFor="appointmentTime">{t("appointmentTime")}</label>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <TimeInput
                    label={t("chooseTime")}
                    isRequired
                    placeholderValue={new Time(9)}
                    value={time}
                    onChange={setTime}
                    endContent={
                      <LuClock className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                  />
                </div>
              </div>

              {/* Steps Button  */}
              <StepsButton />
            </Form>
          )}
        </Formik>
      </div>
      <div className={css.right}></div>
    </div>
  );
};

export default ChooseDateTime;
