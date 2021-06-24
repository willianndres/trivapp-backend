import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { categories } from "../models/categories.model.ts";
import * as fileHandle from "../config/file-handle.ts";
import { Bson } from "https://deno.land/x/mongo@v0.22.0/mod.ts";

export const index = async (
  { request, response }: { request: Request; response: Response },
) => {
  const allCategories = await categories.find().toArray();
  response.status = 200;
  response.body = {
    all_categories: allCategories,
  };
};

export const addCategory = async (
  { request, response }: { request: Request; response: Response },
) => {
  const body = await request.body({ type: "form-data" });
  const data = await body.value.read();
  const name = data.fields.name;
  const file = await fileHandle.fileWritePath(data.files, "categories");
  const storeCat = await categories.insertOne({
    name,
    file,
  });
  if (storeCat) {
    response.status = 200;
    response.body = {
      message: "Se ha almacenado correctamente la categoría.",
    };
  } else {
    response.status = 500;
    response.body = {
      message: "Algo ha ocurrido mal",
    };
  }
};

export const deleteCategory = async (
  { request, response }: {
    request: Request;
    response: Response;
  },
) => {
  const body = await request.body();
  const values = await body.value;
  if (values.id) {
    const delCategory = await categories.deleteOne({
      _id: new Bson.ObjectId(values.id),
    });
    const allCategories = await categories.find().toArray();
    if (delCategory) {
      response.status = 200;
      response.body = {
        message: "Se ha eliminado correctamente la categoría.",
        all_categories: allCategories,
      };
    }
  } else {
    response.status = 404;
    response.body = {
      message: "No se ha encontrado el ID en la instrucción.",
    };
  }
};

export const getById = async (
  { request, response, params }: {
    request: Request;
    response: Response;
    params: { id: string };
  },
) => {
  const getCategoryById = await categories.findOne({
    _id: new Bson.ObjectId(params.id),
  });

  if (typeof getCategoryById !== "undefined") {
    response.status = 200;
    response.body = {
      category_object: getCategoryById,
    };
  } else {
    response.status = 404;
    response.body = {
      message: "No se ha encontrado el ID en la instrucción.",
    };
  }
};

export const updateCategory = async (
  { request, response }: { request: Request; response: Response },
) => {
  const body = await request.body({ type: "form-data" });
  const data = await body.value.read();

  const categoryObject = await categories.findOne({
    _id: new Bson.ObjectId(data.fields.id),
  });
  let file = "";
  if (typeof categoryObject !== "undefined") {
    if (typeof data.files !== "undefined" && data.fields.file != "") {
      Deno.removeSync(categoryObject.file);
      file = await fileHandle.fileWritePath(data.files, "categories");
    }
    if (file != "") {
      const updateCat = await categories.updateOne(
        { _id: new Bson.ObjectId(data.fields.id) },
        { $set: { name: data.fields.name, file } },
      );
      if (updateCat) {
        response.status = 200;
        response.body = {
          message: "Se ha actualizado correctamente la categoría.",
        };
      } else {
        response.status = 404;
        response.body = {
          message: "No se ha podido encontrar el recurso.",
        };
      }
    } else {
      const updateCat = await categories.updateOne(
        { _id: new Bson.ObjectId(data.fields.id) },
        { $set: { name: data.fields.name } },
      );
      if (updateCat) {
        response.status = 200;
        response.body = {
          message: "Se ha actualizado correctamente la categoría.",
        };
      } else {
        response.status = 404;
        response.body = {
          message: "No se ha podido encontrar el recurso.",
        };
      }
    }
  } else {
    response.status = 400;
    response.body = {
      message: "No se cuentra la categoría con el ID especificado.",
    };
  }
};
