import fs from "fs";
import path from "path";
import { PackageMetadata } from "../../types";

export const findNearestPackageJson = (pathname: string): PackageMetadata => {
	const packagePathname = path.resolve(pathname, "package.json");

	if (isFileExists(packagePathname)) {
		return require(packagePathname);
	}

	return findNearestPackageJson(path.resolve(pathname, ".."));
};

const isFileExists = (pathname: string) => {
	try {
		fs.accessSync(pathname, fs.constants.F_OK);

		return true;
	} catch {
		return false;
	}
};

export const getPackageMetadata = () => {
	const mainFilename = require.main?.filename;

	if (!mainFilename) {
		throw new Error(
			"Termost was unable to retrieve automatically the package name and version. To fix it, use `termost({ name, description, version })` to define them manually."
		);
	}

	return findNearestPackageJson(path.dirname(mainFilename));
};
