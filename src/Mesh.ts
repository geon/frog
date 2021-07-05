import { Coord3 } from "./Coord3";
import { TwoDeepReadonly } from "./DeepReadonly";
import { makeEmptyTable, MutableTable } from "./Table";
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
	firstEdgeId: HalfEdgeId;
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

export interface MutableMesh {
	corners: MutableTable<Corner>;
	edges: MutableTable<Edge>;
	polygons: MutableTable<Polygon>;
	halfEdges: MutableTable<HalfEdge>;
	cornerAttributes: MutableTable<{
		position: Coord3;
		normal: Coord3;
	}>;
}

export type Mesh = TwoDeepReadonly<MutableMesh>;

export function makeEmptyMesh(): Mesh {
	return {
		corners: makeEmptyTable(),
		edges: makeEmptyTable(),
		polygons: makeEmptyTable(),
		halfEdges: makeEmptyTable(),
		cornerAttributes: makeEmptyTable(),
	};
}

// export function addCorner(
// 	mesh: Mesh,
// 	attributes: { position: Coord3; normal: Coord3 },
// ): { mesh: Mesh; newCorner: Corner } {
// 	const newCorner: Corner = {};

// 	return {
// 		mesh: {
// 			...mesh,
// 			corners: [...mesh.corners, newCorner],
// 			cornerAttributes: new Map([
// 				...mesh.cornerAttributes,
// 				[newCorner, attributes],
// 			]),
// 		},
// 		newCorner,
// 	};
// }

// export function extrudeCorner(
// 	mesh: Mesh,
// 	corner: Corner,
// 	offset: Coord3,
// ): { mesh: Mesh; newHalfEdges: HalfEdge[] } {
// 	const oldCornerAttributes = mesh.cornerAttributes.get(corner)!;

// 	const { newCorner, ...rest } = addCorner(mesh, {
// 		...oldCornerAttributes,
// 		position: Coord3.add(oldCornerAttributes.position, offset),
// 	});
// 	mesh = rest.mesh;

// 	const halfEdgeA: HalfEdge = {
// 		corner: corner,
// 		// The othe edge does not exist yet.
// 		otherHalf: undefined!,
// 		nextEdgeAroundPolygon: undefined!,
// 	};
// 	const halfEdgeB: HalfEdge = {
// 		corner: newCorner,
// 		otherHalf: halfEdgeA!,
// 		nextEdgeAroundPolygon: halfEdgeA,
// 	};
// 	// Now it exists.
// 	halfEdgeA.otherHalf = halfEdgeB;
// 	halfEdgeA.nextEdgeAroundPolygon = halfEdgeB;

// 	const newHalfEdges = [halfEdgeA, halfEdgeB];

// 	return {
// 		mesh: { ...mesh, halfEdges: [...mesh.halfEdges, ...newHalfEdges] },
// 		newHalfEdges,
// 	};
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

// function* polygonCorners(polygon: Polygon) {
// 	let halfEdge = polygon.firstEdge;
// 	do {
// 		yield halfEdge.corner;
// 		halfEdge = halfEdge.nextEdgeAroundPolygon;
// 	} while (halfEdge !== polygon.firstEdge);
// }

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
