"""Fail-closed evidence checks, independent of expensive renderer tests."""
import copy
import unittest
from verify_browser_snapshot import REQUIRED, validate


class SnapshotEvidenceTests(unittest.TestCase):
    def setUp(self):
        self.result = {'checks': dict.fromkeys(REQUIRED, True), 'errors': []}
        self.before = {'source': 'frozen', 'export': 'fresh'}

    def verify(self, result=None, after=None, code=0):
        validate(self.result if result is None else result, self.before,
                 self.before if after is None else after, code)

    def test_complete_frozen_pass(self):
        self.verify()

    def test_nonzero_exit_rejected_even_with_checks(self):
        with self.assertRaises(AssertionError): self.verify(code=1)

    def test_snapshot_drift_rejected(self):
        with self.assertRaises(AssertionError): self.verify(after={'source': 'changed'})

    def test_every_required_gate_is_required(self):
        for gate in REQUIRED:
            with self.subTest(gate=gate):
                result = copy.deepcopy(self.result)
                del result['checks'][gate]
                with self.assertRaises(AssertionError): self.verify(result=result)

    def test_failure_and_runtime_errors_rejected(self):
        result = copy.deepcopy(self.result)
        result['checks']['extra'] = False
        with self.assertRaises(AssertionError): self.verify(result=result)
        result = copy.deepcopy(self.result)
        result['errors'] = ['SCRIPT ERROR: invalid call']
        with self.assertRaises(AssertionError): self.verify(result=result)

    def test_normal_route_cannot_be_omitted(self):
        # A final completion flag alone does not prove repairs/escort/input.
        for gate in ('trusted_start', 'map_pauses_player', 'invalid_action',
                     'pickup_1', 'place_1', 'pickup_2', 'place_2', 'call_lamb',
                     'reward_retained', 'joystick_releases',
                     'two_thumb_look_responds', 'two_thumb_release_stops_walk',
                     'landscape_pause', 'landscape_replay_reachable'):
            with self.subTest(gate=gate):
                result = copy.deepcopy(self.result)
                result['checks'].pop(gate, None)
                with self.assertRaises(AssertionError): self.verify(result=result)

    def test_string_truth_is_not_evidence(self):
        result = copy.deepcopy(self.result)
        result['checks']['replay'] = 'true'
        with self.assertRaises(AssertionError): self.verify(result=result)


if __name__ == '__main__': unittest.main()
