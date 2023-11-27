import React from "react";
import merge from "lodash/merge";
import { MuiConfig } from "@react-awesome-query-builder/mui";
import { Attributes } from "promotion/pages/Roster";
const InitialConfig = MuiConfig;


//////////////////////////////////////////////////////////////////////

const fields = {
  moves: {
    label: "Moves",
    type: "select",
    valueSources: ["value"],
    fieldSettings: {
      listValues: [
        { value: "jab", title: "Jab" },
        { value: "hook", title: "Hook" },
        { value: "uppercut", title: "Uppercut" }
      ],
    }
  },
  level: {
    label: "Level",
    type: "number",
    preferWidgets: ["number"],
    fieldSettings: {
      min: 0,
      max: 100
    },
    //overrides
    widgets: {
      slider: {
        widgetProps: {
          valuePlaceholder: "..Slider",
        }
      }
    },
  },
  fighter: {
    label: "Fighter",
    tooltip: "Group of fields",
    type: "!struct",
    subfields: {
      popularity: {
        label: "Popularity",
        type: "number",
        preferWidgets: ["number"],
        fieldSettings: {
          min: 0,
          max: 10
        },
        //overrides
        widgets: {
          slider: {
            widgetProps: {
              valuePlaceholder: "..Slider",
            }
          }
        },
      },
    }
  },
  attributes: {
    label: "Attributes",
    tooltip: "Group of fields",
    type: "!struct",
    subfields: {
      accuracy:{
        label: "Accuracy",
        type: "number",
        preferWidgets: ["number"],
        fieldSettings: {
          min: 0,
          max: 100
        },
        //overrides
        widgets: {
          slider: {}
        },
      },
      strength:{
        label: "Strength",
        type: "number",
        preferWidgets: ["number"],
        fieldSettings: {
          min: 0,
          max: 100
        },
        //overrides
        widgets: {
          slider: {
            widgetProps: {
              valuePlaceholder: "..Slider",
            }
          }
        },
      },
      speed:{
        label: "Speed",
        type: "number",
        preferWidgets: ["number"],
        fieldSettings: {
          min: 0,
          max: 100
        },
        //overrides
        widgets: {
          slider: {
            widgetProps: {
              valuePlaceholder: "..Slider",
            }
          }
        },
      },
      durability:{
        label: "Durability",
        type: "number",
        preferWidgets: ["number"],
        fieldSettings: {
          min: 0,
          max: 100
        },
        //overrides
        widgets: {
          slider: {
            widgetProps: {
              valuePlaceholder: "..Slider",
            }
          }
        },
      },
      endurance:{
        label: "Endurance",
        type: "number",
        preferWidgets: ["number"],
        fieldSettings: {
          min: 0,
          max: 100
        },
        //overrides
        widgets: {
          slider: {
            widgetProps: {
              valuePlaceholder: "..Slider",
            }
          }
        },
      },
      charm:{
        label: "Charm",
        type: "number",
        preferWidgets: ["number"],
        fieldSettings: {
          min: 0,
          max: 100
        },
        //overrides
        widgets: {
          slider: {
            widgetProps: {
              valuePlaceholder: "..Slider",
            }
          }
        },
      },
    }
    // fieldSettings: {
    //   listValues: [
    //     { value: Attributes.Accuracy, title: Attributes.Accuracy },
    //     { value: Attributes.Charm, title: Attributes.Charm },
    //     { value: Attributes.Durability, title: Attributes.Durability },
    //     { value: Attributes.Endurance, title: Attributes.Endurance },
    //     { value: Attributes.Speed, title: Attributes.Speed },
    //     { value: Attributes.Strength, title: Attributes.Strength },
    //   ],
    // }
  }
};


//////////////////////////////////////////////////////////////////////

const conjunctions = {
  AND: InitialConfig.conjunctions.AND,
  OR: InitialConfig.conjunctions.OR,
};

const operators = {
  ...InitialConfig.operators,
  // examples of  overriding
  // between: {
  //   ...InitialConfig.operators.between,
  //   textSeparators: [
  //     "from",
  //     "to"
  //   ],
  // },
};
delete operators.proximity;

const widgets = {
  ...InitialConfig.widgets,
  // examples of  overriding
  slider: {
    ...InitialConfig.widgets.slider,
    customProps: {
      width: "300px"
    }
  },
  rangeslider: {
    ...InitialConfig.widgets.rangeslider,
    customProps: {
      width: "300px"
    }
  },
  date: {
    ...InitialConfig.widgets.date,
    dateFormat: "DD.MM.YYYY",
    valueFormat: "YYYY-MM-DD",
  },
  time: {
    ...InitialConfig.widgets.time,
    timeFormat: "HH:mm",
    valueFormat: "HH:mm:ss",
  },
  datetime: {
    ...InitialConfig.widgets.datetime,
    timeFormat: "HH:mm",
    dateFormat: "DD.MM.YYYY",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
  },
};


const types = {
  ...InitialConfig.types,
//   // examples of  overriding
//   boolean: merge({}, InitialConfig.types.boolean, {
//     widgets: {
//       boolean: {
//         widgetProps: {
//           hideOperator: true,
//           operatorInlineLabel: "is",
//         }
//       },
//     },
//   }),
};


const localeSettings = {
  locale: {
    moment: "ru",
  },
  valueLabel: "Value",
  valuePlaceholder: "Value",
  fieldLabel: "Field",
  operatorLabel: "Operator",
  fieldPlaceholder: "Select field",
  operatorPlaceholder: "Select operator",
  deleteLabel: null,
  addGroupLabel: "Add Requirement Group",
  addRuleLabel: "Add Requirement",
  addSubRuleLabel: "Add sub rule",
  delGroupLabel: null,
  notLabel: "Not",
  fieldSourcesPopupTitle: "Select source",
  valueSourcesPopupTitle: "Select value source",
};

const settings = {
  ...InitialConfig.settings,
  ...localeSettings,

  // canReorder: false,
  // canRegroup: false,
  // showNot: false,
  // showLabels: true,
  
  maxNesting: 10,
  canLeaveEmptyGroup: true, //after deletion

};

const funcs = {};

const ctx = InitialConfig.ctx;

const config = {
  ctx,
  conjunctions,
  operators,
  widgets,
  types,
  settings,
  fields,
  funcs
};

export default config;

