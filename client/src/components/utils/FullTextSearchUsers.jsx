import { Box, Flex, Input, InputGroup, InputLeftElement, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getProfilePicture, getSmallProfilePicture, searchUsers } from '../../api/user';
import useDebounce from '../../hooks/useDebounce';
import AvatarWithPreview from './AvatarWithPreview';

function FullTextSearchUsers({ onClose }) {
      const [page, setPage] = useState(1);
      const [limit] = useState(10);
      const navigate = useNavigate()

      const [searchResults, setSearchResults] = useState([]);
      const [inputValue, setInputValue] = useState('')
      const [hasMore, setHasMore] = useState(false)

      let abortController = new AbortController();
      const handleSearch = async (value, user) => {
            if (abortController) abortController.abort();

            abortController = new window.AbortController();
            try {
                  const query = { query: value, page, limit };
                  if (user && user.location && user.location.coordinates) {
                        query.longitude = user.location.coordinates[0];
                        query.latitude = user.location.coordinates[1];
                  }
                  const response = await searchUsers(query, abortController.signal);
                  setSearchResults(response.data.users);
                  setHasMore(response.data.hasMore)
            } catch (error) {
                  console.log(error);
            }
      };

      const debounceValue = useDebounce(inputValue, 1000)

      useEffect(() => {
            if (debounceValue.length >= 3) {
                  handleSearch(debounceValue);
            }
      }, [debounceValue, page]);

      useEffect(() => {
            return () => {
                  if (abortController) abortController.abort();
            };
      }, []);

      const handleInputChange = (event) => {
            setInputValue(event.target.value)
      };
      const hoverColor = useColorModeValue("gray.100", "gray.700")

      return (
            <Box>
                  <InputGroup mb={10}>
                        <InputLeftElement pointerEvents='none'>
                              <FiSearch color='gray.300' />
                        </InputLeftElement>
                        <Input type='tel' placeholder='Search People' onChange={handleInputChange} />
                  </InputGroup>

                  <Box minH={"50vh"} maxH={"50vh"} overflowY={"scroll"} sx={
                        {
                              '::-webkit-scrollbar': {
                                    display: 'none'
                              }
                        }
                  } >
                        <List>

                              {searchResults.length > 0 ? searchResults.map((e, i) => {
                                    return <>
                                          <ListItem
                                                _hover={{ bg: hoverColor, cursor: "pointer" }}
                                                px={3}
                                                py={2}
                                                m={1}
                                                borderRadius={5}
                                                onClick={() => {
                                                      onClose()
                                                      navigate(`/profile/@${e.username}`)
                                                }}
                                                key={i}
                                          >
                                                <Flex>
                                                      <AvatarWithPreview
                                                            name={e.name}
                                                            smallURL={getSmallProfilePicture(e.profilePhoto)}
                                                            largeURL={getProfilePicture(e.profilePhoto)}
                                                      />
                                                      <Box ml='3'>
                                                            <Text fontWeight='bold'>
                                                                  {e.username}
                                                            </Text>
                                                            <Text fontSize='sm'>{e.name}</Text>
                                                      </Box>
                                                </Flex>
                                          </ListItem>
                                    </>

                              }) :
                                    <>
                                          <ListItem px={3}
                                                py={2}
                                                m={1}>
                                                <Text>No User Found</Text>
                                          </ListItem>
                                    </>
                              }
                        </List>
                  </Box>
            </Box>
      );
}

export default FullTextSearchUsers;