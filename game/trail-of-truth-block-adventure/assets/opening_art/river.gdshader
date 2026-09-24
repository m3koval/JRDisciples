shader_type spatial;
render_mode cull_disabled;
varying vec3 p;
void vertex(){p=(MODEL_MATRIX*vec4(VERTEX,1.0)).xyz;}
void fragment(){
    // Authored shallow-bank depth cue, not a hydraulic/depth-buffer simulation.
    float depth=smoothstep(0.0,1.55,2.02-abs(p.x-5.0));
    float ripple=sin(p.z*9.0-TIME*.65+sin(p.x*4.1)*.24);
    float streak=smoothstep(.96,1.0,ripple)*smoothstep(-.1,.8,sin(p.x*8.0+p.z*.8));
    vec3 water=mix(vec3(.28,.46,.38),vec3(.12,.31,.35),depth);
    ALBEDO=water+vec3(.06,.075,.075)*streak;
    ROUGHNESS=.30;
    SPECULAR=.42;
    NORMAL_MAP=vec3(.5+sin(p.z*7.0-TIME*.5)*.004,.5+cos(p.x*6.0+p.z*3.0)*.004,1.0);
    NORMAL_MAP_DEPTH=.25;
}
