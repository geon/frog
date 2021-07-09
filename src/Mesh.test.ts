import { TestSuite, Test, expect } from "testyts";
import { Coord3 } from "./Coord3";
import { addCorner, makeEmptyMesh } from "./Mesh";
import { getValues } from "./Table";

@TestSuite()
export class MeshTestSuite {
	@Test()
	makeEmptyMesh() {
		const mesh = makeEmptyMesh();
		expect.toBeEqual(getValues(mesh.halfEdges).length, 0);
		expect.toBeEqual(getValues(mesh.polygons).length, 0);
		expect.toBeEqual(getValues(mesh.corners).length, 0);
		expect.toBeEqual(getValues(mesh.cornerAttributes).length, 0);
	}

	@Test()
	addCorner() {
		const { mesh, position } = makeOneCornerMesh();
		expect.toBeEqual(getValues(mesh.corners).length, 1);
		expect.toBeEqual(getValues(mesh.cornerAttributes).length, 1);
		expect.toBeEqual(getValues(mesh.cornerAttributes)[0].position, position);
	}

	// @Test()
	// extrudeCorner() {
	// 	let { mesh } = makeOneEdgeMesh();
	// 	expect.toBeEqual(mesh.halfEdges.length, 2);
	// 	expect.toBeEqual(mesh.halfEdges[0].polygon, undefined);
	// 	expect.toBeEqual(mesh.halfEdges[1].polygon, undefined);
	// 	expect.toBeEqual(
	// 		mesh.halfEdges[0].nextEdgeAroundPolygon,
	// 		mesh.halfEdges[1],
	// 	);
	// 	expect.toBeEqual(
	// 		mesh.halfEdges[1].nextEdgeAroundPolygon,
	// 		mesh.halfEdges[0],
	// 	);
	// }

	// @Test()
	// extrudeCornerOnEdge() {
	// 	const oneEdgeResult = makeOneEdgeMesh();
	// 	let { mesh, newHalfEdges } = extrudeCorner(
	// 		oneEdgeResult.mesh,
	// 		oneEdgeResult.mesh.corners[1],
	// 		new Coord3({ x: 1, y: 0, z: 0 }),
	// 	);
	// 	expect.toBeEqual(mesh.halfEdges.length, 4);
	// 	expect.toBeEqual(newHalfEdges[0].polygon, undefined);
	// 	expect.toBeEqual(newHalfEdges[1].polygon, undefined);
	// 	expect.toBeEqual(newHalfEdges[0].nextEdgeAroundPolygon, newHalfEdges[1]);
	// 	expect.toBeEqual(newHalfEdges[1].nextEdgeAroundPolygon, newHalfEdges[0]);
	// }
}

function makeOneCornerMesh() {
	const mesh = makeEmptyMesh();

	const position = new Coord3({ x: 0, y: 0, z: 0 });
	const normal = new Coord3({ x: 0, y: 0, z: 1 });
	addCorner(mesh, {
		position,
		normal,
	});

	return {
		mesh: { ...mesh },
		position,
	};
}

// function makeOneEdgeMesh() {
// 	const { mesh, newCorner } = makeOneCornerMesh();
// 	return extrudeCorner(mesh, newCorner, new Coord3({ x: 1, y: 0, z: 0 }));
// }
