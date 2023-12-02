import { expect, test } from "vitest";
import { Coord3 } from "./Coord3";
import { addEdges, getCornersOfPolygon, makeEmptyMesh } from "./Mesh";
import { getValues } from "./Table";

test("makeEmptyMesh", () => {
	const mesh = makeEmptyMesh();
	expect(getValues(mesh.halfEdges).length).toBe(0);
	expect(getValues(mesh.polygons).length).toBe(0);
	expect(getValues(mesh.corners).length).toBe(0);
	expect(getValues(mesh.cornerAttributes).length).toBe(0);
});

test("addEdge", () => {
	const { mesh } = makeOneEdgeMesh();
	expect(getValues(mesh.corners).length).toBe(2);
	expect(getValues(mesh.cornerAttributes).length).toBe(2);
});

test("verifyMeshIntegrity", () => {
	const { mesh } = makeOneEdgeMesh();
	expect(
		[...getCornersOfPolygon(mesh, getValues(mesh.polygons)[0])].length,
	).toBe(2);
});

// @Test()
// extrudeCorner() {
// 	const mesh = makeOneEdgeMesh();
// 	expect(getValues(mesh.halfEdges).length, 2);
// 	expect(getValues(mesh.halfEdges)[0].polygonId, undefined);
// 	expect(getValues(mesh.halfEdges)[1].polygonId, undefined);
// 	expect(
// 		getValues(mesh.halfEdges)[0].nextEdgeIdAroundPolygon,
// 		getValues(mesh.halfEdges)[1].id,
// 	);
// 	expect(
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
// 	expect(mesh.halfEdges.length, 4);
// 	expect(newHalfEdges[0].polygon, undefined);
// 	expect(newHalfEdges[1].polygon, undefined);
// 	expect(newHalfEdges[0].nextEdgeAroundPolygon, newHalfEdges[1]);
// 	expect(newHalfEdges[1].nextEdgeAroundPolygon, newHalfEdges[0]);
// }

function makeOneEdgeMesh() {
	const mesh = makeEmptyMesh();

	const positions = [
		new Coord3({ x: -1, y: 0, z: 0 }),
		new Coord3({ x: 1, y: 0, z: 0 }),
	];

	const edge = addEdges(
		mesh,
		positions.map((position) => ({
			position,
		})),
	);

	return {
		mesh,
		edge,
	};
}

// function makeOneEdgeMesh() {
// 	const { mesh, corner } = makeOneCornerMesh();
// 	extrudeCorner(mesh, corner, new Coord3({ x: 1, y: 0, z: 0 }));
// 	return mesh;
// }
