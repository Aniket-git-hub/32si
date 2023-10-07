import { useEffect, useState } from 'react';
import { Box, Input, Button, Stack, InputGroup, InputLeftElement, HStack, Flex, ListItem, List, Center } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import useDebounce from '../../hooks/useDebounce';
import { getProfilePicture, getSmallProfilePicture, searchUsers } from '../../api/user';
import AvatarWithPreview from './AvatarWithPreview';
import { useNavigate } from 'react-router-dom';

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
            console.log(value)
            try {
                  const query = { query: value, page, limit };
                  if (user && user.location && user.location.coordinates) {
                        query.longitude = user.location.coordinates[0];
                        query.latitude = user.location.coordinates[1];
                  }
                  const response = await searchUsers(query, abortController.signal);
                  setSearchResults(response.data.users);
                  setHasMore(response.data.hasMore)
                  console.log(response.data);
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

                              {searchResults && searchResults.map((e, i) => {
                                    return <>
                                          <ListItem
                                                _hover={{ bg: "gray.100", cursor: "pointer" }}
                                                px={3}
                                                py={2}
                                                borderRadius={5}
                                                onClick={() => {
                                                      onClose()
                                                      navigate(`/profile/@${e.username}`)
                                                }}
                                                key={e.username + i}
                                          >
                                                <HStack>
                                                      <AvatarWithPreview
                                                            size={"sm"}
                                                            name={e.name}
                                                            smallURL={getSmallProfilePicture(e.profilePhoto)}
                                                            largeURL={getProfilePicture(e.profilePhoto)}
                                                      >
                                                      </AvatarWithPreview>
                                                      <Center>
                                                            {e.username}
                                                      </Center>
                                                </HStack>
                                          </ListItem>
                                    </>

                              })}
                        </List>
                  </Box>
            </Box>
      );
}

export default FullTextSearchUsers;