import { TableRows } from "@mui/icons-material";
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
import { Attributes } from "promotion/pages/Roster";
import React from "react";

const AttributesTable = ({ attributes }) => {
  const AttributeRow = ({ attributeType }) => {
    return (
      <TableRow
        key={attributeType}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell align="left">{attributeType}</TableCell>
        <TableCell align="left">{attributes[attributeType].level}</TableCell>
        <TableCell align="left">
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
        </TableCell>
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
                Attributes
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Attribute</TableCell>
              <TableCell align="left">Level</TableCell>
              <TableCell align="left">Exp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AttributeRow attributeType={Attributes.Strength} />
            <AttributeRow attributeType={Attributes.Speed} />
            <AttributeRow attributeType={Attributes.Durability} />
            <AttributeRow attributeType={Attributes.Endurance} />
            <AttributeRow attributeType={Attributes.Accuracy} />
            <AttributeRow attributeType={Attributes.Charm} />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttributesTable;
