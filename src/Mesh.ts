import { Coord3 } from "./Coord3";
import * as twgl from "twgl.js";

export interface Corner {}

export interface Polygon {
	firstEdge: HalfEdge;
}

export interface HalfEdge {
	corner: Corner;
	polygon?: Polygon;

	// Next edge along the Polygon perimeter clock-wise.
	nextEdgeAroundPolygon: HalfEdge;
	// Next edge around the corner anti-clock-wise.
	// nextEdgeAroundCorner: HalfEdge;
}

export interface Mesh {
	readonly halfEdges: readonly HalfEdge[];
	readonly corners: readonly Corner[];
	readonly polygons: readonly Polygon[];
	readonly cornerAttributes: ReadonlyMap<
		Corner,
		{
			position: Coord3;
			normal: Coord3;
		}
	>;
}

export function makeEmptyMesh(): Mesh {
	return {
		halfEdges: [],
		corners: [],
		polygons: [],
		cornerAttributes: new Map(),
	};
}

export function addCorner(
	mesh: Mesh,
	attributes: { position: Coord3; normal: Coord3 },
): { mesh: Mesh; newCorner: Corner } {
	const newCorner: Corner = {};

	return {
		mesh: {
			...mesh,
			corners: [...mesh.corners, newCorner],
			cornerAttributes: new Map([
				...mesh.cornerAttributes,
				[newCorner, attributes],
			]),
		},
		newCorner,
	};
}

export function extrudeCorner(
	mesh: Mesh,
	corner: Corner,
	offset: Coord3,
): { mesh: Mesh; newHalfEdges: HalfEdge[] } {
	const oldCornerAttributes = mesh.cornerAttributes.get(corner)!;

	const { newCorner, ...rest } = addCorner(mesh, {
		...oldCornerAttributes,
		position: Coord3.add(oldCornerAttributes.position, offset),
	});
	mesh = rest.mesh;

	const halfEdgeA: HalfEdge = {
		corner: corner,
		// The othe edge does not exist yet.
		nextEdgeAroundPolygon: undefined!,
	};
	const halfEdgeB: HalfEdge = {
		corner: newCorner,
		nextEdgeAroundPolygon: halfEdgeA,
	};
	// Now it exists.
	halfEdgeA.nextEdgeAroundPolygon = halfEdgeB;

	const newHalfEdges = [halfEdgeA, halfEdgeB];

	return {
		mesh: { ...mesh, halfEdges: [...mesh.halfEdges, ...newHalfEdges] },
		newHalfEdges,
	};
}

export function makeTestMesh(): Mesh {
	return makeEmptyMesh();
}

function coord3ToTwglVec3(coord: Coord3): twgl.v3.Vec3 {
	return [coord.x, coord.y, coord.z];
}

export function meshToWebglArrays(mesh: Mesh): twgl.Arrays {
	const polygonArrays = mesh.polygons.map((polygon) =>
		polygonToWebglArrays(mesh, polygon),
	);

	let beginIndex = 0;
	const data: {
		position: Coord3[];
		normal: Coord3[];
		indices: number[];
	} = {
		position: [],
		normal: [],
		indices: [],
	};
	for (const current of polygonArrays) {
		data.position.push(...current.position);
		data.normal.push(...current.normal);
		data.indices.push(...current.indices.map((index) => index + beginIndex));
		beginIndex += current.position.length;
	}

	return {
		position: {
			numComponents: 3,
			data: data.position
				.map(coord3ToTwglVec3)
				.reduce<number[]>((soFar, current) => {
					soFar.push(...current);
					return soFar;
				}, []),
		},
		normal: {
			numComponents: 3,
			data: data.normal
				.map(coord3ToTwglVec3)
				.reduce<number[]>((soFar, current) => {
					soFar.push(...current);
					return soFar;
				}, []),
		},
		indices: {
			numComponents: 3,
			data: data.indices,
		},
	};
}

function* polygonCorners(polygon: Polygon) {
	let halfEdge = polygon.firstEdge;
	do {
		yield halfEdge.corner;
		halfEdge = halfEdge.nextEdgeAroundPolygon;
	} while (halfEdge !== polygon.firstEdge);
}

function polygonToWebglArrays(mesh: Mesh, polygon: Polygon) {
	const corners = [...polygonCorners(polygon)];

	const vertices = corners.map((corner) => mesh.cornerAttributes.get(corner)!);

	const cornerIndices = corners.map((corner) =>
		vertices.indexOf(mesh.cornerAttributes.get(corner)!),
	);

	return {
		position: vertices.map((vertex) => vertex.position),
		normal: vertices.map((vertex) => vertex.normal),
		indices:
			cornerIndices.length === 3
				? cornerIndices
				: [
						...cornerIndices.slice(0, 3),
						...cornerIndices.slice(2, 4),
						cornerIndices[0],
				  ],
	};
}
