/* eslint-disable @typescript-eslint/no-explicit-any */
// App.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Typography,
  FormHelperText,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { isBefore, isValid } from "date-fns";

type FormData = {
  firstName: string;
  lastName: string;
  wheels: "2" | "4" | "";
  vehicleType: string;
  vehicleModel: string;
  startDate: Date | null;
  endDate: Date | null;
};

type TouchedFields = {
  startDate: boolean;
  endDate: boolean;
};

const vehicleTypeMap: Record<string, string[]> = {
  "2": ["Scooter", "Bike"],
  "4": ["Sedan", "SUV"],
};

const vehicleModelMap: Record<string, string[]> = {
  Scooter: ["Activa", "Dio"],
  Bike: ["Pulsar", "Apache"],
  Sedan: ["City", "Verna"],
  SUV: ["Creta", "Fortuner"],
};

export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    wheels: "",
    vehicleType: "",
    vehicleModel: "",
    startDate: null,
    endDate: null,
  });

  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [vehicleModels, setVehicleModels] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
  });

  const [touched, setTouched] = useState<TouchedFields>({
    startDate: false,
    endDate: false,
  });

  useEffect(() => {
    if (formData.wheels) {
      setVehicleTypes(vehicleTypeMap[formData.wheels]);
    }
  }, [formData.wheels]);

  useEffect(() => {
    if (formData.vehicleType) {
      setVehicleModels(vehicleModelMap[formData.vehicleType]);
    }
  }, [formData.vehicleType]);

  useEffect(() => {
    const savedData = localStorage.getItem("data");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const restoredData: FormData = {
        ...parsedData,
        startDate: parsedData.startDate ? new Date(parsedData.startDate) : null,
        endDate: parsedData.endDate ? new Date(parsedData.endDate) : null,
      };
      setFormData(restoredData);

      // Only set touched state for dates that exist in stored data
      if (restoredData.startDate || restoredData.endDate) {
        setTouched({
          startDate: restoredData.startDate !== null,
          endDate: restoredData.endDate !== null,
        });
        validateDates(restoredData);
      }
    }
  }, []);

  const nextStep = () => {
    if (step === 4) {
      submitFormData(formData);
      localStorage.removeItem("data");
    } else {
      setStep((prev) => prev + 1);
      localStorage.setItem("data", JSON.stringify(formData));
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => {
      const updatedForm = { ...prev, [field]: value };

      if (field === "startDate" || field === "endDate") {
        // Mark the field as touched
        setTouched((prev) => ({
          ...prev,
          [field]: true,
        }));
        validateDates(updatedForm);
      }

      return updatedForm;
    });
  };

  const isStepValid = () => {
    if (step > 4) return false;

    switch (step) {
      case 0:
        return (
          formData.firstName.trim() !== "" && formData.lastName.trim() !== ""
        );
      case 1:
        return formData.wheels !== "";
      case 2:
        return formData.vehicleType !== "";
      case 3:
        return formData.vehicleModel !== "";
      case 4:
        return (
          formData.startDate !== null &&
          formData.endDate !== null &&
          Object.keys(getDateErrors()).length === 0
        );
      default:
        return false;
    }
  };

  const getDateErrors = (data: FormData = formData) => {
    const errors: any = {};
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
    const { startDate, endDate } = data;

    // Only validate if we have values or if fields have been touched

    // Validate startDate
    if (startDate) {
      if (!isValid(startDate)) {
        errors.startDate = "Start date is invalid.";
      } else if (isBefore(startDate, currentDate)) {
        errors.startDate = "Start date cannot be in the past.";
      }
    }

    // Validate endDate
    if (endDate) {
      if (!isValid(endDate)) {
        errors.endDate = "End date is invalid.";
      } else if (startDate && isBefore(endDate, startDate)) {
        errors.endDate = "End date cannot be before start date.";
      } else if (isBefore(endDate, currentDate)) {
        errors.endDate = "End date cannot be in the past.";
      }
    }

    return errors;
  };

  const validateDates = (data: FormData = formData) => {
    const dateErrors = getDateErrors(data);
    setErrors(dateErrors);
    return Object.keys(dateErrors).length === 0;
  };

  const submitFormData = async (data: FormData) => {
    try {
      // Your API call implementation
      console.log("Form submitted successfully", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
          </Stack>
        );
      case 1:
        return (
          <RadioGroup
            value={formData.wheels}
            onChange={(e) => handleInputChange("wheels", e.target.value)}
          >
            <FormControlLabel value="2" control={<Radio />} label="2 Wheeler" />
            <FormControlLabel value="4" control={<Radio />} label="4 Wheeler" />
          </RadioGroup>
        );
      case 2:
        return (
          <RadioGroup
            value={formData.vehicleType}
            onChange={(e) => handleInputChange("vehicleType", e.target.value)}
          >
            {vehicleTypes.map((type) => (
              <FormControlLabel
                key={type}
                value={type}
                control={<Radio />}
                label={type}
              />
            ))}
          </RadioGroup>
        );
      case 3:
        return (
          <RadioGroup
            value={formData.vehicleModel}
            onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
          >
            {vehicleModels.map((model) => (
              <FormControlLabel
                key={model}
                value={model}
                control={<Radio />}
                label={model}
              />
            ))}
          </RadioGroup>
        );
      case 4:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={2}>
              <div>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(newValue) =>
                    handleInputChange("startDate", newValue)
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                  onOpen={() =>
                    setTouched((prev) => ({ ...prev, startDate: true }))
                  }
                />
                {touched.startDate && errors.startDate && (
                  <FormHelperText error>{errors.startDate}</FormHelperText>
                )}
              </div>
              <div>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(newValue) =>
                    handleInputChange("endDate", newValue)
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                  onOpen={() =>
                    setTouched((prev) => ({ ...prev, endDate: true }))
                  }
                />
                {touched.endDate && errors.endDate && (
                  <FormHelperText error>{errors.endDate}</FormHelperText>
                )}
              </div>
            </Stack>
          </LocalizationProvider>
        );
      default:
        return false;
    }
  };

  return (
    <Stack spacing={4} sx={{ p: 4, maxWidth: 500, margin: "auto" }}>
      {step < 5 && <Typography variant="h5">Step {step + 1}</Typography>}
      {renderStep()}
      {step === 5 ? (
        <div>
          <h2>
            Thank you! Your rental request has been submitted. We’ll confirm
            your booking soon.
          </h2>
        </div>
      ) : (
        <Stack direction="row" spacing={2} justifyContent="space-between">
          {step > 0 && (
            <Button variant="outlined" onClick={prevStep}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={nextStep}
            disabled={!isStepValid()}
          >
            {step === 4 ? "Finish" : "Next"}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
