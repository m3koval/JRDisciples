shader_type spatial;
render_mode cull_disabled, diffuse_burley;
uniform sampler2D painted_ground : source_color, filter_linear_mipmap, repeat_enable;
varying vec3 world_position;
void vertex(){ world_position=(MODEL_MATRIX*vec4(VERTEX,1.0)).xyz; }
void fragment(){
    // Soft weathering, subordinate to authored planes and bedding silhouettes.
    vec3 grain=texture(painted_ground,world_position.xz*.24+world_position.y*.13).rgb;
    // Broken weathering follows all three axes, not ruler-straight stripes.
    float bedding=sin(world_position.y*5.0+sin(world_position.x*1.3)*1.2+sin(world_position.z*.9));
    ALBEDO=COLOR.rgb*(.82+.19*grain.r)-vec3(.012)*smoothstep(.80,1.0,bedding);
    ROUGHNESS=.96;
    SPECULAR=.12;
}
