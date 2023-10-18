import {
  Box,
  Flex,
  Heading,
  Link,
  MetaTilePathPlaybook,
  Text,
  useBreakpointValue,
  VStack,
} from '@metafam/ds';
import { Carousel } from 'components/Carousel';
// import { Carousel } from 'components/Carousel';
import { PageContainer } from 'components/Container';
import { MetaLink } from 'components/Link';
import { HeadComponent } from 'components/Seo';
import React from 'react';
import {
  PathPlaybookType,
  QuestChainPathPlaybookPaths,
  QuestChainPathsAndPlaybooksDetails,
  QuestChainsCategoriesDetails,
} from 'utils/questChains';

/**
 * This page merges Paths & Playbooks into one page.
 * @returns All of the paths, playbooks, and great houses categorised in a single page.
 */
const AcademyPage: React.FC = () => {
  const carouselGap =
    useBreakpointValue({ base: 8, md: 6, xl: 24, '2xl': 32 }) || 32;
  const makeItemPath = (type: PathPlaybookType): string => {
    let urlPath: string;

    switch (type) {
      case 'path':
        urlPath = QuestChainPathPlaybookPaths.path;
        break;
      case 'playbook':
        urlPath = QuestChainPathPlaybookPaths.playbook;
        break;
      case 'greatHouse':
        urlPath = QuestChainPathPlaybookPaths.greatHouse;
        break;
      default:
        urlPath = '';
        break;
    }
    return urlPath;
  };

  return (
    <PageContainer>
      <HeadComponent
        title="MetaGame Academy"
        description="MetaGame is a Massive Online Coordination Game! The Academy is full of Paths and Playbooks to help you find your way and level up in MetaGame & life."
        url="https://metagame.wtf/paths-and-playbooks"
      />
      <VStack
        spacing={7}
        w={{ base: '100%', xl: 'unset' }}
        maxW={{ base: 'unset', xl: '6xl', '2xl': '92rem' }}
      >
        <VStack spacing={1} mb={12} w="full" align="center">
          <Heading
            as="h1"
            fontFamily="body"
            fontWeight="600"
            fontSize={{ base: '4xl', sm: '6xl' }}
            textAlign="center"
            w={{ base: 'full', xl: ' full' }}
          >
            The Academy
          </Heading>
          <Text
            fontSize={{ base: 'lg', lg: 'xl' }}
            w="full"
            maxW="4xl"
            textAlign="center"
          >
            This place contains paths, playbooks and all things educational,
            related to MetaGame.
          </Text>
        </VStack>

        {Object.entries(QuestChainsCategoriesDetails).map((category, i) => {
          const {
            name: categoryName,
            title: categoryTitle,
            description,
          } = category[1];
          const categoryItems = Object.entries(
            QuestChainPathsAndPlaybooksDetails,
          ).filter(([name, { category: cat }]) => cat === categoryName);

          return (
            <VStack
              key={category[1].name}
              spacing={{ base: 4, xl: 0 }}
              w="full"
              alignItems="left"
            >
              <VStack spacing={1} alignItems="left">
                <Heading
                  as="h2"
                  fontFamily="body"
                  fontWeight="600"
                  fontSize={{ base: '3xl', sm: '5xl' }}
                >
                  {categoryTitle}
                </Heading>
                {description ? (
                  <Text fontSize={{ base: 'md', lg: 'lg' }} maxW="3xl">
                    {description}
                  </Text>
                ) : null}
              </VStack>
              {categoryItems.length > 0 ? (
                <Box
                  w={{
                    base: '100%',
                    lg: 'calc(100% + 4rem)',
                    '2xl': 'calc(100% + 10rem)',
                  }}
                  transform={{
                    base: 'unset',
                    lg: 'translateX(-2rem)',
                    '2xl': 'translateX(-5rem)',
                  }}
                  p={{ base: 0, lg: '1rem' }}
                  px={{ base: 0, lg: '2rem', '2xl': '5rem' }}
                  mx="auto"
                  overflowY="hidden"
                  overflowX="hidden"
                >
                  <Carousel
                    gap={carouselGap}
                    shrinkItems
                    hidePositions
                    hideNav={false}
                  >
                    {categoryItems.map(
                      ([
                        name,
                        {
                          title,
                          image,
                          difficulty,
                          time,
                          category: cat,
                          seedsEarned,
                          type: pathType,
                        },
                      ]) => (
                        <Card
                          key={`${title}-card`}
                          {...{
                            title,
                            difficulty,
                            time,
                            link: `${makeItemPath(pathType)}${name}`,
                            image,
                            color: '#AB7C94',
                            category: cat,
                            seedsEarned,
                            length: categoryItems.length,
                            index: i,
                          }}
                        />
                      ),
                    )}
                  </Carousel>
                </Box>
              ) : (
                <Box w="full" textAlign="left">
                  <Text as="p" fontSize={{ base: 'base', lg: 'xl' }}>
                    No quests found for this category. <br />
                    Why not{' '}
                    <MetaLink href="https://discord.gg/jDwXsQ6J" isExternal>
                      join the Discord
                    </MetaLink>{' '}
                    and find out how to create one and get it added!
                  </Text>
                </Box>
              )}
            </VStack>
          );
        })}
      </VStack>
    </PageContainer>
  );
};

type CardProps = {
  title: string;
  link: string;
  image: string;
  seedsEarned?: number;
  length: number;
  index: number;
};

const Card: React.FC<CardProps> = ({ title, link, image, length, index }) => (
  <Link
    role="group"
    _hover={{ textDecoration: 'none' }}
    href={link}
    w="100%"
    minW={{ base: '16.875rem', '2xl': '21.5rem' }}
    p={0}
  >
    <MetaTilePathPlaybook image={image} index={index} length={length}>
      <Flex alignItems="center" justifyContent="center" h="full" w="full">
        <Text
          p={0}
          fontSize={{ base: 'xs', lg: 'xl', '2xl': '3xl' }}
          fontWeight={{ base: 900, xl: 900 }}
          textShadow={{ base: '0 0 0.5rem rgba(0,0,0,0.8)' }}
          align="center"
          noOfLines={4}
          width="full"
          as="p"
        >
          {title}
        </Text>
      </Flex>
    </MetaTilePathPlaybook>
  </Link>
);

export default AcademyPage;
