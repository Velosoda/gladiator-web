import {
  Box,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { LimbTypes } from "promotion/pages/Roster";
import React from "react";
import { Table } from "react-bootstrap";

import '../components/SkillsTable.css';

const HealthTable = ({ health }) => {
  const HealthRow = ({ limbType }) => {
    return (
      <tr
        key={limbType}
      >
        <td align="left">{limbType}</td>
        <td align="left">
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
        </td>
        <td align="left">{health.limbs[limbType].isSevered}</td>
      </tr>
    );
  };
  return (
    <div style={{ height: '100%', width: '80%', border: '1px solid #ccc', overflowY: 'auto' }}>
      <Table striped bordered hover className="tableFixHead">
        <thead>
          <tr>
            <th>Limb</th>
            <th>Health</th>
            <th>isSevered?</th>
          </tr>
        </thead>
        <tbody>
          <HealthRow limbType={LimbTypes.Head} />
          <HealthRow limbType={LimbTypes.Torso} />
          <HealthRow limbType={LimbTypes.LeftArm} />
          <HealthRow limbType={LimbTypes.RightArm} />
          <HealthRow limbType={LimbTypes.LeftLeg} />
          <HealthRow limbType={LimbTypes.RightLeg} />
        </tbody>
      </Table>
    </div >
  );
};

export default HealthTable;
