import { exec } from "./helpers/process";
import { format, print } from "./api/message/helpers";

export const helpers = {
	exec,
	format,
	print,
};

export { termost } from "./termost";

export type { Program } from "./api/program";
