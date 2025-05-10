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
  vehicleType: VehicleType | null;
  vehicleModel: VehicleModel | null;
  startDate: Date | null;
  endDate: Date | null;
};

type TouchedFields = {
  startDate: boolean;
  endDate: boolean;
};

type VehicleType = {
  id: number;
  name: string;
  wheels: number;
};

type VehicleModel = {
  id: number;
  model: string;
  vehicleTypeId: number;
};

type DateErrors = {
  startDate?: string;
  endDate?: string;
};

// Update the errors state

export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    wheels: "",
    vehicleType: null,
    vehicleModel: null,
    startDate: null,
    endDate: null,
  });
  const [errors, setErrors] = useState<DateErrors>({});
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [touched, setTouched] = useState<TouchedFields>({
    startDate: false,
    endDate: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const nextStep = () => {
    if (step === 4) {
      bookVehicle();
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
        return formData.vehicleType !== null;
      case 3:
        return formData.vehicleModel !== null;
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

  const getVehicleType = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/vehicle/${formData.wheels}/type`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch vehicle types");
      }
      const data: VehicleType[] = await res.json();
      setVehicleTypes(data);
    } catch (err) {
      setMessage({
        text:
          err instanceof Error ? err.message : "Failed to load vehicle types",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getVehicleModel = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/vehicle/${
          formData.vehicleType?.id
        }/model`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch vehicle models");
      }
      const data: VehicleModel[] = await res.json();
      setVehicleModels(data);
    } catch (err) {
      setMessage({
        text:
          err instanceof Error ? err.message : "Failed to load vehicle models",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bookVehicle = async () => {
    setIsLoading(true);
    try {
      const body = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        vehicleId: formData.vehicleModel?.id,
        startDate: formData.startDate?.toISOString(),
        endDate: formData.endDate?.toISOString(),
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/vehicle/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage({ text: result.message || "Booking failed", type: "error" });
        return false;
      }

      if (result.message) {
        setMessage({
          text: result.message,
          type: "success",
        });
        setStep(5);
        // Clear form data after successful booking
        setFormData({
          firstName: "",
          lastName: "",
          wheels: "",
          vehicleType: null,
          vehicleModel: null,
          startDate: null,
          endDate: null,
        });
        return true;
      }
    } catch (err) {
      setMessage({
        text:
          err instanceof Error ? err.message : "An unexpected error occurred",
        type: "error",
      });
      return false;
    } finally {
      setIsLoading(false);
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
            onChange={(e) => {
              const value = e.target.value;
              handleInputChange("wheels", value);
              setFormData((prev) => ({
                ...prev,
                vehicleType: null,
                vehicleModel: null,
              }));
            }}
          >
            <FormControlLabel value="2" control={<Radio />} label="2 Wheeler" />
            <FormControlLabel value="4" control={<Radio />} label="4 Wheeler" />
          </RadioGroup>
        );
      case 2:
        return (
          <RadioGroup
            value={formData.vehicleType?.name || ""}
            onChange={(e) => {
              const selectedType = vehicleTypes.find(
                (type) => type.name === e.target.value
              );
              setFormData((prev) => ({
                ...prev,
                vehicleType: selectedType || null,
                vehicleModel: null,
              }));
            }}
          >
            {vehicleTypes.map((type) => (
              <FormControlLabel
                key={type.id}
                value={type.name}
                control={<Radio />}
                label={type.name}
              />
            ))}
          </RadioGroup>
        );
      case 3:
        return (
          <RadioGroup
            value={formData.vehicleModel?.model || ""}
            onChange={(e) => {
              const selectedModel = vehicleModels.find(
                (model) => model.model === e.target.value
              );
              setFormData((prev) => ({
                ...prev,
                vehicleModel: selectedModel || null,
              }));
            }}
          >
            {vehicleModels.map((model) => (
              <FormControlLabel
                key={model.id}
                value={model.model}
                control={<Radio />}
                label={model.model}
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
                  minDate={new Date()}
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
                  minDate={formData.startDate || new Date()} // Add this
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

  useEffect(() => {
    if (formData.wheels) {
      getVehicleType();
    }
  }, [formData.wheels]);

  useEffect(() => {
    if (formData.vehicleType) {
      getVehicleModel();
    }
  }, [formData.vehicleType]);

  return (
    <Stack spacing={4} sx={{ p: 4, maxWidth: 500, margin: "auto" }}>
      {step < 5 && message && (
        <Typography
          color={message.type === "success" ? "success.main" : "error.main"}
          sx={{ textAlign: "center", mb: 2 }}
        >
          {message.text}
        </Typography>
      )}
      {step < 5 && <Typography variant="h5">Step {step + 1}</Typography>}
      {renderStep()}
      {step === 5 ? (
        <div>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", color: "success.main" }}
          >
            {message?.text}
          </Typography>
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
            disabled={!isStepValid() || isLoading}
          >
            {isLoading ? "Processing..." : step === 4 ? "Finish" : "Next"}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
