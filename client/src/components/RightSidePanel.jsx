import { PhoneIcon } from "@chakra-ui/icons"
import { Box, Heading, Input, InputGroup, InputLeftElement, Stack, VStack } from "@chakra-ui/react"
import { FiSearch } from "react-icons/fi"

function RightSidePanel() {
  return (
    <Box minH="100%" p={5}>
      <Stack spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <FiSearch color='gray.300' />
          </InputLeftElement>
          <Input type='tel' placeholder='Search People' />
        </InputGroup>
      </Stack>
    </Box>
  )
}

export default RightSidePanel