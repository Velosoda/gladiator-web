import {
  Box,
  LinearProgress,
  Typography,
} from "@mui/material";

import React from "react";

import { Attributes } from "promotion/pages/Roster";
import SkillsTable from "./SkillsTable";
import AttributesTable from "./AttributesTable";
import HealthTable from "./HealthTable";
import { Button, ButtonGroup, Stack } from "react-bootstrap";

const RosterListItem = ({ fighter }) => {
  const [value, setValue] = React.useState(0);

  const [currentData, setCurrentData] = React.useState(
    <AttributesTable attributes={fighter.attributes} />
  );
  const [attributes, setAttributes] = React.useState(fighter.attributes);

  const tabComponentMap = {
    Attributes: <AttributesTable attributes={fighter.attributes} />,
    Skills: <SkillsTable skills={fighter.skills} />,
    Health: <HealthTable health={fighter.health} />,
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log("Render", attributes);

  const updateFighterAttributeLevels = (newValues) => {
    console.log("New Values in update", newValues);
    attributes[Attributes.Strength].level =
      newValues[Attributes.Strength].level;

    attributes[Attributes.Speed].level = newValues[Attributes.Speed].level;

    attributes[Attributes.Durability].level =
      newValues[Attributes.Durability].level;

    attributes[Attributes.Endurance].level =
      newValues[Attributes.Endurance].level;

    attributes[Attributes.Accuracy].level =
      newValues[Attributes.Accuracy].level;

    attributes[Attributes.Charm].level = newValues[Attributes.Charm].level;

    console.log("Attributes state = ", attributes);
    setAttributes({ ...attributes });
  };

  // const AttributeAdjustments = ({ label, level }) => {
  //   const isSubtractingFromZero = (level, direction) => {
  //     if (level <= 0 && direction === "-") return true;
  //     else return false;
  //   };

  //   const adjustAttribute = (direction, level, isAdjusted) => {
  //     const mod = isAdjusted === true ? 1 : 0.5;
  //     if (direction === "-" && level > 0) {
  //       level -= mod;
  //     }
  //     if (direction === "+") {
  //       level += mod;
  //     }

  //     if (level < 0) {
  //       level = 0;
  //     }
  //     console.log(direction, level, isAdjusted);
  //     return level;
  //   };

  //   const CalculateAdjustment = (adjustedAttribute, direction) => {
  //     const oppositeDirection = direction === "+" ? "-" : "+";

  //     console.log([adjustedAttribute, attributes, direction]);

  //     let newValues = {
  //       [Attributes.Strength]: {
  //         level: attributes[Attributes.Strength].level,
  //       },
  //       [Attributes.Speed]: {
  //         level: attributes[Attributes.Speed].level,
  //       },
  //       [Attributes.Durability]: {
  //         level: attributes[Attributes.Durability].level,
  //       },
  //       [Attributes.Endurance]: {
  //         level: attributes[Attributes.Endurance].level,
  //       },
  //       [Attributes.Accuracy]: {
  //         level: attributes[Attributes.Accuracy].level,
  //       },
  //       [Attributes.Charm]: {
  //         level: attributes[Attributes.Charm].level,
  //       },
  //     };
  //     console.log("New Values Beginning", newValues);

  //     if (
  //       adjustedAttribute === Attributes.Strength &&
  //       isSubtractingFromZero(
  //         newValues[Attributes.Strength].level,
  //         direction
  //       ) == false
  //     ) {
  //       newValues[Attributes.Strength].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Strength].level,
  //         true
  //       );
  //       newValues[Attributes.Speed].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Speed].level,
  //         false
  //       );
  //       newValues[Attributes.Durability].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Durability].level,
  //         false
  //       );
  //       newValues[Attributes.Endurance].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Endurance].level,
  //         false
  //       );
  //       newValues[Attributes.Accuracy].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Accuracy].level,
  //         false
  //       );
  //     }
  //     if (
  //       adjustedAttribute === Attributes.Speed &&
  //       isSubtractingFromZero(newValues[Attributes.Speed].level, direction) ==
  //       false
  //     ) {
  //       newValues[Attributes.Strength].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Strength].level,
  //         false
  //       );
  //       newValues[Attributes.Speed].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Speed].level,
  //         true
  //       );
  //       newValues[Attributes.Endurance].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Endurance].level,
  //         false
  //       );
  //       newValues[Attributes.Accuracy].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Accuracy].level,
  //         false
  //       );
  //     }
  //     if (
  //       adjustedAttribute === Attributes.Durability &&
  //       isSubtractingFromZero(
  //         newValues[Attributes.Durability].level,
  //         direction
  //       ) == false
  //     ) {
  //       newValues[Attributes.Strength].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Strength].level,
  //         false
  //       );
  //       newValues[Attributes.Speed].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Speed].level,
  //         false
  //       );
  //       newValues[Attributes.Durability].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Durability].level,
  //         true
  //       );
  //       newValues[Attributes.Endurance].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Endurance].level,
  //         false
  //       );
  //       newValues[Attributes.Accuracy].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Accuracy].level,
  //         false
  //       );
  //     }
  //     if (
  //       adjustedAttribute === Attributes.Endurance &&
  //       isSubtractingFromZero(
  //         newValues[Attributes.Endurance].level,
  //         direction
  //       ) == false
  //     ) {
  //       newValues[Attributes.Strength].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Strength].level,
  //         false
  //       );
  //       newValues[Attributes.Speed].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Speed].level,
  //         false
  //       );
  //       newValues[Attributes.Durability].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Durability].level,
  //         false
  //       );
  //       newValues[Attributes.Endurance].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Endurance].level,
  //         true
  //       );
  //     }
  //     if (
  //       adjustedAttribute === Attributes.Accuracy &&
  //       isSubtractingFromZero(
  //         newValues[Attributes.Accuracy].level,
  //         direction
  //       ) == false
  //     ) {
  //       newValues[Attributes.Strength].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Strength].level,
  //         false
  //       );
  //       newValues[Attributes.Speed].level = adjustAttribute(
  //         oppositeDirection,
  //         attributes[Attributes.Speed].level,
  //         false
  //       );
  //       newValues[Attributes.Accuracy].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Accuracy].level,
  //         true
  //       );
  //     } else if (
  //       adjustedAttribute === Attributes.Charm &&
  //       isSubtractingFromZero(newValues[Attributes.Charm].level, direction) ==
  //       false
  //     ) {
  //       newValues[Attributes.Charm].level = adjustAttribute(
  //         direction,
  //         attributes[Attributes.Charm].level,
  //         true
  //       );
  //     } else {
  //       console.log("attribute passed not a registered attribute");
  //     }
  //     console.log("New Values : ", newValues);
  //     updateFighterAttributeLevels(newValues);
  //   };

  //   return (
  //     <Stack direction="row" spacing={5} borderTop={2} borderColor="gray">
  //       <Box width="50%">
  //         <Typography variant="h4">{label} : </Typography>
  //       </Box>
  //       {/* <IconButton
  //           aria-label="delete"
  //           size="small"
  //           onClick={() => CalculateAdjustment(label, "-")}
  //         >
  //           <RemoveCircleIcon fontSize="large" color="error" />
  //         </IconButton> */}
  //       <Box width="20%">
  //         <Typography variant="h4">{level}</Typography>
  //       </Box>
  //       {/* <IconButton
  //           aria-label="add"
  //           size="small"
  //           onClick={() => CalculateAdjustment(label, "+")}
  //         >
  //           <AddCircleIcon fontSize="large" color="success" />
  //         </IconButton> */}
  //       <Stack>
  //         <LinearProgress
  //           variant="determinate"
  //           color="success"
  //           value={
  //             (attributes[label].currentExp /
  //               attributes[label].expToNextLevel) *
  //             100
  //           }
  //         />
  //         <Box minWidth={250} width="100%">
  //           <Typography variant="body2" color="text.secondary">
  //             {`${attributes[label].currentExp} / ${attributes[label].expToNextLevel}`}
  //           </Typography>
  //         </Box>
  //       </Stack>
  //     </Stack>
  //   );
  // };

  return (
    <div style={{ border: '1px solid #ccc', width: '100%', height: 350 }}>
      <div style={{ border: '1px solid #ccc', width: '100%', height: "10%" }}>
        <h5 style={{ textAlign: 'center', justifyContent: 'center', height: '100%', margin: 0 }}> {fighter.name} </h5>
      </div>
      <Stack direction='horizontal' style={{ border: '1px solid #ccc', height: "90%" }}>
        <div style={{ width: '20%', height: "100%" }}>
          <ButtonGroup vertical style={{ width: '100%', height: "100%", borderRadius: '0' }}>
            <Button variant="outline-primary" style={{ flex: 1 }} onClick={() => setCurrentData(tabComponentMap["Attributes"])}>Attributes</Button>
            <Button variant="outline-primary" style={{ flex: 1 }} onClick={() => setCurrentData(tabComponentMap["Skills"])}>Skills</Button>
            <Button variant="outline-primary" style={{ flex: 1 }} onClick={() => setCurrentData(tabComponentMap["Health"])}>Health</Button>
            <Button variant="outline-primary" style={{ flex: 1 }}>Record</Button>
            <Button variant="outline-primary" style={{ flex: 1 }}>Inventory</Button>
            <Button variant="outline-primary" style={{ flex: 1 }}>Stats</Button>
            <Button variant="outline-primary" style={{ flex: 1 }}>Contract</Button>
          </ButtonGroup>
        </div>
        {currentData}
      </Stack>
    </div>
  );
};

export default RosterListItem;

{
  // <Box flexGrow={1} display="flex">
  //   <Tabs
  //     orientation="vertical"
  //     variant="scrollable"
  //     value={value}
  //     onChange={handleChange}
  //     aria-label="Vertical tabs example"
  //     sx={{ borderRight: 1, borderColor: "divider" }}
  //   >
  //     <Tab label="Attributes" />
  //     <Tab label="Skills" />
  //     <Tab label="Health" />
  //     <Tab label="Record" />
  //     <Tab label="Inventory" />
  //     <Tab label="Stats" />
  //     <Tab label="Contract" />
  //   </Tabs>
  //   <TabPanel value={value} index={0}>
  //     <Box>
  //       <Typography variant="h6">Attributes</Typography>
  //     </Box>
  //     <Box alignItems="center" justifyContent="center">
  //       <AttributeAdjustments
  //         label={Attributes.Strength}
  //         level={attributes[Attributes.Strength].level}
  //       />
  //       <AttributeAdjustments
  //         label={Attributes.Speed}
  //         level={attributes[Attributes.Speed].level}
  //       />
  //       <AttributeAdjustments
  //         label={Attributes.Durability}
  //         level={attributes[Attributes.Durability].level}
  //       />
  //       <AttributeAdjustments
  //         label={Attributes.Endurance}
  //         level={attributes[Attributes.Endurance].level}
  //       />
  //       <AttributeAdjustments
  //         label={Attributes.Accuracy}
  //         level={attributes[Attributes.Accuracy].level}
  //       />
  //       <AttributeAdjustments
  //         label={Attributes.Charm}
  //         level={attributes[Attributes.Charm].level}
  //       />
  //     </Box>
  //   </TabPanel>
  //   <TabPanel value={value} index={1}>
  //     <SkillsTable fighter={fighter} />
  //   </TabPanel>
  // </Box>
}
