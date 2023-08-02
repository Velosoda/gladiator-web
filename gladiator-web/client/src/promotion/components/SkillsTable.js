import * as React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { SkillTypes } from "promotion/pages/Roster";
import { useState } from "react";
import { Box } from "@mui/material";

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

  return (
    <Box height="100%">
      <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={columns.length}>
                Skills
              </TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {skillList.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">
                  {row.targets
                    .map((target) => {
                      return target;
                    })
                    .join(",")}
                </TableCell>
                <TableCell align="center">{row.strikingLimb}</TableCell>
                <TableCell align="center">{row.level}</TableCell>
                <TableCell align="center">{row.damage}</TableCell>
                <TableCell align="center">{row.accuracy}</TableCell>
                <TableCell align="center">{row.energyCost}</TableCell>
                <TableCell align="center">{row.criticalChance}</TableCell>
                <TableCell align="center">{row.hypeOnTargetHit}</TableCell>
                <TableCell align="center">{row.throws}</TableCell>
                <TableCell align="center">{row.targetHits}</TableCell>
                <TableCell align="center">{row.hits}</TableCell>
                <TableCell align="center">{row.misses}</TableCell>
                <TableCell align="center">{row.hitRate}</TableCell>
                <TableCell align="center">{row.targetHitRate}</TableCell>
                <TableCell align="center">{row.missRate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    // <Box display="flex">
    //   <TableContainer>
    //     <Table aria-label="simple table" size="small" stickyHeader={true} sx={{overflowX: "auto"}}>
    //       <TableHead>
    //         <TableRow>
    //           <TableCell>Move</TableCell>
    //           <TableCell align="right">Targets</TableCell>
    //           <TableCell align="right">Striking Limb</TableCell>
    //           <TableCell align="right">Level</TableCell>
    //           <TableCell align="right">Damage</TableCell>
    //           <TableCell align="right">Accuracy*</TableCell>
    //           <TableCell align="right">Energy Cost</TableCell>
    //           <TableCell align="right">Critical Hit Chance</TableCell>
    //           <TableCell align="right">Hype On Target Hit</TableCell>
    //           <TableCell align="right">Throws</TableCell>
    //           <TableCell align="right">Target Hits</TableCell>
    //           <TableCell align="right">Hits</TableCell>
    //           <TableCell align="right">Misses</TableCell>
    //           <TableCell align="right">Hit %</TableCell>
    //           <TableCell align="right">Target Hit %</TableCell>
    //           <TableCell align="right">Miss %</TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>

    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </Box>
  );
};

export default SkillsTable;
