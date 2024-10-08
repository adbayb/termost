import { accessSync, constants } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

import type { PackageMetadata } from "../../types";

const binCallerPath = process.argv[1] ?? "";
const require = createRequire(binCallerPath);

export const getPackageMetadata = (
	pathname: string = binCallerPath,
): PackageMetadata => {
	try {
		const packagePathname = resolve(pathname, "package.json");

		if (isFileExists(packagePathname)) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			return require(packagePathname) as PackageMetadata;
		}

		return getPackageMetadata(resolve(pathname, ".."));
	} catch (error) {
		throw new Error(
			`Termost was unable to retrieve automatically the package name and version. To fix it, use \`termost({ name, description, version })\` to define them manually.\nMore details: ${String(error)}.`,
		);
	}
};

const isFileExists = (pathname: string) => {
	try {
		accessSync(pathname, constants.F_OK);

		return true;
	} catch {
		return false;
	}
};
