import { Coord3 } from "./Coord3";
import * as twgl from "twgl.js";
import { makeRange } from "./functions";

type CornerId = number;
type PolygonId = number;
type HalfEdgeId = number;

export type CornerIds = Set<CornerId>;

export interface Corner {
	id: CornerId;
}

export interface Polygon {
	id: PolygonId;
	firstEdgeId: HalfEdgeId;
}

export interface HalfEdge {
	id: HalfEdgeId;

	cornerId: CornerId;
	polygonId?: PolygonId;

	// Next edge along the Polygon perimeter clock-wise.
	nextEdgeIdAroundPolygon: HalfEdgeId;
	// Next edge around the corner anti-clock-wise.
	// nextEdgeIdAroundCorner: HalfEdgeId;
}

export interface Mesh {
	readonly halfEdges: readonly HalfEdge[];
	readonly polygonIds: ReadonlySet<PolygonId>;
	readonly cornerIds: ReadonlySet<CornerId>;
	readonly cornerAttributes: ReadonlyMap<
		CornerId,
		{
			position: Coord3;
			normal: Coord3;
		}
	>;
	readonly polygons: ReadonlyMap<PolygonId, Polygon>;
}

export function makeTestMesh(): Mesh {
	const cornerIds = [...makeRange(4)];
	const frontHalfEdgeIds = [...makeRange(4)];

	const front: Polygon = { id: 0, firstEdgeId: frontHalfEdgeIds[0] };

	const halfEdges = frontHalfEdgeIds
		.map((id, index): HalfEdge[] => [
			{
				id,
				cornerId: cornerIds[index],
				polygonId: front.id,
				nextEdgeIdAroundPolygon:
					frontHalfEdgeIds[
						(index - 1 + frontHalfEdgeIds.length) % cornerIds.length
					],
				// nextEdgeIdAroundCorner:
				// 	frontHalfEdgeIds[(index + 1) % cornerIds.length],
			},
		])
		.reduce((soFar, current) => [...soFar, ...current], []);

	const corners = cornerIds.map(
		(id): Corner => ({
			id,
		}),
	);

	const cornerPositions = [
		new Coord3({ x: -1, y: 1, z: 0 }),
		new Coord3({ x: 1, y: 1, z: 0 }),
		new Coord3({ x: 1, y: -1, z: 0 }),
		new Coord3({ x: -1, y: -1, z: 0 }),
	];

	return {
		halfEdges,
		polygonIds: new Set([front.id]),
		cornerIds: new Set(corners.map((x) => x.id)),
		cornerAttributes: new Map(
			corners.map((corner, index) => [
				corner.id,
				{
					position: cornerPositions[index],
					normal: new Coord3({ x: 0, y: 0, z: 1 }),
				},
			]),
		),
		polygons: new Map([[front.id, front]]),
	};
}

function coord3ToTwglVec3(coord: Coord3): twgl.v3.Vec3 {
	return [coord.x, coord.y, coord.z];
}

export function meshToWebglArrays(mesh: Mesh): twgl.Arrays {
	const polygons = [...mesh.polygonIds].map(
		(polygonId) => mesh.polygons.get(polygonId)!,
	);

	const polygonArrays = polygons.map((polygon) =>
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

function* polygonCornerIds(mesh: Mesh, polygon: Polygon) {
	let edgeId = polygon.firstEdgeId;
	do {
		const halfEdge = mesh.halfEdges.find((edge) => edge.id === edgeId)!;
		yield halfEdge.cornerId;
		edgeId = halfEdge.nextEdgeIdAroundPolygon;
	} while (edgeId !== polygon.firstEdgeId);
}

function polygonToWebglArrays(mesh: Mesh, polygon: Polygon) {
	const cornerIds = [...polygonCornerIds(mesh, polygon)];

	const vertices = cornerIds.map(
		(cornerId) => mesh.cornerAttributes.get(cornerId)!,
	);

	const cornerIndices = cornerIds.map((cornerId) =>
		vertices.indexOf(mesh.cornerAttributes.get(cornerId)!),
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
