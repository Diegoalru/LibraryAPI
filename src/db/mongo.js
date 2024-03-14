import mongoose from "mongoose";
import env from "env-var";

async function connect() {
  const uri = env.get("MONGO_URI").required().asString();

  try {
    return await mongoose
      .connect(uri, {
        dbName: process.env.MONGO_DB,
      })
      .then(() => {
        console.log("Conexión a MongoDB exitosa");
      });
  } catch (err) {
    console.error("Error de conexión a MongoDB:", err);
    return process.exit(1);
  }
}

export { connect };
