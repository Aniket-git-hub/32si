import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_GAME_SETTINGS, useGameSettings } from "../../../context/GameSettingsContext";

const Toggle = ({ id, label, help, isChecked, onChange }) => (
  <FormControl display="flex" alignItems="flex-start" justifyContent="space-between" gap={6}>
    <VStack align="start" spacing={0}>
      <FormLabel htmlFor={id} mb={0} fontWeight="semibold">
        {label}
      </FormLabel>
      <FormHelperText mt={1}>{help}</FormHelperText>
    </VStack>
    <Switch id={id} colorScheme="purple" size="lg" isChecked={isChecked} onChange={(e) => onChange(e.target.checked)} />
  </FormControl>
);

/** Settings › Game. Saved on this device. */
export default function GameSettings() {
  const { settings, updateSettings } = useGameSettings();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <VStack align="stretch" spacing={6} maxW="640px" py={2}>
      <Heading size="md">Sound</Heading>
      <Toggle
        id="sound-effects"
        label="Sound effects"
        help="Moves, captures, wins and challenges."
        isChecked={settings.soundEffects}
        onChange={(soundEffects) => updateSettings({ soundEffects })}
      />
      <FormControl>
        <FormLabel fontWeight="semibold">Music volume</FormLabel>
        <HStack spacing={4}>
          <Slider
            aria-label="Music volume"
            min={0}
            max={0.3}
            step={0.01}
            value={settings.musicVolume}
            onChange={(musicVolume) => updateSettings({ musicVolume })}
            colorScheme="purple"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text w="48px" textAlign="right" fontVariantNumeric="tabular-nums">
            {Math.round((settings.musicVolume / 0.3) * 100)}%
          </Text>
        </HStack>
        <FormHelperText>Start the music with the Play Music button on the game screen.</FormHelperText>
      </FormControl>

      <Toggle
        id="haptics"
        label="Vibration"
        help="A light buzz on moves and captures, on phones that support it."
        isChecked={settings.haptics}
        onChange={(haptics) => updateSettings({ haptics })}
      />

      <Divider />
      <Heading size="md">Board</Heading>
      <Toggle
        id="move-hints"
        label="Move hints"
        help="Ring the beads that can move and show where a selected bead can go."
        isChecked={settings.moveHints}
        onChange={(moveHints) => updateSettings({ moveHints })}
      />
      <Toggle
        id="capture-hints"
        label="Capture hints"
        help="Highlight beads that can capture (captures are optional, so they're easy to miss) and your beads that are in danger."
        isChecked={settings.captureHints}
        onChange={(captureHints) => updateSettings({ captureHints })}
      />
      <Toggle
        id="confirm-moves"
        label="Confirm moves"
        help="Tap a destination twice to move. Helps avoid mis-taps on small screens."
        isChecked={settings.confirmMoves}
        onChange={(confirmMoves) => updateSettings({ confirmMoves })}
      />

      <Divider />
      <HStack flexWrap="wrap">
        <Button colorScheme="purple" variant="outline" onClick={() => navigate("/learn")}>
          Replay the tutorial
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            try {
              localStorage.removeItem("32beads.coachSeen");
              localStorage.removeItem("32beads.coachOff");
            } catch {
              // ignore
            }
            toast({ title: "Tips will show again in your next game.", status: "success", position: "top", duration: 2500 });
          }}
        >
          Show game tips again
        </Button>
        <Button variant="ghost" onClick={() => updateSettings(DEFAULT_GAME_SETTINGS)}>
          Reset to defaults
        </Button>
      </HStack>
    </VStack>
  );
}
