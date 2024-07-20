import { TextField } from "@mui/material";
import { styled } from "@mui/system";
const customYellow = "#F2CA2C";

export const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: customYellow,
    },
    "&:hover fieldset": {
      borderColor: customYellow,
    },
    "&.Mui-focused fieldset": {
      borderColor: customYellow,
    },
    "& input": {
      color: customYellow,
    },
  },
  "& .MuiInputLabel-root": {
    color: customYellow,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: customYellow,
  },
});

export const CustomTextFieldBlack = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#000",
    },
    "&:hover fieldset": {
      borderColor: "#000",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000",
    },
    "& input": {
      color: "#000",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#000",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#000",
  },
});
