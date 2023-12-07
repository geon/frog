import { App } from "./App";
import { Mesh } from "./Mesh";

const app = new App();

app.addMesh(Mesh.makeCube());
app.draw();
