import { knownTypes } from "..";

export var typesFlyoutCallback = function(workspace) {
  // Returns an array of hex colours, e.g. ['#4286f4', '#ef0447']
  var blockList = [
        {
          kind: 'block',
          type: 'defn_type',
        },
        {
            kind: 'block',
            type: 'sum_type',
        },
    ];
    // knownTypes.forEach(x => blockList.push({
    //     kind: 'block',
    //     type: x.
    // }));
  return blockList;
};
