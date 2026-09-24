extends RefCounted
## Original synthesized game cues, generated locally; no third-party recordings.
static func tone(frequency: float, duration: float = .28) -> AudioStreamWAV:
    var stream := AudioStreamWAV.new()
    stream.format = AudioStreamWAV.FORMAT_16_BITS
    stream.mix_rate = 22050
    var count := int(22050 * duration)
    var data := PackedByteArray()
    data.resize(count * 2)
    for i in range(count):
        var t := float(i) / 22050.0
        var attack := minf(t / .008, 1.0)
        var envelope := attack * exp(-t * 12.0) * minf((duration - t) / .02, 1.0)
        var sample := (sin(TAU * frequency * t) + .23 * sin(TAU * frequency * 2.76 * t)) * envelope * .24
        data.encode_s16(i * 2, int(clampf(sample, -1, 1) * 32767))
    stream.data = data
    return stream
