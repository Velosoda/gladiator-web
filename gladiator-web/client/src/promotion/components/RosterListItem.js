import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import React from "react";

import { Attributes } from "promotion/pages/Roster";
import SkillsTable from "./SkillsTable";
import AttributesTable from "./AttributesTable";
import HealthTable from "./HealthTable";

const RosterListItem = ({ fighter }) => {
  const [value, setValue] = React.useState(0);

  const [currentData, setCurrentData] = React.useState(
    <SkillsTable skills={fighter.skills} />
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

  const AttributeAdjustments = ({ label, level }) => {
    const isSubtractingFromZero = (level, direction) => {
      if (level <= 0 && direction === "-") return true;
      else return false;
    };

    const adjustAttribute = (direction, level, isAdjusted) => {
      const mod = isAdjusted === true ? 1 : 0.5;
      if (direction === "-" && level > 0) {
        level -= mod;
      }
      if (direction === "+") {
        level += mod;
      }

      if (level < 0) {
        level = 0;
      }
      console.log(direction, level, isAdjusted);
      return level;
    };

    const CalculateAdjustment = (adjustedAttribute, direction) => {
      const oppositeDirection = direction === "+" ? "-" : "+";

      console.log([adjustedAttribute, attributes, direction]);

      let newValues = {
        [Attributes.Strength]: {
          level: attributes[Attributes.Strength].level,
        },
        [Attributes.Speed]: {
          level: attributes[Attributes.Speed].level,
        },
        [Attributes.Durability]: {
          level: attributes[Attributes.Durability].level,
        },
        [Attributes.Endurance]: {
          level: attributes[Attributes.Endurance].level,
        },
        [Attributes.Accuracy]: {
          level: attributes[Attributes.Accuracy].level,
        },
        [Attributes.Charm]: {
          level: attributes[Attributes.Charm].level,
        },
      };
      console.log("New Values Beginning", newValues);

      if (
        adjustedAttribute === Attributes.Strength &&
        isSubtractingFromZero(
          newValues[Attributes.Strength].level,
          direction
        ) == false
      ) {
        newValues[Attributes.Strength].level = adjustAttribute(
          direction,
          attributes[Attributes.Strength].level,
          true
        );
        newValues[Attributes.Speed].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Speed].level,
          false
        );
        newValues[Attributes.Durability].level = adjustAttribute(
          direction,
          attributes[Attributes.Durability].level,
          false
        );
        newValues[Attributes.Endurance].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Endurance].level,
          false
        );
        newValues[Attributes.Accuracy].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Accuracy].level,
          false
        );
      }
      if (
        adjustedAttribute === Attributes.Speed &&
        isSubtractingFromZero(newValues[Attributes.Speed].level, direction) ==
          false
      ) {
        newValues[Attributes.Strength].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Strength].level,
          false
        );
        newValues[Attributes.Speed].level = adjustAttribute(
          direction,
          attributes[Attributes.Speed].level,
          true
        );
        newValues[Attributes.Endurance].level = adjustAttribute(
          direction,
          attributes[Attributes.Endurance].level,
          false
        );
        newValues[Attributes.Accuracy].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Accuracy].level,
          false
        );
      }
      if (
        adjustedAttribute === Attributes.Durability &&
        isSubtractingFromZero(
          newValues[Attributes.Durability].level,
          direction
        ) == false
      ) {
        newValues[Attributes.Strength].level = adjustAttribute(
          direction,
          attributes[Attributes.Strength].level,
          false
        );
        newValues[Attributes.Speed].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Speed].level,
          false
        );
        newValues[Attributes.Durability].level = adjustAttribute(
          direction,
          attributes[Attributes.Durability].level,
          true
        );
        newValues[Attributes.Endurance].level = adjustAttribute(
          direction,
          attributes[Attributes.Endurance].level,
          false
        );
        newValues[Attributes.Accuracy].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Accuracy].level,
          false
        );
      }
      if (
        adjustedAttribute === Attributes.Endurance &&
        isSubtractingFromZero(
          newValues[Attributes.Endurance].level,
          direction
        ) == false
      ) {
        newValues[Attributes.Strength].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Strength].level,
          false
        );
        newValues[Attributes.Speed].level = adjustAttribute(
          direction,
          attributes[Attributes.Speed].level,
          false
        );
        newValues[Attributes.Durability].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Durability].level,
          false
        );
        newValues[Attributes.Endurance].level = adjustAttribute(
          direction,
          attributes[Attributes.Endurance].level,
          true
        );
      }
      if (
        adjustedAttribute === Attributes.Accuracy &&
        isSubtractingFromZero(
          newValues[Attributes.Accuracy].level,
          direction
        ) == false
      ) {
        newValues[Attributes.Strength].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Strength].level,
          false
        );
        newValues[Attributes.Speed].level = adjustAttribute(
          oppositeDirection,
          attributes[Attributes.Speed].level,
          false
        );
        newValues[Attributes.Accuracy].level = adjustAttribute(
          direction,
          attributes[Attributes.Accuracy].level,
          true
        );
      } else if (
        adjustedAttribute === Attributes.Charm &&
        isSubtractingFromZero(newValues[Attributes.Charm].level, direction) ==
          false
      ) {
        newValues[Attributes.Charm].level = adjustAttribute(
          direction,
          attributes[Attributes.Charm].level,
          true
        );
      } else {
        console.log("attribute passed not a registered attribute");
      }
      console.log("New Values : ", newValues);
      updateFighterAttributeLevels(newValues);
    };

    return (
      <Stack direction="row" spacing={5} borderTop={2} borderColor="gray">
        <Box width="50%">
          <Typography variant="h4">{label} : </Typography>
        </Box>
        {/* <IconButton
            aria-label="delete"
            size="small"
            onClick={() => CalculateAdjustment(label, "-")}
          >
            <RemoveCircleIcon fontSize="large" color="error" />
          </IconButton> */}
        <Box width="20%">
          <Typography variant="h4">{level}</Typography>
        </Box>
        {/* <IconButton
            aria-label="add"
            size="small"
            onClick={() => CalculateAdjustment(label, "+")}
          >
            <AddCircleIcon fontSize="large" color="success" />
          </IconButton> */}
        <Stack justifyContent="center">
          <LinearProgress
            variant="determinate"
            color="success"
            value={
              (attributes[label].currentExp /
                attributes[label].expToNextLevel) *
              100
            }
          />
          <Box minWidth={250} width="100%">
            <Typography variant="body2" color="text.secondary">
              {`${attributes[label].currentExp} / ${attributes[label].expToNextLevel}`}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    );
  };
  return (
    <Box>
      <Box textAlign="center" p="5px" borderBottom={2}>
        <Typography variant="h4">{fighter.name}</Typography>
      </Box>
      <Stack direction="row">
        <Box width="10%" height="100%" borderRight={2}>
          <ButtonGroup
            orientation="vertical"
            variant="text"
            sx={{ width: "100%", height: "100%" }}
          >
            <Stack direction="column" spacing={1}>
              <Button
                onClick={() => setCurrentData(tabComponentMap["Attributes"])}
              >
                Attributes
              </Button>
              <Button onClick={() => setCurrentData(tabComponentMap["Skills"])}>
                Skills
              </Button>
              <Button onClick={() => setCurrentData(tabComponentMap["Health"])}>
                Health
              </Button>
              <Button>Record</Button>
              <Button>Inventory</Button>
              <Button>Stats</Button>
              <Button>Contract</Button>
            </Stack>
          </ButtonGroup>
        </Box>
        <Box width="90%">{currentData}</Box>
      </Stack>
    </Box>
  );
};

export default RosterListItem;

{
  /* <Box flexGrow={1} display="flex">
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: "divider" }}
              >
                <Tab label="Attributes" />
                <Tab label="Skills" />
                <Tab label="Health" />
                <Tab label="Record" />
                <Tab label="Inventory" />
                <Tab label="Stats" />
                <Tab label="Contract" />
              </Tabs>
              <TabPanel value={value} index={0}>
                <Box>
                  <Typography variant="h6">Attributes</Typography>
                </Box>
                <Box alignItems="center" justifyContent="center">
                  <AttributeAdjustments
                    label={Attributes.Strength}
                    level={attributes[Attributes.Strength].level}
                  />
                  <AttributeAdjustments
                    label={Attributes.Speed}
                    level={attributes[Attributes.Speed].level}
                  />
                  <AttributeAdjustments
                    label={Attributes.Durability}
                    level={attributes[Attributes.Durability].level}
                  />
                  <AttributeAdjustments
                    label={Attributes.Endurance}
                    level={attributes[Attributes.Endurance].level}
                  />
                  <AttributeAdjustments
                    label={Attributes.Accuracy}
                    level={attributes[Attributes.Accuracy].level}
                  />
                  <AttributeAdjustments
                    label={Attributes.Charm}
                    level={attributes[Attributes.Charm].level}
                  />
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1}>
                  <SkillsTable fighter={fighter}/>
              </TabPanel>
            </Box> */
}
