shader_type spatial;
render_mode cull_disabled;
uniform vec2 flow_direction = vec2(0.0,1.0);
uniform float flow_speed = 0.0;
uniform bool falling = false;
uniform vec3 deep_color : source_color = vec3(.10,.40,.48);
uniform vec3 light_color : source_color = vec3(.28,.65,.67);
varying vec3 p;
void vertex(){p=(MODEL_MATRIX*vec4(VERTEX,1.0)).xyz;}
void fragment(){
    vec2 q=p.xz-flow_direction*TIME*flow_speed;
    if(falling){q=vec2(p.x+p.z,p.y+TIME*.6);}
    float waves = sin(q.x*9.0+sin(q.y*6.0+TIME*.6))*sin(q.y*11.0-q.x*2.0);
    float small = sin(q.x*24.0+q.y*16.0+TIME*.7)*.15;
    float sheen = smoothstep(.94,1.0,sin(q.y*13.0+sin(q.x*2.0)*.4))*smoothstep(.1,.8,sin(q.x*5.0+q.y*.3));
    ALBEDO = mix(deep_color,light_color,.35+.12*waves)+vec3(.09,.12,.10)*sheen;
    ROUGHNESS=.22;
    SPECULAR=.5;
    METALLIC=0.0;
    NORMAL_MAP=vec3(.5+sin(q.x*10.0+q.y*3.0+TIME*.3)*.007,.5+cos(q.y*9.0+TIME*.5)*.007,1.0);
    NORMAL_MAP_DEPTH=.45;
}
