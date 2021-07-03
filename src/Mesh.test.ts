import { TestSuite, Test, expect } from "testyts";
import { makeEmptyMesh } from "./Mesh";

@TestSuite()
export class MeshTestSuite {
	@Test()
	makeEmptyMesh() {
		const mesh = makeEmptyMesh();
		expect.toBeEqual(mesh.highestId, 0);
		expect.toBeEqual(mesh.halfEdges.length, 0);
		expect.toBeEqual(mesh.polygonIds.size, 0);
		expect.toBeEqual(mesh.cornerIds.size, 0);
		expect.toBeEqual(mesh.cornerAttributes.size, 0);
		expect.toBeEqual(mesh.polygons.size, 0);
	}
}
