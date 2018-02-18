export type AppearanceComponent =
  | {
      type: "rectangle";
      data: { rect: { height: number; width: number; color: string } };
    }
  | {
      type: "shape";
      data: {
        size: { width: number; height: number };
        shape: number[];
        color: string;
      };
    };
