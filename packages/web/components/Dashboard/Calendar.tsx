import {
  Box,
  ButtonGroup,
  CalendarIcon,
  ExternalLinkIcon,
  IconButton,
  Image,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  VStack,
} from '@metafam/ds';
import React, { useEffect, useState } from 'react';

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState<
    {
      title: string;
      description: string;
      start: number;
      end: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);

        const fetchResponse = await fetch(
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQw-djV3Ay4Snvu6YzlhQbIMP7m0rTUXyJiYLMhuTo_CKHNMoI14mVB6-hw2JrmZLIz29_wBY4j4UhZ/pub?output=csv',
        );
        const data = await fetchResponse.text();
        const preparedData = data
          .replace(/(\n)/gm, '')
          .split(/[\r]/)
          .map((l) => l.split(','))
          .map((event) => ({
            title: event[0],
            description: event[1],
            start: Number(event[2]),
            end: Number(event[3]),
          }));
        console.log('preparedData', preparedData);
        setEvents(preparedData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    getData();
  }, []);

  return (
    <div>
      {loading ? (
        <div>loading</div>
      ) : (
        <VStack
          as="ol"
          className="calendar"
          width="100%"
          mt={5}
          ml={0}
          sx={{
            listStyle: 'none',
          }}
        >
          <Box
            as="li"
            className="calendar__day"
            display="flex"
            width="100%"
            px={0}
            py={0}
            mb={3}
            flexFlow="column wrap"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Box
              as="h3"
              fontSize="sm"
              className="calendar__day--title"
              mb={3}
              px={5}
            >
              Monday • 24 May 2021
            </Box>
            <VStack
              as="ol"
              className="calendar__day--events"
              ml={0}
              width="100%"
              sx={{
                listStyle: 'none',
              }}
            >
              <Box
                as="li"
                className="calendar__day--event"
                width="100%"
                px={5}
                py={2}
                backgroundColor="blackAlpha.500"
                borderRadius="md"
              >
                <Popover colorScheme="purple">
                  <PopoverTrigger>
                    <Box tabIndex={0} role="button" aria-label="Event summary">
                      <Box
                        as="h4"
                        fontSize="md"
                        fontFamily="body"
                        fontWeight="bold"
                      >
                        Champions Ring
                      </Box>
                      <Box
                        as="span"
                        fontWeight="100"
                        fontFamily="body"
                        fontSize="xs"
                      >
                        16:00 – 17:00
                      </Box>
                    </Box>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent
                      backgroundColor="purpleTag70"
                      backdropFilter="blur(10px)"
                      boxShadow="0 0 10px rgba(0,0,0,0.3)"
                      borderWidth={0}
                      color="white"
                      sx={{
                        _focus: {
                          outline: 'none',
                        },
                      }}
                    >
                      <Box
                        bg="transparent"
                        borderWidth={0}
                        position="absolute"
                        left={-1}
                        top={0}
                        width="100%"
                        textAlign="center"
                      >
                        <Image
                          src="/assets/logo.png"
                          minH="15px"
                          minW="12px"
                          maxH="15px"
                          mx="auto"
                          transform="translateY(-7px)"
                        />
                      </Box>
                      <PopoverCloseButton />
                      <PopoverHeader
                        borderColor="cyanText"
                        borderBottomWidth={1}
                        fontWeight="600"
                        fontFamily="exo"
                      >
                        Champions Ring
                      </PopoverHeader>
                      <PopoverBody>
                        <Box
                          as="dl"
                          sx={{
                            dt: {
                              fontSize: 'sm',
                              fontWeight: '600',
                            },
                          }}
                        >
                          <Box as="dt">Date &amp; Time</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            16:00 – 17:00
                          </Box>
                          <Box as="dt">Description</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            Consequat dolore veniam cupidatat id sit velit
                            consequat.
                          </Box>
                          <Box as="dt">Attendees</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            If there is an attendees list
                          </Box>
                        </Box>
                      </PopoverBody>
                      <PopoverFooter borderTopWidth={0}>
                        <ButtonGroup variant="ghost" colorScheme="cyan">
                          <IconButton
                            aria-label="Add to your calendar"
                            icon={<CalendarIcon />}
                          />
                          <IconButton
                            aria-label="View calendar"
                            icon={<ExternalLinkIcon />}
                          />
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </Box>
              <Box
                as="li"
                className="calendar__day--event"
                width="100%"
                px={5}
                py={2}
                backgroundColor="blackAlpha.500"
                borderRadius="md"
              >
                <Popover colorScheme="purple">
                  <PopoverTrigger>
                    <Box tabIndex={0} role="button" aria-label="Some box">
                      <Box
                        as="h4"
                        fontSize="md"
                        fontFamily="body"
                        fontWeight="bold"
                      >
                        Headhunters align
                      </Box>
                      <Box
                        as="span"
                        fontWeight="100"
                        fontFamily="body"
                        fontSize="xs"
                      >
                        18:00 – 19:00
                      </Box>
                    </Box>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent
                      backgroundColor="purpleTag70"
                      backdropFilter="blur(10px)"
                      boxShadow="0 0 10px rgba(0,0,0,0.3)"
                      borderWidth={0}
                      color="white"
                      sx={{
                        _focus: {
                          outline: 'none',
                        },
                      }}
                    >
                      <Box
                        bg="transparent"
                        borderWidth={0}
                        position="absolute"
                        left={-1}
                        top={0}
                        width="100%"
                        textAlign="center"
                      >
                        <Image
                          src="/assets/logo.png"
                          minH="15px"
                          minW="12px"
                          maxH="15px"
                          mx="auto"
                          transform="translateY(-7px)"
                        />
                      </Box>
                      <PopoverCloseButton />
                      <PopoverHeader
                        borderColor="cyanText"
                        borderBottomWidth={1}
                        fontWeight="600"
                        fontFamily="exo"
                      >
                        Headhunters Align
                      </PopoverHeader>
                      <PopoverBody>
                        <Box
                          as="dl"
                          sx={{
                            dt: {
                              fontSize: 'sm',
                              fontWeight: '600',
                            },
                          }}
                        >
                          <Box as="dt">Date &amp; Time</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            18:00 – 19:00
                          </Box>
                          <Box as="dt">Description</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            Consequat dolore veniam cupidatat id sit velit
                            consequat.
                          </Box>
                          <Box as="dt">Attendees</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            If there is an attendees list
                          </Box>
                        </Box>
                      </PopoverBody>
                      <PopoverFooter borderTopWidth={0}>
                        <ButtonGroup variant="ghost" colorScheme="cyan">
                          <IconButton
                            aria-label="Add to your calendar"
                            icon={<CalendarIcon />}
                          />
                          <IconButton
                            aria-label="View calendar"
                            icon={<ExternalLinkIcon />}
                          />
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </Box>
            </VStack>
          </Box>

          <Box
            as="li"
            className="calendar__day"
            display="flex"
            width="100%"
            px={0}
            py={0}
            mb={3}
            flexFlow="column wrap"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Box
              as="h3"
              fontSize="sm"
              className="calendar__day--title"
              mb={3}
              px={5}
            >
              Tuesday • 25 May 2021
            </Box>
            <VStack
              as="ol"
              className="calendar__day--events"
              ml={0}
              width="100%"
              sx={{
                listStyle: 'none',
              }}
            >
              <Box
                as="li"
                className="calendar__day--event"
                width="100%"
                px={5}
                py={2}
                backgroundColor="blackAlpha.500"
                borderRadius="md"
              >
                <Popover colorScheme="purple">
                  <PopoverTrigger>
                    <Box tabIndex={0} role="button" aria-label="Some box">
                      <Box
                        as="h4"
                        fontSize="md"
                        fontFamily="body"
                        fontWeight="bold"
                      >
                        Content &amp; Shilling Strategy
                      </Box>
                      <Box
                        as="span"
                        fontWeight="100"
                        fontFamily="body"
                        fontSize="xs"
                      >
                        16:00 – 17:00
                      </Box>
                    </Box>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent
                      backgroundColor="purpleTag70"
                      backdropFilter="blur(10px)"
                      boxShadow="0 0 10px rgba(0,0,0,0.3)"
                      borderWidth={0}
                      color="white"
                      sx={{
                        _focus: {
                          outline: 'none',
                        },
                      }}
                    >
                      <Box
                        bg="transparent"
                        borderWidth={0}
                        position="absolute"
                        left={-1}
                        top={0}
                        width="100%"
                        textAlign="center"
                      >
                        <Image
                          src="/assets/logo.png"
                          minH="15px"
                          minW="12px"
                          maxH="15px"
                          mx="auto"
                          transform="translateY(-7px)"
                        />
                      </Box>
                      <PopoverCloseButton />
                      <PopoverHeader
                        borderColor="cyanText"
                        borderBottomWidth={1}
                        fontWeight="600"
                        fontFamily="exo"
                      >
                        Content &amp; Shilling Strategy
                      </PopoverHeader>
                      <PopoverBody>
                        <Box
                          as="dl"
                          sx={{
                            dt: {
                              fontSize: 'sm',
                              fontWeight: '600',
                            },
                          }}
                        >
                          <Box as="dt">Date &amp; Time</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            17:00 – 18:00
                          </Box>
                          <Box as="dt">Description</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            Consequat dolore veniam cupidatat id sit velit
                            consequat.
                          </Box>
                          <Box as="dt">Attendees</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            If there is an attendees list
                          </Box>
                        </Box>
                      </PopoverBody>
                      <PopoverFooter borderTopWidth={0}>
                        <ButtonGroup variant="ghost" colorScheme="cyan">
                          <IconButton
                            aria-label="Add to your calendar"
                            icon={<CalendarIcon />}
                          />
                          <IconButton
                            aria-label="View calendar"
                            icon={<ExternalLinkIcon />}
                          />
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </Box>
              <Box
                as="li"
                className="calendar__day--event"
                width="100%"
                px={5}
                py={2}
                backgroundColor="blackAlpha.500"
                borderRadius="md"
              >
                <Popover colorScheme="purple">
                  <PopoverTrigger>
                    <Box tabIndex={0} role="button" aria-label="Some box">
                      <Box
                        as="h4"
                        fontSize="md"
                        fontFamily="body"
                        fontWeight="bold"
                      >
                        Shillers Align
                      </Box>
                      <Box
                        as="span"
                        fontWeight="100"
                        fontFamily="body"
                        fontSize="xs"
                      >
                        17:00 – 18:00
                      </Box>
                    </Box>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent
                      backgroundColor="purpleTag70"
                      backdropFilter="blur(10px)"
                      boxShadow="0 0 10px rgba(0,0,0,0.3)"
                      borderWidth={0}
                      color="white"
                      sx={{
                        _focus: {
                          outline: 'none',
                        },
                      }}
                    >
                      <Box
                        bg="transparent"
                        borderWidth={0}
                        position="absolute"
                        left={-1}
                        top={0}
                        width="100%"
                        textAlign="center"
                      >
                        <Image
                          src="/assets/logo.png"
                          minH="15px"
                          minW="12px"
                          maxH="15px"
                          mx="auto"
                          transform="translateY(-7px)"
                        />
                      </Box>
                      <PopoverCloseButton />
                      <PopoverHeader
                        borderColor="cyanText"
                        borderBottomWidth={1}
                        fontWeight="600"
                        fontFamily="exo"
                      >
                        Shillers Align
                      </PopoverHeader>
                      <PopoverBody>
                        <Box
                          as="dl"
                          sx={{
                            dt: {
                              fontSize: 'sm',
                              fontWeight: '600',
                            },
                          }}
                        >
                          <Box as="dt">Date &amp; Time</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            17:00 – 18:00
                          </Box>
                          <Box as="dt">Description</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            Consequat dolore veniam cupidatat id sit velit
                            consequat.
                          </Box>
                          <Box as="dt">Attendees</Box>
                          <Box
                            as="dd"
                            fontWeight="100"
                            fontFamily="body"
                            fontSize="xs"
                          >
                            If there is an attendees list
                          </Box>
                        </Box>
                      </PopoverBody>
                      <PopoverFooter borderTopWidth={0}>
                        <ButtonGroup variant="ghost" colorScheme="cyan">
                          <IconButton
                            aria-label="Add to your calendar"
                            icon={<CalendarIcon />}
                          />
                          <IconButton
                            aria-label="View calendar"
                            icon={<ExternalLinkIcon />}
                          />
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </Box>
            </VStack>
          </Box>
        </VStack>
      )}
    </div>
  );
};
