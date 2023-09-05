import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
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
          <p>Game Settings</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
