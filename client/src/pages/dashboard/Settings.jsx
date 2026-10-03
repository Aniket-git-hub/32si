import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
import GameSettings from "../../components/dashboard/settings/GameSettings"
import ProfileSettings from "../../components/dashboard/settings/ProfileSettings"

export default function Settings() {
  return (
    <Tabs variant='enclosed' colorScheme="purple" >
      <TabList>
        <Tab>Profile</Tab>
        <Tab>Game</Tab>
      </TabList>
      <TabPanels>
        <TabPanel >
          <ProfileSettings />
        </TabPanel>
        <TabPanel>
          <GameSettings />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
