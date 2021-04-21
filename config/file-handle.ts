import {
  ensureDirSync,
  existsSync,
} from "https://deno.land/std@0.94.0/fs/mod.ts";

export const fileWritePath = async (dataFiles: any, folder: string) => {
  const fileName = new Date().getTime() + ".png";
  const path = "./uploads/" + folder + "/";
  const isPathExists = await existsSync(path);
  if (!isPathExists) ensureDirSync(path);
  dataFiles.forEach(async (element: any) => {
    if (typeof element.filename == "string") {
      const unitArray8 = await Deno.readFile(element.filename);
      await Deno.writeFile(path + fileName, unitArray8), { create: true };
    }
  });
  return path + fileName;
};
