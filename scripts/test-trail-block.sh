#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
GODOT_BIN="${GODOT_BIN:-/home/helper/tools/godot-4.7.2/godot}"
"$GODOT_BIN" --headless --path game/trail-of-truth-block-adventure --editor --import
"$GODOT_BIN" --headless --fixed-fps 60 --path game/trail-of-truth-block-adventure --script res://tests/playthrough.gd
"$GODOT_BIN" --headless --fixed-fps 60 --path game/trail-of-truth-block-adventure --script res://tests/edge_cases.gd
"$GODOT_BIN" --headless --fixed-fps 60 --path game/trail-of-truth-block-adventure --script res://tests/review_regressions.gd
python3 tools/trail_of_truth/check_block_release.py
