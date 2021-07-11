import { TestSuite, Test, expect } from "testyts";
import { Coord3 } from "./Coord3";
import { addCorner, getCornersOfPolygon, makeEmptyMesh } from "./Mesh";
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

	@Test()
	verifyMeshIntegrity() {
		const { mesh } = makeOneCornerMesh();
		expect.toBeEqual(
			[...getCornersOfPolygon(mesh, getValues(mesh.polygons)[0])].length,
			1,
		);
	}

	// @Test()
	// extrudeCorner() {
	// 	const mesh = makeOneEdgeMesh();
	// 	expect.toBeEqual(getValues(mesh.halfEdges).length, 2);
	// 	expect.toBeEqual(getValues(mesh.halfEdges)[0].polygonId, undefined);
	// 	expect.toBeEqual(getValues(mesh.halfEdges)[1].polygonId, undefined);
	// 	expect.toBeEqual(
	// 		getValues(mesh.halfEdges)[0].nextEdgeIdAroundPolygon,
	// 		getValues(mesh.halfEdges)[1].id,
	// 	);
	// 	expect.toBeEqual(
	// 		getValues(mesh.halfEdges)[1].nextEdgeIdAroundPolygon,
	// 		getValues(mesh.halfEdges)[0].id,
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
	const corner = addCorner(mesh, {
		position,
		normal,
	});

	return {
		mesh,
		position,
		corner,
	};
}

// function makeOneEdgeMesh() {
// 	const { mesh, corner } = makeOneCornerMesh();
// 	extrudeCorner(mesh, corner, new Coord3({ x: 1, y: 0, z: 0 }));
// 	return mesh;
// }
