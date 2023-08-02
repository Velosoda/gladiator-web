import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

const LinearProgressWithLabel = (props) => {
  return (
    <Box alignItems="center" width="100%">
      <Box height="10px" width="100%">
        <LinearProgress variant="determinate" color="success"/>
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="text.secondary">
            {`${props.currentExp} / ${props.expToNextLevel}`}
        </Typography>
      </Box>
    </Box>
  );
}
export default LinearProgressWithLabel;
