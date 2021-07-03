import * as twgl from "twgl.js";
import { Mesh, meshToWebglArrays } from "./Mesh";
import { vertexShader, fragmentShader } from "./shaders";

export class Renderer {
	gl: WebGLRenderingContext;
	programInfo: twgl.ProgramInfo;
	bufferInfos: twgl.BufferInfo[];

	constructor(canvas: HTMLCanvasElement) {
		this.gl = canvas.getContext("webgl")!;
		this.bufferInfos = [];

		const program = twgl.createProgramFromSources(this.gl, [
			vertexShader,
			fragmentShader,
		]);

		this.programInfo = twgl.createProgramInfoFromProgram(this.gl, program);

		twgl.resizeCanvasToDisplaySize(canvas, window.devicePixelRatio);

		this.gl.enable(this.gl.DEPTH_TEST);
		// this.gl.enable(this.gl.CULL_FACE);

		this.gl.viewport(0, 0, canvas.width, canvas.height);
		this.gl.useProgram(this.programInfo.program);

		// Set up lighting.
		twgl.setUniforms(this.programInfo, {
			u_lightWorldPos: [-4, 8, 10],
			u_lightColor: [1, 1, 1, 1],
			u_ambient: [0.5, 0.5, 0.5, 1],
			u_specular: [0.5, 0.5, 0.5, 1],
			u_shininess: 50,
			u_specularFactor: 1,
		});

		this.gl.clearColor(0.8, 0.8, 0.8, 1);

		this.clear();
	}

	addMesh(mesh: Mesh) {
		this.bufferInfos.push(
			twgl.createBufferInfoFromArrays(this.gl, meshToWebglArrays(mesh)),
		);
	}

	clear() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	draw(camera: twgl.m4.Mat4) {
		this.clear();

		const canvas = this.gl.canvas as HTMLCanvasElement;
		const aspect = canvas.clientWidth / canvas.clientHeight;
		const zNear = 0.5;
		const zFar = 30;

		const fov = (Math.PI / 180) * 60;
		const projection = twgl.m4.perspective(fov, aspect, zNear, zFar);

		const view = twgl.m4.inverse(camera);
		const viewProjection = twgl.m4.multiply(projection, view);
		const world = twgl.m4.rotationY(0);

		twgl.setUniforms(this.programInfo, {
			u_viewInverse: camera,
			u_world: world,
			u_worldInverseTranspose: twgl.m4.transpose(twgl.m4.inverse(world)),
			u_worldViewProjection: twgl.m4.multiply(viewProjection, world),
		});

		for (const bufferInfo of this.bufferInfos) {
			twgl.setUniforms(this.programInfo, {
				u_model: twgl.m4.identity(),
			});
			twgl.setBuffersAndAttributes(this.gl, this.programInfo, bufferInfo);
			twgl.drawBufferInfo(this.gl, bufferInfo);
		}
	}
}
