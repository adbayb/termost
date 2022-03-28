import { exec } from "./helpers/process";
import { format, message } from "./helpers/stdout";

export { termost } from "./termost";
export type { Termost } from "./termost";
export const helpers = {
	exec,
	format,
	message,
};
