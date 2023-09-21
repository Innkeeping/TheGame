import {
  Box,
  CloseIcon,
  Field,
  Flex,
  Input,
  MetaButton,
  MetaTheme,
  Select,
  Text,
  Button,
  VStack,
  EditIcon,
  DeleteIcon,
} from '@metafam/ds';
import { ProfileSection } from 'components/Section/ProfileSection';
import {
  Link,
  LinkType_Enum,
  Player,
  useAddPlayerLinkMutation,
  useDeletePlayerLinkMutation,
  useUpdatePlayerLinkMutation,
} from 'graphql/autogen/types';
import { getPlayerLinks } from 'graphql/queries/player';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { BoxMetadata, BoxTypes } from 'utils/boxTypes';

import LinkIcon from './LinkIcon';

type Props = {
  player: Player;
  isOwnProfile?: boolean;
  editing?: boolean;
  admin?: boolean;
  switchToEdit?: any
};

export interface PlayerLinkFormInputs {
  name: string;
  url: string;
  type: LinkType_Enum;
}

export const AddPlayerLink: React.FC<{
  player?: Player;
  metadata?: BoxMetadata;
  setMetadata?: (d: BoxMetadata) => void;
}> = ({ player }) => {

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues
  } = useForm<PlayerLinkFormInputs>({
    mode: 'onTouched',
  });

  const [, addLink] = useAddPlayerLinkMutation();

  const onSubmit = useCallback(
    async (link: PlayerLinkFormInputs) => {
      const playerLink = { playerId: player?.id, name: link.name || link.type, url: link.url, type: link.type};
      const { error } = await addLink(playerLink);

      if (error) {
        throw new Error(`Unable to add link. Error: ${error}`);
      }
    },
    [addLink, player?.id],
  );

  return (
    <Box w="100%">
      <VStack spacing={2}>
        <Field label="Name" error={errors.name}>
          <Input
            {...register('name')}
            isInvalid={!!errors.name}
            background="dark"
          />
        </Field>
        <Field label="Type" error={errors.url}>
          <Select
            sx={{
              textTransform: 'capitalize',
              '& > option': {
                backgroundColor: MetaTheme.colors.purpleBoxLight,
              },
              '& > option[value=""]': {
                fontStyle: 'italic',
                opacity: 0.75,
              },
            }}
            {...register('type', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
            })}
            isInvalid={!!errors.type}
            background="dark"
          >
            {Object.entries(LinkType_Enum).map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="URL" error={errors.url}>
          <Input
            {...register('url', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
            })}
            isInvalid={!!errors.url}
            background="dark"
          />
        </Field>
        <MetaButton
          loadingText="Adding link..."
          onClick={handleSubmit(onSubmit)}
          bg="purple.500"
        >
          Add Link
        </MetaButton>
      </VStack>
    </Box>
  );
};

export const PlayerLinks: React.FC<Props> = ({
  player,
  isOwnProfile,
  editing,
  admin,
  switchToEdit
}) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [, deleteLink] = useDeletePlayerLinkMutation();

  useEffect(() => {
    if (!player?.id) return;
    (async () => {
      console.log('made it in', player.id)
      getPlayerLinks(player.id).then((data) => setLinks(data.link));
    })();
  
  }, [player.id]);
  
  const deleteSingleLink = async (id: string) => {
    console.log(id,'id')
    const { error } = await deleteLink({ id });

    if (error) {
      throw new Error(`Unable to delete link. Error: ${error}`);
    }
  }

  return (
    <ProfileSection
      title="Links"
      type={BoxTypes.PLAYER_LINKS}
      {...{ isOwnProfile, editing }}
    >
      <VStack mt={4} w="full">
        {links?.map((link) => (
          <>
            <a
              href={link?.url || ''}
              target="_blank"
              rel="noreferrer"
              style={{ width: '100%' }}
              role="group"
              key={link?.id}
            >
              <Flex
                justifyContent="start"
                alignContent="center"
                color={'violet'}
                width={'full'}
                px={4}
                py={3}
                background={'blackAlpha.300'}
                transition={'ease-in-out'}
                transitionDuration={'300'}
                _hover={{
                  background: 'blackAlpha.500',
                }}
                _active={{
                  background: 'blackAlpha.700',
                }}
                rounded={'md'}
              >
                <LinkIcon type={link?.type} />
                <Text mx="auto" fontWeight={600}>
                  {link?.name}
                </Text>
                <Box
                  my="auto"
                  mr={1}
                  opacity={0}
                  _groupHover={{ opacity: 0.8 }}
                  _groupActive={{ opacity: 1 }}
                >
                  <FaExternalLinkAlt fill="currentColor" />
                </Box>
                
              </Flex>
            </a>
            {
              admin && (
                <>
                  <Button sx={{ bg: '#13003280' }} disabled={false} onClick={() => deleteSingleLink(link?.id)}>
                    <DeleteIcon />
                  </Button>
                  
                  <Button sx={{ ml: '1em', bg: '#13003280' }} onClick={() => switchToEdit('edit', link?.id)}>
                    <EditIcon />
                  </Button>
                </> 
              )}
          </>
          
        ))}
      </VStack>
    </ProfileSection>
  );
};

export const EditPlayerLink: React.FC<{
  player?: Player;
  metadata?: BoxMetadata;
  setMetadata?: (d: BoxMetadata) => void;
  editId?: string;
  editData?: PlayerLinkFormInputs;
}> = ({ player, editId, editData }) => {

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues
  } = useForm<PlayerLinkFormInputs>({
    mode: 'onTouched',
  });

  const [, addLink] = useAddPlayerLinkMutation();
  const [, updateLink] = useUpdatePlayerLinkMutation();

  const onSubmit = useCallback(
    async (link: PlayerLinkFormInputs) => {
      if (!editId) return
      const playerLink = { id: editId, name: link.name || link.type, url: link.url, type: link.type};
      const { error } = await updateLink(playerLink);

      if (error) {
        throw new Error(`Unable to add link. Error: ${error}`);
      }
    },
    [updateLink, player?.id],
  );

  return (
    <Box w="100%">
      <VStack spacing={2}>
        <Field label="Name" error={errors.name}>
          <Input
            {...register('name')}
            isInvalid={!!errors.name}
            background="dark"
          />
        </Field>
        <Field label="Type" error={errors.url}>
          <Select
            sx={{
              textTransform: 'capitalize',
              '& > option': {
                backgroundColor: MetaTheme.colors.purpleBoxLight,
              },
              '& > option[value=""]': {
                fontStyle: 'italic',
                opacity: 0.75,
              },
            }}
            {...register('type', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
            })}
            isInvalid={!!errors.type}
            background="dark"
          >
            {Object.entries(LinkType_Enum).map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="URL" error={errors.url}>
          <Input
            {...register('url', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
            })}
            isInvalid={!!errors.url}
            background="dark"
          />
        </Field>
        <MetaButton
          loadingText="Adding link..."
          onClick={handleSubmit(onSubmit)}
          bg="purple.500"
        >
          Edit Link
        </MetaButton>
      </VStack>
    </Box>
  );
};
