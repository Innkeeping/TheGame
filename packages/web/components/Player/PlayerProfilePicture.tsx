import type { AvatarProps } from '@metafam/ds';
import { SquareImage } from 'components/SquareImage';
import type { Player } from 'graphql/autogen/types';
import type { GuildPlayer } from 'graphql/types';
import { useProfileImageOnload } from 'lib/hooks/useProfileImageOnload';
import React from 'react';

type PlayerProfilePictureProps = AvatarProps & {
  player?: Player | GuildPlayer;
};

export const PlayerProfilePicture: React.FC<PlayerProfilePictureProps> = ({
  player,
  src,
  ...props
}) => {
  const imageUrl = useProfileImageOnload({ player });

  return (
    <>
      <SquareImage src={imageUrl as string ?? undefined} {...props} />
    </>
  );
};
