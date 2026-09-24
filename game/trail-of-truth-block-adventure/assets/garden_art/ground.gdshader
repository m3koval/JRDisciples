shader_type spatial;
render_mode cull_back, diffuse_burley;
uniform sampler2D painted_ground : source_color, filter_linear_mipmap, repeat_enable;
varying vec3 world_position;
void vertex(){ world_position = (MODEL_MATRIX * vec4(VERTEX,1.0)).xyz; }
void fragment(){
    vec3 grain = texture(painted_ground, world_position.xz*.38).rgb;
    float freckles = grain.r;
    vec3 grass = mix(vec3(.25,.34,.15),vec3(.37,.44,.23),freckles);
    vec3 earth = mix(vec3(.49,.352,.215),vec3(.70,.565,.365),grain.g);
    vec3 soil = mix(vec3(.235,.145,.075),vec3(.365,.24,.13),grain.b);
    float path = smoothstep(.08,.92,COLOR.r);
    vec3 ground = mix(grass,earth,path);
    ground = mix(ground,soil,COLOR.g);
    ALBEDO = ground;
    ROUGHNESS = .96;
    SPECULAR = .15;
}
