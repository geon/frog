import { TestSuite, Test, expect } from "testyts";
import { Coord3 } from "./Coord3";
import { addCorner, extrudeCorner, makeEmptyMesh } from "./Mesh";

@TestSuite()
export class MeshTestSuite {
	@Test()
	makeEmptyMesh() {
		const mesh = makeEmptyMesh();
		expect.toBeEqual(mesh.halfEdges.length, 0);
		expect.toBeEqual(mesh.polygons.length, 0);
		expect.toBeEqual(mesh.corners.length, 0);
		expect.toBeEqual(mesh.cornerAttributes.size, 0);
	}

	@Test()
	addCorner() {
		const { mesh, position } = makeOneCornerMesh();
		expect.toBeEqual(mesh.corners.length, 1);
		expect.toBeEqual(mesh.cornerAttributes.size, 1);
		expect.toBeEqual([...mesh.cornerAttributes.values()][0].position, position);
	}

	@Test()
	extrudeCorner() {
		let { mesh, newCorner } = makeOneCornerMesh();
		mesh = extrudeCorner(mesh, newCorner, new Coord3({ x: 2, y: 0, z: 0 }));
		expect.toBeEqual(mesh.halfEdges.length, 2);
		expect.toBeEqual(mesh.halfEdges[0].polygon, undefined);
		expect.toBeEqual(mesh.halfEdges[1].polygon, undefined);
		expect.toBeEqual(
			mesh.halfEdges[0].nextEdgeAroundPolygon,
			mesh.halfEdges[1],
		);
		expect.toBeEqual(
			mesh.halfEdges[1].nextEdgeAroundPolygon,
			mesh.halfEdges[0],
		);
	}
}

function makeOneCornerMesh() {
	const position = new Coord3({ x: 0, y: 0, z: 0 });
	const normal = new Coord3({ x: 0, y: 0, z: 1 });

	return {
		...addCorner(makeEmptyMesh(), {
			position,
			normal,
		}),
		position,
	};
}
