import {
  Box,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { LimbTypes } from "promotion/pages/Roster";
import React from "react";

const HealthTable = ({ health }) => {
  const HealthRow = ({ limbType }) => {
    return (
      <TableRow
        key={limbType}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell align="left">{limbType}</TableCell>
        <TableCell align="left">
          <Stack justifyContent="center">
            <LinearProgress
              variant="determinate"
              color="success"
              value={
                (health.limbs[limbType].currentHealth /
                  health.limbs[limbType].overallHealth) *
                100
              }
            />
            <Box minWidth={250} width="100%">
              <Typography variant="body2" color="text.secondary">
                {`${health.limbs[limbType].currentHealth} / ${health.limbs[limbType].overallHealth}`}
              </Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell align="left">{health.limbs[limbType].isSevered}</TableCell>
      </TableRow>
    );
  };
  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
        <Table size="small" stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={3}>
                Health
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Limb</TableCell>
              <TableCell align="left">Health</TableCell>
              <TableCell align="left">isSevered?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <HealthRow limbType={LimbTypes.Head} />
            <HealthRow limbType={LimbTypes.Torso} />
            <HealthRow limbType={LimbTypes.LeftArm} />
            <HealthRow limbType={LimbTypes.RightArm} />
            <HealthRow limbType={LimbTypes.LeftLeg} />
            <HealthRow limbType={LimbTypes.RightLeg} />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HealthTable;
