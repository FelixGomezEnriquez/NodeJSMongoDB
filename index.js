import { MongoClient } from "mongodb";
import express from "express";
import body_parser from "body-parser";
import path from "path";

const app = express();
app.use(body_parser.json());
const router = express.Router();
var __dirname = path.resolve(); //Resuelve y adapta para módulos ES6

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

router.post("/insertar", (req, res) => {
  let nombre = req.body.nombre;
  let apellidos = req.body.apellidos;
  var url =
    "mongodb+srv://felix:12345@atlascluster.39kxyc8.mongodb.net/Empleados";
  insertar(url, nombre, apellidos);
});

router.get("/leer", (req, response) => {
  var url =
    "mongodb+srv://felix:12345@atlascluster.39kxyc8.mongodb.net/Empleados";

  leer(url).then((res) => {
    console.log(res);
    response.json(res);
  });

});

app.use("/", router);
app.use(express.static(__dirname)); //IMPORTANTE carga archivos js,css, etc.., cargados en los html desde directorio
app.listen(3000);
console.log("Escuchando en puerto 3000");

async function insertar(url, nombre, apellidos) {
  const client = new MongoClient(url, { monitorCommands: true });
  await client
    .db()
    .collection("nombres")
    .insertOne({ nombre: nombre, apellidos: apellidos }); 
}
async function leer(url) {
  const client = new MongoClient(url, { monitorCommands: true });

  await client.on("commandStarted", (started) => {});

  const nombres = await client.db().collection("nombres").find({}).toArray();

  return JSON.stringify(nombres);
}
