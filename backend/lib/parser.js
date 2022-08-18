import { parseStringPromise, processors } from "xml2js";
import _ from "lodash";

async function parseDocument(taskString, boxes) {
  let task = await parseStringPromise(taskString, {
    attrValueProcessors: [processors.parseNumbers],
  });
  const page = task.document.page[0];

  const width = page.$.width;
  const height = page.$.height;
  const scaledBoxes = scaleBoxes(boxes, width, height);

  let lines = page.block
    .filter((block) => block.$.blockType === "Text")
    .flatMap((block) => block.text)
    .flatMap((text) => text.par)
    .filter((par) => par)
    .flatMap((par) => par.line);

  let chars = lines
    .flatMap((line) => {
      const baseline = line.$.baseline;
      return line.formatting
        .flatMap((formatting) => formatting.charParams)
        .map((c) => {
          c.box = boxIndex(nodeCenter(c), scaledBoxes);
          c.baseline = baseline;
          return c;
        });
    })
    .filter((char) => char.box >= 0);

  let charHeight = _.mean(chars.map((c) => c.$.b - c.$.t));
  let charsGrouppedByBoxes = _.groupBy(chars, (e) => e.box);

  let result = [];
  for (let boxChars of Object.values(charsGrouppedByBoxes)) {
    let boxItems = groupByScore(boxChars, (it) => it.baseline, charHeight * 2);

    for (let item of boxItems) {
      let lines = groupByScore(item, (c) => c.baseline, charHeight * 0.8);

      let itemText = lines
        .map((line) =>
          line
            .sort((a, b) => a.$.l - b.$.l)
            .map((c) => c._)
            .map((c) => c || " ")
            .join("")
        )
        .join(" ");

      result.push(itemText);
    }
  }

  // postprocessing
  const itemRegex = /^(.{3,}?)(\(.*)?$/;
  return result
    .map((item) => item.match(itemRegex))
    .filter((match) => match)
    .map((it) => it[1])
    .map((item) => item.replaceAll("^", ".."))
    .map((item) => item.trim().toLowerCase());
}

function scaleBoxes(boxes, width, height) {
  return boxes.map((b) => ({
    l: b.l * width,
    t: b.t * height,
    r: b.r * width,
    b: b.b * height,
  }));
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
