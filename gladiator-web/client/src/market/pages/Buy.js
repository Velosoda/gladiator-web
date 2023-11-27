import { ArrowDropDown } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import BuyOrderListItem from "market/components/BuyOrderListItem";
import React, { useState } from "react";
import Demo from "../components/index";
import "@react-awesome-query-builder/ui/css/styles.scss";


export const AssetType = {
  Fighter: "Fighter",
  Trainer: "Trainer",
  Consumable: "Consumable",
  Building: "Building",
  Weapon: "Weapon",
  Armour: "Armour",
};
const buyOrders = [
  {
    assetType: AssetType.Fighter,
    constraints: [
      {
        name: "Jab",
        levelRange: [10, 40],
      },
      {
        attribute: "Speed",
        levelRange: [10, 15],
      },
      {
        priceRange: [1000, 4000],
      },
    ],
  },
];

// const trainerFields = [];
// const consumableFields = [];
// const buildingfields = [];
// const weaponFields = [];
// const armourFields = [];

// const configMap = {
//   [AssetType.Fighter]: loadedConfig,
//   [AssetType.Trainer]: loadedConfig,
//   [AssetType.Consumable]: loadedConfig,
//   [AssetType.Building]: loadedConfig,
//   [AssetType.Weapon]: loadedConfig,
//   [AssetType.Armour]: loadedConfig,
// };

const Buy = (props) => {
  // const [flexFightCards, setFlexFightCards] = useState(fightCards);
  const [expandCreateBuyOrderForm, setExpandCreateBuyOrderForm] =
    useState(false);
  const [assetType, setAssetType] = useState();

  const [conditions, setConditions] = useState();
  const [flexBuyOrders, setFlexBuyOrders] = useState(buyOrders)

  const handleSetAssetType = (event) => {
    setAssetType(event.target.value);
  };

  const CreateBuyOrder = () => {
    const res = {
      assetType: assetType,
      constraints: conditions
    };
    console.log(res);
    buyOrders.push(res);
    const newBuyOrders = buyOrders;

    setFlexBuyOrders(newBuyOrders);
  };

  return (
    <Box>
      <Stack flex={1} direction="column" spacing={2} p={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setExpandCreateBuyOrderForm(!expandCreateBuyOrderForm)}
        >
          Create A New Buy Order
        </Button>
        <Collapse in={expandCreateBuyOrderForm}>
          <Stack
            spacing={3}
            useFlexGap
            maxHeight={1000}
            maxWidth="100%"
            border={2}
            p={2}
            borderRadius={3}
            overflow="scroll"
          >
            <Typography>Select an Asset Type to begin</Typography>
            <FormControl size="small" fullWidth>
              <InputLabel>Asset Type</InputLabel>
              <Select
                id="asset-type"
                value={assetType}
                label="Asset Type"
                onChange={handleSetAssetType}
              >
                {Object.keys(AssetType).map((key, index) => {
                  return <MenuItem value={key}>{key}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <Box>
              <Demo setConditions={setConditions}/>
            </Box>
            <Button onClick={CreateBuyOrder} variant="contained">
              Create
            </Button>
          </Stack>
        </Collapse>
        {flexBuyOrders.map((item, key) => (
          <Box key={key}>
            <BuyOrderListItem assetType={item.assetType} conditions={item.constraints}/>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Buy;
