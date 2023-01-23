import {
  rectsToString,
  stringToRects,
  convertTZ,
  escapeMarkdown,
} from "../dist/lib/utils/util.js";

describe("rects-string converter", () => {
  it("convert to and back", () => {
    let rects = [
      {
        l: 0.125,
        t: 0.419,
        r: 0.44575471698113206,
        b: 0.5241090146750524,
      },
      {
        l: 0.5023584905660378,
        t: 0.4129979035639413,
        r: 0.8073899371069182,
        b: 0.5251572327044025,
      },
    ];

    let string = rectsToString(rects);
    expect(string).toEqual("125.419.446.524.502.413.807.525");

    let rectsFromString = stringToRects(string);
    expect(rectsFromString).toEqual([
      {
        l: 0.125,
        t: 0.419,
        r: 0.446,
        b: 0.524,
      },
      {
        l: 0.502,
        t: 0.413,
        r: 0.807,
        b: 0.525,
      },
    ]);
  });
});

describe("convertTZ", () => {
  it("shows correct hour at minsk", () => {
    const dateAtMinsk = convertTZ(
      new Date(Date.UTC(2022, 7, 9, 19)),
      "Europe/Minsk"
    );

    expect(dateAtMinsk.getHours()).toEqual(22);
  });
});

describe("escapeMarkdown", () => {
  it("doesnt change regular text", () => {
    const result = escapeMarkdown("hello world");

    expect(result).toEqual("hello world");
  });

  it("escapes special characters", () => {
    const specialCharacters = "_*[]()~`>#+-=|{}.!";
    const result = escapeMarkdown(specialCharacters);

    expect(result).toHaveLength(specialCharacters.length * 2);
  });
});
