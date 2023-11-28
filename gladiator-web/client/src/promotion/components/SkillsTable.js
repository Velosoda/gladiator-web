import * as React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { SkillTypes } from "promotion/pages/Roster";
import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const columns = [
  { id: "name", label: "Move Name", minWidth: 50 },
  { id: "targets", label: "Targets", minWidth: 100 },
  {
    id: "strikingLimb",
    label: "Striking Limb",
    minWidth: 50,
    align: "right",
  },
  {
    id: "level",
    label: "Level",
    minWidth: 50,
    align: "right",
  },
  {
    id: "damage",
    label: "Damage",
    minWidth: 50,
    align: "right",
  },
  {
    id: "accuracy",
    label: "Accuracy",
    minWidth: 50,
    align: "right",
  },
  {
    id: "energyCost",
    label: "Energy Cost",
    minWidth: 50,
    align: "right",
  },
  {
    id: "criticalHitChance",
    label: "Critical Hit Chance",
    minWidth: 50,
    align: "right",
  },
  {
    id: "targetHitHype",
    label: "Target Hit Hype",
    minWidth: 50,
    align: "right",
  },
  {
    id: "throws",
    label: "Throws",
    minWidth: 50,
    align: "right",
  },
  {
    id: "targetHits",
    label: "Target Hits",
    minWidth: 50,
    align: "right",
  },
  {
    id: "hits",
    label: "Hits",
    minWidth: 50,
    align: "right",
  },
  {
    id: "misses",
    label: "Misses",
    minWidth: 50,
    align: "right",
  },
  {
    id: "hitRate",
    label: "Hit %",
    minWidth: 50,
    align: "right",
  },
  {
    id: "targetHitRate",
    label: "Target Hit %",
    minWidth: 50,
    align: "right",
  },
  {
    id: "missRate",
    label: "Miss %",
    minWidth: 50,
    align: "right",
  },
];

const SkillsTable = ({ skills }) => {
  // const skills = () => {
  // //     let res = [];
  // //     for (let st in SkillTypes){
  // //         res.push(fighter.skills[st]);
  // //     }
  // //     set
  // //     return res;
  // // }

  const [skillList, setSkillList] = useState(skills[SkillTypes.Boxing]);

  const keySkills = ["Move", "Damage", "Hit pct", "Hype on hit", ""];

  return (
    <Box height="100%">
      <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {keySkills.map((value, index) => (
                <TableCell key={index} align="left">
                  {value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {skillList.map((move) => (
              <TableRow
                key={move.name}
              >
                <TableCell component="th" scope="row">
                  {move.strikingLimb} {move.name} ({move.level})
                </TableCell>
                <TableCell align="left">{move.damage}</TableCell>
                <TableCell align="left">{move.targetHitRate}</TableCell>
                <TableCell align="left">{move.hypeOnTargetHit}</TableCell>
                <TableCell align="left">
                  <IconButton size="small">
                    <NavigateNextIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SkillsTable;
