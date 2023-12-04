import {
  Box,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Attributes } from "promotion/pages/Roster";
import React from "react";
import { Table } from "react-bootstrap";

import '../components/SkillsTable.css';

const AttributesTable = ({ attributes }) => {
  const AttributeRow = ({ attributeType }) => {
    return (
      <tr
        key={attributeType}
      >
        <td align="left">{attributeType}</td>
        <td align="left">{attributes[attributeType].level}</td>
        <td align="left">
          <Stack justifyContent="center">
            <LinearProgress
              variant="determinate"
              color="success"
              value={
                (attributes[attributeType].currentExp /
                  attributes[attributeType].expToNextLevel) *
                100
              }
            />
            <Box minWidth={250} width="100%">
              <Typography variant="body2" color="text.secondary">
                {`${attributes[attributeType].currentExp} / ${attributes[attributeType].expToNextLevel}`}
              </Typography>
            </Box>
          </Stack>
        </td>
      </tr>
    );
  };
  return (
    <div style={{ height: '100%', width: '80%', border: '1px solid #ccc', overflowY: 'auto' }}>
      <Table striped bordered hover className="tableFixHead">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Level</th>
            <th>Exp</th>
          </tr>
        </thead>
        <tbody>
          <AttributeRow attributeType={Attributes.Strength} />
          <AttributeRow attributeType={Attributes.Speed} />
          <AttributeRow attributeType={Attributes.Durability} />
          <AttributeRow attributeType={Attributes.Endurance} />
          <AttributeRow attributeType={Attributes.Accuracy} />
          <AttributeRow attributeType={Attributes.Charm} />
        </tbody>
      </Table>
    </div >
  );
};

export default AttributesTable;
