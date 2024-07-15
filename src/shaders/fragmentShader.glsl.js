export default /* glsl */ `
uniform float uTime;
uniform vec3 uMouse;
varying float vDisplacement;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;



void main() {
	float color=vUv.y;
	
	gl_FragColor = vec4(vec3(color),1.0);
}
`;
