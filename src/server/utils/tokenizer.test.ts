import { MatchMetadata } from "../../types";
import { tokenizer } from "./tokenizer";

describe("tokenizer", () => {
  test.each<[string | string[] | null | undefined, MatchMetadata, any[]]>([
    [null, {}, []],
    [
      ["already", "tokenized"],
      {},
      [
        {
          str: "already",
          metadata: {},
        },
        {
          str: "tokenized",
          metadata: {},
        },
      ],
    ],
    [
      "api_gateway: Good.",
      {},
      [
        {
          metadata: {
            index: 0,
            position: [0, 11],
          },
          str: "api_gateway",
        },
        {
          metadata: {
            index: 1,
            position: [0, 3],
          },
          str: "api",
        },
        {
          metadata: {
            index: 2,
            position: [4, 7],
          },
          str: "gateway",
        },
        {
          metadata: {
            index: 3,
            position: [13, 4],
          },
          str: "good",
        },
      ],
    ],
  ])("tokenizer('%s') should return %j", (input, metadata, tokens) => {
    expect(tokenizer(input, metadata)).toEqual(tokens);
  });
});
