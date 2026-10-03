import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import backgroundMusic from '../assets/sounds/background.mp3';
import killSound from '../assets/sounds/kill.wav';
import loseSound from '../assets/sounds/lose.wav';
import moveSound from '../assets/sounds/move.wav';
import newGameSound from '../assets/sounds/newGame.wav';
import winSound from '../assets/sounds/win.wav';
import { useGameSettings } from '../context/GameSettingsContext';

const SOURCES = { move: moveSound, kill: killSound, win: winSound, lose: loseSound, newGame: newGameSound };

// Short, distinct vibration patterns (ms) for phones; desktop browsers ignore them.
const VIBRATIONS = { move: 8, kill: [14, 40, 22], win: [30, 60, 30, 60, 90], lose: [70], newGame: 0 };

/** Sound effects and background music for the game pages. */
export default function useGameSounds() {
    const sounds = useMemo(
        () => Object.fromEntries(Object.entries(SOURCES).map(([name, src]) => [name, new Audio(src)])),
        []
    );
    const music = useRef(null);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const { settings } = useGameSettings();
    const { soundEffects, musicVolume, haptics } = settings;

    const play = useCallback(
        (name) => {
            if (haptics && VIBRATIONS[name] && typeof navigator !== 'undefined' && navigator.vibrate) {
                try {
                    navigator.vibrate(VIBRATIONS[name]);
                } catch {
                    // Some browsers throw when vibration isn't allowed yet.
                }
            }
            const audio = sounds[name];
            if (!audio || !soundEffects) return;
            audio.currentTime = 0;
            // play() is rejected when the browser blocks audio before the first user interaction.
            audio.play().catch(() => {});
        },
        [sounds, soundEffects, haptics]
    );

    const toggleMusic = useCallback(() => {
        if (!music.current) {
            music.current = new Audio(backgroundMusic);
            music.current.loop = true;
            music.current.volume = musicVolume;
        }
        if (isMusicPlaying) {
            music.current.pause();
            setIsMusicPlaying(false);
        } else {
            music.current.play().catch(() => {});
            setIsMusicPlaying(true);
        }
    }, [isMusicPlaying, musicVolume]);

    useEffect(() => {
        if (music.current) music.current.volume = musicVolume;
    }, [musicVolume]);

    useEffect(() => () => music.current?.pause(), []);

    return { play, toggleMusic, isMusicPlaying };
}
