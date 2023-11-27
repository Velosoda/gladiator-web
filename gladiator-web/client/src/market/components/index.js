/*eslint no-unused-vars: ["off", {"varsIgnorePattern": "^_"}]*/
import React, { Component } from "react";
import { Utils, Query, Builder } from "@react-awesome-query-builder/mui";
import loadedConfig from "./config";
import loadedInitValue from "./init_value";
import loadedInitLogic from "./init_logic";
import { Box, Button } from "@mui/material";
const stringify = JSON.stringify;
const {
  jsonLogicFormat,
  queryString,
  mongodbFormat,
  sqlFormat,
  getTree,
  checkTree,
  loadTree,
  uuid,
  loadFromJsonLogic,
} = Utils;
const preStyle = {
  backgroundColor: "darkgrey",
  margin: "10px",
  padding: "10px",
};
const preErrorStyle = {
  backgroundColor: "lightpink",
  margin: "10px",
  padding: "10px",
};

const emptyInitValue = { id: uuid(), type: "group" };

// get init value in JsonTree format:
const initValue =
  loadedInitValue && Object.keys(loadedInitValue).length > 0
    ? loadedInitValue
    : emptyInitValue;
const initTree = checkTree(loadTree(initValue), loadedConfig);

// -OR- alternativaly get init value in JsonLogic format:
//const initLogic = loadedInitLogic && Object.keys(loadedInitLogic).length > 0 ? loadedInitLogic : undefined;
//const initTree = checkTree(loadFromJsonLogic(initLogic, loadedConfig), loadedConfig);

export default class DemoQueryBuilder extends Component  {
  state = {
    tree: initTree,
    config: loadedConfig,
  };

  render = () => (
    <Box>
      <Query
        {...loadedConfig}
        value={this.state.tree}
        onChange={this.onChange}
        renderBuilder={this.renderBuilder}
      />

      <Button onClick={this.resetValue}>reset</Button>
      <Button onClick={this.clearValue}>clear</Button>

      <Box className="query-builder-result">{this.renderResult(this.state)}</Box>
    </Box>
  );

  resetValue = () => {
    this.setState({
      tree: initTree,
    });
  };

  clearValue = () => {
    this.setState({
      tree: loadTree(emptyInitValue),
    });
  };

  renderBuilder = (props) => (
    <Box className="query-builder-container" minWidth={100}>
      <Box className="query-builder">
        <Builder {...props} />
      </Box>
    </Box>
  );

  onChange = (immutableTree, config) => {
    this.immutableTree = immutableTree;
    this.config = config;
    this.updateResult();

    // `jsonTree` or `logic` can be saved to backend
    // (and then loaded with `loadTree` or `loadFromJsonLogic` as seen above)
    const jsonTree = getTree(immutableTree);
    const { logic, data, errors } = jsonLogicFormat(immutableTree, config);
    this.props.setConditions(jsonTree)
  };

  updateResult = () => {
    this.setState({ tree: this.immutableTree, config: this.config });
  };

  renderResult = ({ tree: immutableTree, config }) => {
    const { logic, data, errors } = jsonLogicFormat(immutableTree, config);
    return (
      <Box>
        <div>
          mongodbFormat:
          <pre style={preStyle}>
            {stringify(mongodbFormat(immutableTree, config), undefined, 2)}
          </pre>
        </div>
      </Box>
    );
  };
}
