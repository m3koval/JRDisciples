extends "res://tests/playthrough.gd"
## Execute all original opening/repair/rescue assertions under native input/physics.
## Rendering is checkpoint-only; separate normal-camera capture fixture supplies images.
func _initialize() -> void:
    RenderingServer.render_loop_enabled = false
    super._initialize()
