import { FC } from "react";

const main =
  /(?:https?:\/\/(?:(?:3speak\.(?:online|co|tv)\/watch\?v=)|(?:3speak\.(?:online|co|tv)\/embed\?v=)))([A-Za-z0-9_\-/.]+)(&.*)?/i;

/**
 * Extract 3Speak video ID from a link
 */
export function getThreespeakMetadataFromLink(data: string) {
  if (!data) return null;

  const match = data.match(main);
  if (!match) return undefined;
  const id = match[1];
  return id;
}

/**
 * 3Speak video embed component
 */
export const ThreeSpeakEmbed: FC<{ id: string }> = ({ id }) => {
  const url = `https://3speak.tv/embed?v=${id}`;

  return (
    <div key={`threespeak-${id}`} className="videoWrapper">
      <iframe title="3Speak embedded player" src={url} />
    </div>
  );
};
