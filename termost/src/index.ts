import { format, message } from "./helpers/stdout";
import { exec } from "./helpers/process";

export { termost } from "./termost";
export type { Termost } from "./termost";
export const helpers = {
	exec,
	format,
	message,
};
