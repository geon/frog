import { Coord3 } from "./Coord3";
// import { TwoDeepReadonly } from "./DeepReadonly";
import { makeMutable, TwoDeepMutable } from "./Mutable";
import { addValue, getValue, makeEmptyTable, setValue, Table } from "./Table";
// import * as twgl from "twgl.js";

type CornerId = number;
type EdgeId = number;
type PolygonId = number;
type HalfEdgeId = number;

export interface Corner {
	id: CornerId;
	firstHalfEdgeId: HalfEdgeId;
}

export interface Edge {
	id: EdgeId;
	firstHalfEdgeId: HalfEdgeId;
}

export interface Polygon {
	id: PolygonId;
	firstHalfEdgeId: HalfEdgeId;
	isHole: boolean;
}

export interface HalfEdge {
	id: HalfEdgeId;
	cornerId: CornerId;
	otherHalfId: HalfEdgeId;
	polygonId: PolygonId;

	// Next edge along the Polygon perimeter clock-wise.
	nextEdgeIdAroundPolygon: HalfEdgeId;
	// Next edge around the corner anti-clock-wise.
	nextEdgeIdAroundCorner: HalfEdgeId;
}

export interface Mesh {
	readonly corners: Table<Corner>;
	readonly edges: Table<Edge>;
	readonly polygons: Table<Polygon>;
	readonly halfEdges: Table<HalfEdge>;
	readonly cornerAttributes: Table<{
		position: Coord3;
	}>;
}

export type MutableMesh = TwoDeepMutable<Mesh>;

export function makeEmptyMesh(): MutableMesh {
	return makeMutable({
		corners: makeEmptyTable(),
		edges: makeEmptyTable(),
		polygons: makeEmptyTable(),
		halfEdges: makeEmptyTable(),
		cornerAttributes: makeEmptyTable(),
	});
}

export function addEdges(
	mesh: MutableMesh,
	cornerAttributes: { position: Coord3 }[],
) {
	if (cornerAttributes.length < 2) {
		throw new Error("An edge must have at least 2 corners.");
	}

	const newCorners = cornerAttributes.map((attributes) => {
		const corner = addValue(mesh.corners, {
			// Not yet connected.
			firstHalfEdgeId: -1,
		});
		setValue(mesh.cornerAttributes, corner.id, attributes);
		return corner;
	});

	// This is not really a polygon, but just the rim for the edge to attach to.
	const newPolygon = addValue(mesh.polygons, {
		// Not yet connected.
		firstHalfEdgeId: -1,
		isHole: true,
	});

	// .slice(0, -1) => All but the last.
	const halfEdgesA = newCorners.slice(0, -1).map((newCorner) =>
		addValue(mesh.halfEdges, {
			cornerId: newCorner.id,
			polygonId: newPolygon.id,
			otherHalfId: -1,
			nextEdgeIdAroundPolygon: -1,
			nextEdgeIdAroundCorner: -1,
		}),
	);
	// .slice(1) => All but the first.
	const halfEdgesB = newCorners.slice(1).map((newCorner) =>
		addValue(mesh.halfEdges, {
			cornerId: newCorner.id,
			polygonId: newPolygon.id,
			otherHalfId: -1,
			nextEdgeIdAroundPolygon: -1,
			nextEdgeIdAroundCorner: -1,
		}),
	);
	for (const index of halfEdgesA.map((_, index) => index)) {
		const halfEdgeA = halfEdgesA[index];
		const halfEdgeB = halfEdgesB[index];

		halfEdgeA.otherHalfId = halfEdgeB.id;
		halfEdgeB.otherHalfId = halfEdgeA.id;

		halfEdgeA.nextEdgeIdAroundPolygon = (
			halfEdgesA[index - 1] ?? halfEdgesB[index]
		).id;
		halfEdgeB.nextEdgeIdAroundPolygon = (
			halfEdgesB[index + 1] ?? halfEdgesA[index]
		).id;
	}

	newCorners.forEach((newCorner, index) => {
		const halfEdge = halfEdgesA[index] ?? halfEdgesB[index - 1];
		newCorner.firstHalfEdgeId = halfEdge.id;
		newPolygon.firstHalfEdgeId = halfEdge.id;
	});

	halfEdgesA.forEach((halfEdge) => {
		addValue(mesh.edges, {
			firstHalfEdgeId: halfEdge.id,
		});
	});

	return newCorners;
}

// export function extrudeCorner(
// 	mesh: MutableMesh,
// 	corner: Corner,
// 	offset: Coord3,
// ) {
// const oldCornerAttributes = getValue(mesh.cornerAttributes, corner.id);
// const newCorner = addCorner(mesh, {
// 	...oldCornerAttributes,
// 	position: Coord3.add(oldCornerAttributes.position, offset),
// });
// const halfEdgeA = addValue(mesh.halfEdges, {
// 	cornerId: corner.id,
// 	polygonId: -1,
// 	// The othe edge does not exist yet.
// 	otherHalfId: -1,
// 	nextEdgeIdAroundPolygon: -1,
// 	nextEdgeIdAroundCorner: -1,
// });
// const halfEdgeB = addValue(mesh.halfEdges, {
// 	cornerId: newCorner.id,
// 	polygonId: -1,
// 	otherHalfId: halfEdgeA.id,
// 	nextEdgeIdAroundPolygon: halfEdgeA.id,
// 	nextEdgeIdAroundCorner: halfEdgeA.id,
// });
// // Now it exists.
// halfEdgeA.otherHalfId = halfEdgeB.id;
// halfEdgeA.nextEdgeIdAroundPolygon = halfEdgeB.id;
// const newHalfEdges = [halfEdgeA, halfEdgeB];
// return newHalfEdges;
//
//
// const newCorner = addValue(mesh.corners, {
// 	// Not yet connected.
// 	firstHalfEdgeId: -1,
// });
// const oldCornerAttributes = getValue(mesh.cornerAttributes, corner.id);
// setValue(mesh.cornerAttributes, newCorner.id, {
// 	...oldCornerAttributes,
// 	position: Coord3.add(oldCornerAttributes.position, offset),
// });
// }

// export function makeTestMesh(): Mesh {
// 	return makeEmptyMesh();
// }

// function coord3ToTwglVec3(coord: Coord3): twgl.v3.Vec3 {
// 	return [coord.x, coord.y, coord.z];
// }

// export function meshToWebglArrays(mesh: Mesh): twgl.Arrays {
// 	const polygonArrays = mesh.polygons.map((polygon) =>
// 		polygonToWebglArrays(mesh, polygon),
// 	);

// 	let beginIndex = 0;
// 	const data: {
// 		position: Coord3[];
// 		normal: Coord3[];
// 		indices: number[];
// 	} = {
// 		position: [],
// 		normal: [],
// 		indices: [],
// 	};
// 	for (const current of polygonArrays) {
// 		data.position.push(...current.position);
// 		data.normal.push(...current.normal);
// 		data.indices.push(...current.indices.map((index) => index + beginIndex));
// 		beginIndex += current.position.length;
// 	}

// 	return {
// 		position: {
// 			numComponents: 3,
// 			data: data.position
// 				.map(coord3ToTwglVec3)
// 				.reduce<number[]>((soFar, current) => {
// 					soFar.push(...current);
// 					return soFar;
// 				}, []),
// 		},
// 		normal: {
// 			numComponents: 3,
// 			data: data.normal
// 				.map(coord3ToTwglVec3)
// 				.reduce<number[]>((soFar, current) => {
// 					soFar.push(...current);
// 					return soFar;
// 				}, []),
// 		},
// 		indices: {
// 			numComponents: 3,
// 			data: data.indices,
// 		},
// 	};
// }

export function* getCornersOfPolygon(mesh: Mesh, polygon: Polygon) {
	let halfEdgeId = polygon.firstHalfEdgeId;
	do {
		const halfEdge = getValue(mesh.halfEdges, halfEdgeId);
		const corner = getValue(mesh.corners, halfEdge.cornerId);
		yield corner;
		halfEdgeId = halfEdge.nextEdgeIdAroundPolygon;
	} while (halfEdgeId !== polygon.firstHalfEdgeId);
}

// function polygonToWebglArrays(mesh: Mesh, polygon: Polygon) {
// 	const corners = [...polygonCorners(polygon)];

// 	const vertices = corners.map((corner) => mesh.cornerAttributes.get(corner)!);

// 	const cornerIndices = corners.map((corner) =>
// 		vertices.indexOf(mesh.cornerAttributes.get(corner)!),
// 	);

// 	return {
// 		position: vertices.map((vertex) => vertex.position),
// 		normal: vertices.map((vertex) => vertex.normal),
// 		indices:
// 			cornerIndices.length === 3
// 				? cornerIndices
// 				: [
// 						...cornerIndices.slice(0, 3),
// 						...cornerIndices.slice(2, 4),
// 						cornerIndices[0],
// 				  ],
// 	};
// }
