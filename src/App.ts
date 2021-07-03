import { Renderer } from "./Renderer";
import * as twgl from "twgl.js";
import { Mesh } from "./Mesh";
import { Coord2 } from "./Coord2";

function mouseCoordFromEvent(event: MouseEvent) {
	return new Coord2({ x: event.pageX, y: event.pageY });
}

export class App {
	canvas: HTMLCanvasElement;
	renderer: Renderer;
	meshes: Mesh[];
	mouseStart: Coord2 | undefined;
	polarOrientationStart: Coord2 | undefined;
	polarOrientation: Coord2 = new Coord2({ x: 0, y: 0 });

	constructor() {
		this.canvas = document.getElementsByTagName("canvas")[0];
		this.renderer = new Renderer(this.canvas);
		this.meshes = [];

		this.canvas.addEventListener("contextmenu", (event) => {
			event.preventDefault();
		});
		this.canvas.addEventListener("mousedown", (event) => {
			this.mouseStart = mouseCoordFromEvent(event);
			this.polarOrientationStart = this.polarOrientation;
		});
		this.canvas.addEventListener("mousemove", (event) => {
			if (!this.mouseStart) {
				// The drag didn't start in this view.
				return;
			}

			switch (event.which) {
				// No button
				case 0:
					break;

				// Left
				case 1:
					break;

				// Right
				case 3:
					// Camera orbiting.

					var mousePosition = mouseCoordFromEvent(event);
					var dragVector = Coord2.subtract(mousePosition, this.mouseStart);

					var mouseSensitivity = 10;
					this.polarOrientation = Coord2.add(
						this.polarOrientationStart!,
						Coord2.scale(dragVector, mouseSensitivity / this.canvas.width),
					);

					this.draw();

					break;
			}
		});
		this.canvas.addEventListener("mouseup", (_event) => {
			this.mouseStart = undefined;
		});
	}

	addMesh(mesh: Mesh) {
		this.meshes.push(mesh);
		this.renderer.addMesh(mesh);
	}

	draw() {
		const orientation = twgl.m4.multiply(
			twgl.m4.axisRotation(twgl.v3.create(0, 1, 0), -this.polarOrientation.x),
			twgl.m4.axisRotation(twgl.v3.create(1, 0, 0), -this.polarOrientation.y),
		);

		const cameraDistance = 5;
		const eye = [0, 0, cameraDistance];

		const target = [0, 0, 0];
		const up = [0, 1, 0];
		const camera = twgl.m4.multiply(
			orientation,
			twgl.m4.lookAt(eye, target, up),
		);

		this.renderer.draw(camera);
	}
}
