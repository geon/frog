export const vertexShader = `
	uniform mat4 u_worldViewProjection;
	uniform vec3 u_lightWorldPos;
	uniform mat4 u_world;
	uniform mat4 u_model;
	uniform mat4 u_viewInverse;
	uniform mat4 u_worldInverseTranspose;

	attribute vec4 position;
	attribute vec3 normal;

	varying vec4 v_position;
	varying vec3 v_normal;
	varying vec3 v_surfaceToLight;
	varying vec3 v_surfaceToView;

	void main() {
		v_position = u_worldViewProjection * u_model * position;
		v_normal = (u_worldInverseTranspose * u_model * vec4(normal, 0)).xyz;
		v_surfaceToLight = u_lightWorldPos - (u_world * position).xyz;
		v_surfaceToView = (u_viewInverse[3] - (u_world * position)).xyz;
		gl_Position = v_position;
	}
`;

export const fragmentShader = `
	precision mediump float;

	varying vec4 v_position;
	varying vec3 v_normal;
	varying vec3 v_surfaceToLight;
	varying vec3 v_surfaceToView;

	uniform vec4 u_lightColor;
	uniform vec4 u_ambient;
	uniform vec4 u_specular;
	uniform float u_shininess;
	uniform float u_specularFactor;
	uniform samplerCube u_diffuseMap;

	vec4 lit(float l ,float h, float m) {
		return vec4(
			1.0,
			max(l, 0.0),
			(l > 0.0) ? pow(max(0.0, h), m) : 0.0,
			1.0
		);
	}

	void main() {
		vec4 diffuseColor = vec4(0.6, 0.75, 1, 1);
		vec3 a_normal = normalize(v_normal);
		vec3 surfaceToLight = normalize(v_surfaceToLight);
		vec3 surfaceToView = normalize(v_surfaceToView);
		vec3 halfVector = normalize(surfaceToLight + surfaceToView);
		vec4 litR = lit(
			dot(a_normal, surfaceToLight),
			dot(a_normal, halfVector),
			u_shininess
		);
		vec4 outColor = vec4(
			(u_lightColor * (
				diffuseColor * litR.y + diffuseColor * u_ambient +
				u_specular * litR.z * u_specularFactor
			)).rgb,
			diffuseColor.a
		);
		gl_FragColor = outColor;
	}
`;
