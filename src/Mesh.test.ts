import { TestSuite, Test, expect } from "testyts";
import { Coord3 } from "./Coord3";
import { addCorner, extrudeCorner, makeEmptyMesh } from "./Mesh";

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

	@Test()
	addCorner() {
		const position = new Coord3({ x: 0, y: 0, z: 0 });
		const normal = new Coord3({ x: 0, y: 0, z: 1 });
		const { mesh, newCornerId } = addCorner(makeEmptyMesh(), {
			position,
			normal,
		});
		expect.toBeGreater(newCornerId, 0);
		expect.toBeEqual(mesh.highestId, newCornerId);
		expect.toBeEqual(mesh.cornerIds.size, 1);
		expect.toBeEqual(mesh.cornerAttributes.size, 1);
		expect.toBeEqual([...mesh.cornerAttributes.values()][0].position, position);
	}

	@Test()
	extrudeCorner() {
		const normal = new Coord3({ x: 0, y: 0, z: 1 });
		let { mesh, newCornerId } = addCorner(makeEmptyMesh(), {
			position: new Coord3({ x: -1, y: 0, z: 0 }),
			normal,
		});
		mesh = extrudeCorner(mesh, newCornerId, new Coord3({ x: 2, y: 0, z: 0 }));
		expect.toBeEqual(mesh.halfEdges.length, 2);
		expect.toBeEqual(mesh.halfEdges[0].polygonId, undefined);
		expect.toBeEqual(mesh.halfEdges[1].polygonId, undefined);
		expect.toBeEqual(
			mesh.halfEdges[0].nextEdgeIdAroundPolygon,
			mesh.halfEdges[1].id,
		);
		expect.toBeEqual(
			mesh.halfEdges[1].nextEdgeIdAroundPolygon,
			mesh.halfEdges[0].id,
		);
	}
}
