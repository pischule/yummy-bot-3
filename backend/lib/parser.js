import { parseStringPromise, processors } from "xml2js";
import _ from "lodash";

async function parseDocument(taskString, boxes) {
  let task = await parseStringPromise(taskString, {
    attrValueProcessors: [processors.parseNumbers],
  });
  const page = task.document.page[0];

  const width = page.$.width;
  const height = page.$.height;

  const scaledBoxes = boxes.map((b) => ({
    l: b.l * width,
    t: b.t * height,
    r: b.r * width,
    b: b.b * height,
  }));

  let lines = page.block
    .filter((block) => block.$.blockType === "Text")
    .flatMap((block) => block.text)
    .flatMap((text) => text.par)
    .filter((par) => par)
    .flatMap((par) => par.line)
    .filter((line) => line?.formatting?.[0].charParams);

  let charHeights = [];
  let allText = lines
    .map((line) => {
      let lineBoxIndex = boxIndex(nodeCenter(line), scaledBoxes);
      let formatting = line.formatting[0];

      let lineText = formatting.charParams
        .filter(
          (charParam) =>
            boxIndex(nodeCenter(charParam), scaledBoxes) === lineBoxIndex
        )
        .map((charParam) => charParam._ ?? " ")
        .join("");

      charHeights.push(
        _.mean(line.formatting[0].charParams.map((p) => p.$.b - p.$.t))
      );

      return {
        text: lineText,
        x: line.$.l,
        y: line.$.baseline,
        lineBoxIndex,
      };
    })
    .filter((line) => line.lineBoxIndex > -1);

  let averageCharHeight = _.mean(charHeights);
  let textBoxes = _.groupBy(allText, (e) => e.lineBoxIndex);

  let result = [];
  for (let boxLines of Object.values(textBoxes)) {
    let blockItems = groupByScore(
      boxLines,
      (it) => it.y,
      averageCharHeight * 2
    );
    for (let block of blockItems) {
      let linesText = groupByScore(block, (it) => it.y, averageCharHeight * 0.8)
        .flatMap((wordGroup) => wordGroup)
        .map((wordGroup) => wordGroup.text)
        .join(" ");
      result.push(linesText);
    }
  }

  // postprocessing
  const itemRegex = /^(.*?)(\(.*)?$/;
  return result
    .map((item) => item.match(itemRegex))
    .filter((match) => match)
    .map((it) => it[1])
    .map((item) => item.trim().toLowerCase());
}

function boxContains(box, point) {
  let { l, t, r, b } = box;
  let { x, y } = point;
  return l <= x && x <= r && t <= y && y <= b;
}

function boxIndex(point, boxes) {
  return _.findIndex(boxes, (box) => boxContains(box, point));
}

function groupByScore(arr, scoreFn, groupDistance) {
  if (!arr) return [];
  arr.sort((a, b) => scoreFn(a) - scoreFn(b));
  let groups = [];
  let currentGroup = [arr[0]];
  for (let i = 0; i < arr.length - 1; ++i) {
    if (scoreFn(arr[i + 1]) - scoreFn(arr[i]) > groupDistance) {
      groups.push(currentGroup);
      currentGroup = [];
    }
    currentGroup.push(arr[i + 1]);
  }
  if (currentGroup) {
    groups.push(currentGroup);
  }
  return groups;
}

function nodeCenter(node) {
  let { l, r, t, b } = node.$;
  return {
    x: (l + r) / 2,
    y: (t + b) / 2,
  };
}

export { parseDocument };
