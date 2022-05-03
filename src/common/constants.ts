export const PORT = Number(process.env.PORT || 80);

export const VERSION = "1.0.0";
export const SERVER_TITLE = "API Server";
export const SERVER_DESCRIPTION = "API Template Server For Typescript";

export const validateConstants = () => {
  if (Number.isNaN(PORT)) {
    throw new Error("Invalid env[PORT]");
  }
};
