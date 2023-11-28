import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import RosterListItem from "promotion/components/RosterListItem";
import SkillsTable from "promotion/components/SkillsTable";
import React, { useState } from "react";

export const SkillTypes = {
  Boxing: "Boxing",
  KickBoxing: "KickBoxing",
  Unarmed: "Unarmed",
  SingleWeapon: "Single Weapon",
  FreeCombat: "Free Combat",
};

export const Attributes = {
  Strength: "Strength",
  Speed: "Speed",
  Durability: "Durability",
  Endurance: "Endurance",
  Accuracy: "Accuracy",
  Charm: "Charm",
};

export const LimbTypes = {
  Head: "Head",
  Torso: "Torso",
  LeftArm: "Left Arm",
  RightArm: "Right Arm",
  LeftLeg: "Left Leg",
  RightLeg: "Right Leg",
};

const fighters = [
  {
    name: "Fighter 1",
    popularity: 10,
    money: 100,
    speed: 50,
    record: {
      wins: 4,
      losses: 10,
      noContests: 2,
    },
    health: {
      overallHealth: 100,
      currentOverallHealth: 100,
      isDead: false,
      limbs: {
        [LimbTypes.Head]: {
          currentHealth: 100,
          overallHealth: 100,
          isSevered: "No",
          canBeSevered: true,
          value: 5,
        },
        [LimbTypes.Torso]: {
          currentHealth: 100,
          overallHealth: 100,
          isSevered: "No",
          canBeSevered: false,
          value: 5,
        },
        [LimbTypes.LeftArm]: {
          currentHealth: 100,
          overallHealth: 100,
          isSevered: "No",
          canBeSevered: false,
          value: 2,
        },
        [LimbTypes.RightArm]: {
          currentHealth: 100,
          overallHealth: 100,
          isSevered: "No",
          canBeSevered: false,
          value: 2,
        },
        [LimbTypes.LeftLeg]: {
          currentHealth: 100,
          overallHealth: 100,
          isSevered: "No",
          canBeSevered: false,
          value: 2,
        },
        [LimbTypes.RightLeg]: {
          currentHealth: 100,
          overallHealth: 100,
          isSevered: "No",
          canBeSevered: false,
          value: 2,
        },
      },
    },
    attributes: {
      [Attributes.Strength]: {
        level: 10.0,
        currentExp: 19,
        expToNextLevel: 50,
      },
      [Attributes.Speed]: {
        level: 10.0,
        currentExp: 30,
        expToNextLevel: 50,
      },
      [Attributes.Durability]: {
        level: 10.0,
        currentExp: 49,
        expToNextLevel: 50,
      },
      [Attributes.Endurance]: {
        level: 10.0,
        currentExp: 20,
        expToNextLevel: 50,
      },
      [Attributes.Accuracy]: {
        level: 10.0,
        currentExp: 40,
        expToNextLevel: 50,
      },
      [Attributes.Charm]: {
        level: 10.0,
        currentExp: 10,
        expToNextLevel: 50,
      },
    },
    skills: {
      [SkillTypes.Boxing]: [
        {
          name: "Jab",
          targets: [LimbTypes.Head, LimbTypes.Torso],
          strikingLimb: LimbTypes.LeftArm,
          level: 44,
          baseMoveDamage: 5,
          accuracy: 10,
          expPerLand: 1,
          levelRequirement: 10,
          energyCost: 5,
          criticalChance: 0,
          hypeOnTargetHit: 10,
          canSevereLimb: false,
          currentExp: 0,
          expToNexLevel: 15,
          throws: 10,
          targetHits: 4,
          hits: 7,
          misses: 3,
          damage: 40,
          hitRate: 0.7,
          targetHitRate: 0.4,
          missRate: 0.3,
        },
        {
          name: "Jab",
          targets: [LimbTypes.Head, LimbTypes.Torso],
          strikingLimb: LimbTypes.RightArm,
          level: 20,
          baseMoveDamage: 5,
          accuracy: 10,
          expPerLand: 1,
          levelRequirement: 10,
          energyCost: 5,
          criticalChance: 0,
          hypeOnTargetHit: 10,
          canSevereLimb: false,
          currentExp: 0,
          expToNexLevel: 15,
          throws: 10,
          targetHits: 4,
          hits: 7,
          misses: 3,
          damage: 40,
          hitRate: 0.7,
          targetHitRate: 0.4,
          missRate: 0.3,
        },
        {
          name: "Hook",
          targets: [LimbTypes.Head, LimbTypes.Torso],
          strikingLimb: LimbTypes.RightArm,
          level: 20,
          baseMoveDamage: 5,
          accuracy: 10,
          expPerLand: 1,
          levelRequirement: 10,
          energyCost: 5,
          criticalChance: 0,
          hypeOnTargetHit: 10,
          canSevereLimb: false,
          currentExp: 0,
          expToNexLevel: 15,
          throws: 10,
          targetHits: 4,
          hits: 7,
          misses: 3,
          damage: 40,
          hitRate: 0.7,
          targetHitRate: 0.4,
          missRate: 0.3,
        },
        {
          name: "Hook",
          targets: [LimbTypes.Head, LimbTypes.Torso],
          strikingLimb: LimbTypes.LeftArm,
          level: 20,
          baseMoveDamage: 5,
          accuracy: 10,
          expPerLand: 1,
          levelRequirement: 10,
          energyCost: 5,
          criticalChance: 0,
          hypeOnTargetHit: 10,
          canSevereLimb: false,
          currentExp: 0,
          expToNexLevel: 15,
          throws: 10,
          targetHits: 4,
          hits: 7,
          misses: 3,
          damage: 40,
          hitRate: 0.7,
          targetHitRate: 0.4,
          missRate: 0.3,
        },
        {
          name: "Hook",
          targets: [LimbTypes.Head, LimbTypes.Torso],
          strikingLimb: LimbTypes.LeftArm,
          level: 20,
          baseMoveDamage: 5,
          accuracy: 10,
          expPerLand: 1,
          levelRequirement: 10,
          energyCost: 5,
          criticalChance: 0,
          hypeOnTargetHit: 10,
          canSevereLimb: false,
          currentExp: 0,
          expToNexLevel: 15,
          throws: 10,
          targetHits: 4,
          hits: 7,
          misses: 3,
          damage: 40,
          hitRate: 0.7,
          targetHitRate: 0.4,
          missRate: 0.3,
        },
        {
          name: "Hook",
          targets: [LimbTypes.Head, LimbTypes.Torso],
          strikingLimb: LimbTypes.LeftArm,
          level: 20,
          baseMoveDamage: 5,
          accuracy: 10,
          expPerLand: 1,
          levelRequirement: 10,
          energyCost: 5,
          criticalChance: 0,
          hypeOnTargetHit: 10,
          canSevereLimb: false,
          currentExp: 0,
          expToNexLevel: 15,
          throws: 10,
          targetHits: 4,
          hits: 7,
          misses: 3,
          damage: 40,
          hitRate: 0.7,
          targetHitRate: 0.4,
          missRate: 0.3,
        },
      ],
    },
    currentHealth: 89,
    moves: [
      {
        name: "Jab",
        landed: 10,
        thrown: 45,
        level: 10,
      },
      {
        name: "Cross",
        landed: 10,
        thrown: 45,
        level: 13,
      },
      {
        name: "Hook",
        landed: 10,
        thrown: 45,
        level: 20,
      },
    ],
  },
];

const Roster = (props) => {
  const [isExpanded, setExpanded] = useState(false);
  const handleExpand = () => {
    setExpanded(!isExpanded);
  };
  const containerStyle = {
    overflow: "hidden",
    transition: "width 0.5s ease", // Adjust the duration and easing as needed
    width: isExpanded ? "100%" : "auto", // Set the maximum width when expanded
  };

  const tabComponentMap = {
    Attributes: <AttributesTable attributes={fighter.attributes} />,
    Skills: <SkillsTable skills={fighter.skills} />,
    Health: <HealthTable health={fighter.health} />,
  };
  
  const fighterMenuCatagories = ["Attributes", "Skills", "Health"]
  return (
    <Stack direction="column" spacing={2} p={2}>
      <Box border={1} width="100%" minWidth="20%" height={200}></Box>
      {fighters.map((item, key) => (
        <>
          <Box
            component={Paper}
            key={key}
            maxHeight="500px"
            border={4}
            borderRadius={3}
          >
            <RosterListItem fighter={item} />
          </Box>
          <Box
            component={Paper}
            key={key}
            height="500px"
            width="100%"
            border={4}
            borderRadius={3}
          >
            <Box
              height="10%"
              width="100%"
              borderBottom={4}
              justifyContent="center"
            >
              <Typography variant="h4" align="center">
                {" "}
                {item.name}{" "}
              </Typography>
            </Box>
            <Stack direction="row" height="100%">
              <Box width="20%" height="90%" borderRight="4px">
                <ButtonGroup
                  variant="text"
                  orientation="vertical"
                  style={{
                    display: "flex",
                    gap: 0,
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Button style={{ flex: 1 }}>Attributes</Button>
                  <Button style={{ flex: 1 }}>Skills</Button>
                  <Button style={{ flex: 1 }}>Health</Button>
                  <Button style={{ flex: 1 }}>Record</Button>
                  <Button style={{ flex: 1 }}>Inventory</Button>
                  <Button style={{ flex: 1 }}>Stats</Button>
                  <Button style={{ flex: 1 }}>Contract</Button>
                </ButtonGroup>
              </Box>
            </Stack>
          </Box>
          <Stack direction="row" style={containerStyle}>
            <Box width="20%" borderRight="4px">
              <ButtonGroup
                variant="text"
                orientation="vertical"
                style={{
                  display: "flex",
                  gap: 0,
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {
                  fighterMenuCatagories.map((value, index) => {
                    <Button onClick={handleExpand} style={{ flex: 1 }}>
                      {value}
                    </Button>
                  })
                }
                <Button onClick={handleExpand} style={{ flex: 1 }}>
                  Record
                </Button>
                <Button onClick={handleExpand} style={{ flex: 1 }}>
                  Inventory
                </Button>
                <Button onClick={handleExpand} style={{ flex: 1 }}>
                  Stats
                </Button>
                <Button onClick={handleExpand} style={{ flex: 1 }}>
                  Contract
                </Button>
              </ButtonGroup>
            </Box>
            {isExpanded ? 'Collapse' : ""}
          </Stack>
        </>
      ))}
    </Stack>
  );
};

export default Roster;
