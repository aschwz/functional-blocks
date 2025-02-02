import * as Blockly from 'blockly/core';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const mapFn = {
  type: 'builtin_map',
  message0: 'map with %1 over %2',
  args0: [
    {
      type: 'input_value',
      name: 'FUN1',
    },
    {
      type: 'input_value',
      name: 'FUN2',
    },
  ],
  // previousStatement: null,
  // nextStatement: null,
  output: null,
  colour: 160,
  tooltip: 'Takes a function and map over every element in the given list',
  helpUrl: '',
};

const filterFn = {
  type: "builtin_filter",
  message0: "filter with %1 over %2",
  args0: [
    {
      type: 'input_value',
      name: 'FUN1',
    },
    {
      type: 'input_value',
      name: 'FUN2',
    },
  ],
  // previousStatement: null,
  // nextStatement: null,
  output: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
};

const foldrFn = {
  type: 'builtin_foldr',
  message0: 'foldr with %1 and base %2 over %3',
  args0: [
    {
      type: 'input_value',
      name: 'FUN1',
    },
    {
      type: 'input_value',
      name: 'FUN2',
    },
    {
      type: 'input_value',
      name: 'FUN3',
    },
  ],
  // previousStatement: null,
  // nextStatement: null,
  output: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
};

const reverseFn = {
  type: 'builtin_reverse',
  message0: 'reverse %1',
  args0: [
    {
      type: 'input_value',
      name: 'FUN1',
    },
  ],
  // previousStatement: null,
  // nextStatement: null,
  output: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
};

const zipWithFn = {
  type: 'builtin_zipWith',
  message0: 'zipWith %1 over %2 and %3',
  args0: [
    {
      type: 'input_value',
      name: 'FUN1',
    },
    {
      type: 'input_value',
      name: 'FUN2',
    },
    {
      type: 'input_value',
      name: 'FUN3',
    },
  ],
  output: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
}

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const builtinFns = Blockly.common.createBlockDefinitionsFromJsonArray([
  mapFn,
  filterFn,
  foldrFn,
  reverseFn,
  zipWithFn,
]);
