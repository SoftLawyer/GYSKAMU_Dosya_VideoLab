import React from "react";
import { Composition } from "remotion";
import { GyskamuVideo } from "./GyskamuVideo";
import timelineData from "./timeline.json";

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const durationInFrames = Math.ceil((timelineData.totalDuration || 48) * fps);

  return (
    <>
      <Composition
        id="GyskamuDosya"
        component={GyskamuVideo}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
      />
    </>
  );
};
