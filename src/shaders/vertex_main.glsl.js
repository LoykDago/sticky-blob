export default /* glsl */ `

	vec3 coords=normal;
	coords.y+=uTime;
	vec3 noisePattern=vec3(noise(coords/1.5));
	float finalPattern=wave(noisePattern+uTime);
	vDisplacement=finalPattern;

	float displacement=vDisplacement/3.0;

  // transformed+=normalize(objectNormal) *displacement;
	transformed+=normalize(objectNormal) *(1.0-length(uMouse-vec2(position.x,position.y)))*displacement;
`;
