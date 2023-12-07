import { Coord3 } from "./Coord3";
import { Mesh, Polygon } from "./Mesh";
import * as twgl from "twgl.js";

function coord3ToTwglVec3(coord: Coord3): number[] {
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
			data: data.position.flatMap(coord3ToTwglVec3),
		},
		normal: {
			numComponents: 3,
			data: data.normal.flatMap(coord3ToTwglVec3),
		},
		indices: {
			numComponents: 3,
			data: data.indices,
		},
	};
}

function polygonToWebglArrays(_mesh: Mesh, polygon: Polygon) {
	console.log("tesselating polygon");
	const corners = Mesh.cornersAroundPolygon(polygon);
	const cornerIndices = corners.map((corner) => corners.indexOf(corner));

	// const cornerIndices = corners.map((corner) =>
	// 	vertices.indexOf(mesh.cornerAttributes.get(corner)!),
	// );

	return {
		position: corners.map((corner) => corner.position),
		normal: corners.map((corner) => corner.position.normalized()),
		indices:
			cornerIndices.length === 3
				? cornerIndices
				: [
						...cornerIndices.slice(0, 3),
						...cornerIndices.slice(2, 4),
						cornerIndices[0]!,
				  ],
	};
}
