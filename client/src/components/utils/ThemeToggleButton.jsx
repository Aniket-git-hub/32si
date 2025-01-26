import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { BsMoon, BsSun } from 'react-icons/bs'

const ThemeToggleButton = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const SwitchIcon = useColorModeValue(BsMoon, BsSun)

    return (
        <IconButton
            size="md"
            fontSize="lg"
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            variant="ghost"
            color="current"
            marginLeft="2"
            onClick={toggleColorMode}
            icon={<SwitchIcon />}
        />
    )
}

export default ThemeToggleButton
