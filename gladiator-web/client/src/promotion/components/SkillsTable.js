import * as React from "react";
import { useState } from "react";

import Table from 'react-bootstrap/Table';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { SkillTypes } from "promotion/pages/Roster";
import '../components/SkillsTable.css';


const SkillsTable = ({ skills }) => {

  const [skillList, setSkillList] = useState(skills[SkillTypes.Boxing]);

  const keySkills = ["Move (Level)", "Damage", "Hit pct", "Hype on hit", "View"];

  return (
    <div style={{ height: '100%', width: '80%', border: '1px solid #ccc', overflowY: 'auto' }}>
      <Table striped bordered hover className="tableFixHead">
        <thead>
          <tr>
            {keySkills.map((value, index) => (
              <th key={index} align="left">
                {value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {skillList.map((move) => (
            <tr>
              <td>{move.strikingLimb} {move.name} ({move.level})</td>
              <td>{move.damage}</td>
              <td>{move.targetHitRate}</td>
              <td>{move.hypeOnTargetHit}</td>
              <td onClick={() => console.log("asdfasdf")} style={{ cursor: 'pointer' }} align="center">
                <ArrowForwardIosIcon />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SkillsTable;
