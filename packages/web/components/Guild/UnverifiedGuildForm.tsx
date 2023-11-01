import { isAddress } from '@ethersproject/address';
import {
  Box,
  CloseButton,
  Flex,
  HStack,
  Image,
  Input,
  LoadingState,
  MetaButton,
  MultiSelect,
  Select,
  Spinner,
  Text,
  Textarea,
  VStack,
} from '@metafam/ds';
import { SelectOption } from '@metafam/ds/src/MultiSelect';
import FileOpenIcon from 'assets/file-open-icon.svg';
import { Field, FieldDescription } from 'components/Forms/Field';
import { MetaLink } from 'components/Link';
import {
  DiscordRole,
  GuildDaoInput,
  GuildFragment,
  GuildType_Enum,
  Maybe,
  useGetGuildMetadataQuery,
} from 'graphql/autogen/types';
import { useImageReader } from 'lib/hooks/useImageReader';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Controller,
  FieldError,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { optimizedImage } from 'utils/imageHelpers';

const validations = {
  guildname: {
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  name: {
    required: true,
    minLength: 4,
  },
  type: {
    required: true,
  },
  discordAdminRoles: {
    validate: (roles: SelectOption[]) => roles != null && roles.length > 0,
  },
  discordMembershipRoles: {
    validate: (roles: SelectOption[]) => roles != null && roles.length > 0,
  },
  daoAddress: {
    required: true,
    validate: (address: string) => isAddress(address),
  },
  daoNetwork: {
    required: true,
  },
};

export interface EditGuildFormInputs {
  guildname: string;
  name: string;
  description?: Maybe<string>;
  discordInviteUrl?: Maybe<string>;
  joinUrl?: Maybe<string>;
  logoUrl?: Maybe<string>;
  logoFile?: Maybe<FileList>;
  websiteUrl?: Maybe<string>;
  twitterUrl?: Maybe<string>;
  githubUrl?: Maybe<string>;
  type: GuildType_Enum;
  discordAdminRoles: SelectOption[];
  discordMembershipRoles: SelectOption[];
  daos?: Maybe<GuildDaoInput[]>;
}

const placeholderDaoInput = {
  contractAddress: '',
  network: 'mainnet',
  label: null,
  url: null,
};

const getDefaultFormValues = (
  guild: GuildFragment,
  metadata: GuildMetadata | undefined,
  roleOptions: SelectOption[],
): EditGuildFormInputs => {
  const discordAdminRoleIds = metadata?.discordMetadata.administratorRoleIds;
  const discordAdminRoleOptions =
    metadata == null || discordAdminRoleIds == null
      ? []
      : roleOptions.filter((r) => discordAdminRoleIds.includes(r.value));

  const discordMembershipRoleIds = metadata?.discordMetadata.membershipRoleIds;
  const discordMembershipRoleOptions =
    metadata == null || discordMembershipRoleIds == null
      ? []
      : roleOptions.filter((r) => discordMembershipRoleIds.includes(r.value));

  let daos: GuildDaoInput[] = [];
  if (guild.daos?.length > 0) {
    daos = guild.daos.map((d) => ({
      contractAddress: d.contractAddress,
      network: d.network,
      label: d.label,
      url: d.url,
    }));
  }

  return {
    guildname: guild.guildname,
    name: guild.name,
    description: guild.description || '',
    logoUrl: optimizedImage('logoURL', guild.logo) || '',
    websiteUrl: guild.websiteUrl || '',
    type: guild.type,
    discordAdminRoles: discordAdminRoleOptions,
    discordMembershipRoles: discordMembershipRoleOptions,
    daos,
  };
};

type Props = {
  workingGuild?: GuildFragment;
  onSubmit: (data: EditGuildFormInputs) => void;
  success?: boolean;
  submitting?: boolean;
};

type GuildMetadata = {
  discordRoles: DiscordRole[];
  discordMetadata: {
    membershipRoleIds: string[];
    administratorRoleIds: string[];
  };
};

export const UnverifiedGuildForm: React.FC<Props> = ({
  workingGuild,
  onSubmit,
  success,
  submitting,
}) => {
  const router = useRouter();
  const readFile = useImageReader();

  const [getGuildMetadataResponse, getGuildMetadata] = useGetGuildMetadataQuery(
    {
      variables: { id: workingGuild?.id },
    },
  );
  const fetchingMetadata =
    getGuildMetadataResponse == null || getGuildMetadataResponse.fetching;
  const guildMetadata = getGuildMetadataResponse.data
    ?.guild_metadata[0] as GuildMetadata;

  const loadGuildMetadata = () => {
    getGuildMetadata({ requestPolicy: 'network-only' });
  };

  const roleOptions = useMemo(() => {
    const allDiscordRoles = guildMetadata?.discordRoles || [];
    return allDiscordRoles.map((role) => ({
      label: role.name,
      value: role.id,
    }));
  }, [guildMetadata]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm<EditGuildFormInputs>({
    mode: 'onTouched',
  });

  const {
    fields: daoFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'daos',
  });

  useEffect(() => {
    const values = getDefaultFormValues(
      workingGuild,
      guildMetadata,
      roleOptions,
    );
    // https://react-hook-form.com/api#useForm
    reset(values);
  }, [workingGuild, guildMetadata, roleOptions, reset]);

  const [logoURI, setLogoURI] = useState<string | undefined>(
    workingGuild.logo ?? undefined,
  );
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  const onFileChange = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setLoading(true);

      try {
        const dataURL = await readFile(file);
        setLogoURI(dataURL);
      } catch (e) {
        setErrored(true);
      } finally {
        setLoading(false);
      }
    },
    [readFile],
  );

  return (
    <Box w="100%" maxW="40rem">
      <VStack>
        <Field label="Logo" error={errors.logoUrl}>
          <Flex
            w="10em"
            h="10em"
            borderRadius="full"
            display="inline-flex"
            overflow="hidden"
            align="center"
            justify="center"
            position="relative"
            border="2px solid"
            borderColor={active ? 'blue.400' : 'transparent'}
          >
            <Image
              onLoad={() => setLoading(false)}
              onError={() => setErrored(true)}
              display={loading ? 'none' : 'inherit'}
              src={logoURI}
              borderRadius="full"
              objectFit="cover"
              h="full"
              w="full"
            />
            {loading &&
              (!logoURI || errored ? (
                <Image w="5em" mx="2.5em" src={FileOpenIcon} opacity={0.5} />
              ) : (
                <Spinner size="xl" color="purple.500" thickness="4px" />
              ))}
            <Controller
              {...{ control }}
              name="logoFile"
              render={({ field: { onChange, value, ...props } }) => (
                <Input
                  {...props}
                  type="file"
                  onChange={(evt) => {
                    onChange(evt.target.files);
                    const file = evt.target.files?.[0];
                    onFileChange(file);
                  }}
                  accept="image/png,image/gif,image/jpeg,image/svg+xml"
                  position="absolute"
                  top={0}
                  bottom={0}
                  left={0}
                  right={0}
                  opacity={0}
                  w="100%"
                  h="100%"
                  onFocus={() => setActive(true)}
                  onBlur={() => setActive(false)}
                />
              )}
            />
          </Flex>
          <FieldDescription>
            Logos should be square (same width and height) and reasonably
            high-resolution.
          </FieldDescription>
        </Field>
        <Field label="Guildname" error={errors.guildname}>
          <Input
            {...register('guildname', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
              minLength: {
                value: validations.guildname.minLength,
                message: `Must be at least ${validations.guildname.minLength} characters.`,
              },
              maxLength: {
                value: validations.guildname.maxLength,
                message: `Must be no more than ${validations.guildname.maxLength} characters.`,
              },
            })}
            isInvalid={!!errors.guildname}
            background="dark"
          />
          <FieldDescription>
            A unique identifier for your guild, like a username.
          </FieldDescription>
        </Field>
        <Field label="Name" error={errors.name}>
          <Input
            {...register('name', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
              minLength: {
                value: validations.guildname.minLength,
                message: `Must be at least ${validations.guildname.minLength} characters.`,
              },
            })}
            isInvalid={!!errors.name}
            background="dark"
          />
          <FieldDescription>
            Your guild&apos;s name. This is what will show throughout MetaGame.
          </FieldDescription>
        </Field>
        <Field label="Description" error={errors.description}>
          <Textarea
            placeholder="What's your guild all about?"
            {...register('description')}
            background="dark"
          />
        </Field>
        <Field label="Website URL" error={errors.websiteUrl}>
          <Input {...register('websiteUrl')} background="dark" />
          <FieldDescription>Your guild&apos;s main website.</FieldDescription>
        </Field>
        <Field label="Discord Invite URL" error={errors.discordInviteUrl}>
          <Input
            placeholder="https://discord.gg/fHvx7gu"
            {...register('discordInviteUrl')}
            background="dark"
          />
          <FieldDescription>
            A public invite URL for your Discord server.
          </FieldDescription>
        </Field>
        <Field label="Join URL" error={errors.joinUrl}>
          <Input {...register('joinUrl')} background="dark" />
          <FieldDescription>
            The URL that the <q>JOIN</q> button will point to.
          </FieldDescription>
        </Field>
        <Field label="Twitter URL" error={errors.twitterUrl}>
          <Input
            placeholder="https://twitter.com/…"
            {...register('twitterUrl')}
            background="dark"
          />
          <FieldDescription>
            Your guild&apos;s home on Twitter.
          </FieldDescription>
        </Field>
        <Field label="GitHub URL" error={errors.githubUrl}>
          <Input
            placeholder="https://github.com/…"
            {...register('githubUrl')}
            background="dark"
          />
          <FieldDescription>Your guild&apos;s home on GitHub.</FieldDescription>
        </Field>
        <Field label="Type" error={errors.type}>
          <Select
            {...register('type', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
            })}
            isInvalid={!!errors.type}
            background="dark"
            color="white"
          >
            {Object.entries(GuildType_Enum).map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </Select>
        </Field>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          borderColor="rgba(255, 255, 255, 0.25)"
          p={4}
        >
          <Text mb={2}>Related DAOs or other contracts</Text>
          <Text fontSize="sm" mb={4}>
            If your guild has an on-chain DAO, token, multisig, or any other
            relevant contract, you can specify them here. If the entered
            contract address is in DAOHaus, we will look up its information from
            the{' '}
            <MetaLink
              isExternal
              href="https://thegraph.com/hosted-service/subgraph/odyssy-automaton/daohaus"
            >
              DAOHaus Subgraph
            </MetaLink>
            . Otherwise you can provide your own URL to link to.
          </Text>
          {daoFields.map((_, index) => (
            <Box
              key={index}
              background="rgba(255, 255, 255, 0.1)"
              borderRadius="lg"
              p={2}
              mb={4}
            >
              <HStack justifyContent="space-between">
                <Text size="lg" ml={2}>
                  {index + 1}.
                </Text>
                <CloseButton size="sm" onClick={() => remove(index)} />
              </HStack>
              <Box borderRadius="lg" p={2}>
                <Flex direction="row">
                  <Box mr={4}>
                    <Field label="Label">
                      <Input
                        placeholder="DAO, Multisig, etc"
                        {...register(`daos.${index}.label`)}
                        background="dark"
                      />
                    </Field>
                  </Box>
                  <Box flex="1">
                    <Field label="URL">
                      <Input
                        placeholder="https://"
                        {...register(`daos.${index}.url`)}
                        background="dark"
                      />
                      <FieldDescription>
                        An optional URL to link this address to
                      </FieldDescription>
                    </Field>
                  </Box>
                </Flex>
                <Flex direction="row">
                  <Box maxWidth="10rem" mr={4}>
                    <Field label="Network">
                      <Select
                        {...register(`daos.${index}.network`, {
                          required: {
                            value: true,
                            message: 'This is a required field.',
                          },
                        })}
                        background="dark"
                        color="white"
                      >
                        <option key="mainnet" value="mainnet">
                          Mainnet
                        </option>
                        <option key="polygon" value="polygon">
                          Polygon
                        </option>
                        <option key="gnosis" value="gnosis">
                          Gnosis
                        </option>
                      </Select>
                    </Field>
                  </Box>
                  <Box flex="1">
                    <Field
                      label="Address"
                      error={
                        (
                          errors.daos as {
                            contractAddress?: FieldError | undefined;
                          }[]
                        )?.[index]?.contractAddress
                      }
                    >
                      <Input
                        placeholder="0x…"
                        {...register(`daos.${index}.contractAddress`, {
                          required: validations.daoAddress.required,
                          pattern: {
                            value: /^0x([a-zA-Z0-9-]{40})$/,
                            message: 'Invalid contract address',
                          },
                        })}
                        background="dark"
                      />
                      <FieldDescription>
                        The address of the DAO contract, multisig, treasury,
                        etc.
                      </FieldDescription>
                    </Field>
                  </Box>
                </Flex>
              </Box>
            </Box>
          ))}
          <MetaButton size="sm" onClick={() => append(placeholderDaoInput)}>
            Add {daoFields.length > 0 ? 'Another' : 'a DAO'}
          </MetaButton>
        </Box>

        <HStack justify="space-between" mt={10} w="100%">
          <MetaButton
            isLoading={submitting}
            loadingText="Submitting information…"
            onClick={handleSubmit(onSubmit)}
            isDisabled={success}
            bg="purple.500"
          >
            Submit Guild Information
          </MetaButton>
        </HStack>
      </VStack>
    </Box>
  );
};
