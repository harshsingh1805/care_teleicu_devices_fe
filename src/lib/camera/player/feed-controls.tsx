import { useCameraFeed } from "@/lib/camera/camera-feed-context";
import cameraActionApi from "@/lib/camera/cameraActionApi";
import FeedButton from "@/lib/camera/player/feed-button";
import { mutate } from "@/lib/request";
import { cn } from "@/lib/utils";
import { isAppleDevice } from "@/utils";
import { ResetIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { Loader2, TriangleIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

const metaKey = isAppleDevice ? "Meta" : "Control";

interface Props {
  shortcutsDisabled?: boolean;
  inlineView: boolean;
}

export default function CameraFeedControls({
  shortcutsDisabled,
  ...props
}: Props) {
  const { setPlayerStatus, ptzPrecision, setPtzPrecision } = useCameraFeed();

  const resetStream = () => {
    setPlayerStatus("loading");
  };

  const controls = {
    position: (
      <>
        <RelativeMoveButton
          direction={Actions.UP | Actions.LEFT}
          shortcuts={[["Shift", "7"]]}
          shortcutsDisabled={shortcutsDisabled}
          helpText="Move Diagonally Up-Left"
          tooltipClassName="-translate-y-20"
        >
          <TriangleIcon className="-rotate-45 size-3" />
        </RelativeMoveButton>
        <RelativeMoveButton
          direction={Actions.UP}
          shortcuts={[
            [metaKey, "Shift", "8"],
            [metaKey, "Shift", "ArrowUp"],
          ]}
          shortcutsDisabled={shortcutsDisabled}
          tooltipClassName="-translate-y-20 -translate-x-11"
          helpText="Move Up"
        >
          <TriangleIcon className="rotate-0 size-3" />
        </RelativeMoveButton>
        <RelativeMoveButton
          direction={Actions.UP | Actions.RIGHT}
          shortcuts={[[metaKey, "Shift", "9"]]}
          shortcutsDisabled={shortcutsDisabled}
          helpText="Move Diagonally Up-Right"
          tooltipClassName="-translate-y-20 -translate-x-24"
        >
          <TriangleIcon className="rotate-45 size-3" />
        </RelativeMoveButton>
        <RelativeMoveButton
          direction={Actions.LEFT}
          shortcuts={[
            [metaKey, "Shift", "4"],
            [metaKey, "Shift", "ArrowLeft"],
          ]}
          shortcutsDisabled={shortcutsDisabled}
          helpText="Move Left"
        >
          <TriangleIcon className="-rotate-90 size-3" />
        </RelativeMoveButton>
        <FeedButton
          shortcuts={[["Shift", "P"]]}
          onTrigger={() => setPtzPrecision((p) => (p === 16 ? 1 : p << 1))}
          helpText="Toggle Precision"
          className="font-bold"
          shortcutsDisabled={shortcutsDisabled}
        >
          {ptzPrecision}x
        </FeedButton>
        <RelativeMoveButton
          direction={Actions.RIGHT}
          shortcuts={[
            [metaKey, "Shift", "6"],
            [metaKey, "Shift", "ArrowRight"],
          ]}
          shortcutsDisabled={shortcutsDisabled}
          helpText="Move Right"
          tooltipClassName="-translate-y-9 translate-x-11"
        >
          <TriangleIcon className="rotate-90 size-3" />
        </RelativeMoveButton>
        <RelativeMoveButton
          direction={Actions.DOWN | Actions.LEFT}
          shortcuts={[[metaKey, "Shift", "1"]]}
          shortcutsDisabled={shortcutsDisabled}
          tooltipClassName="-translate-y-20"
          helpText="Move Diagonally Down-Left"
        >
          <TriangleIcon className="rotate-[-135deg] size-3" />
        </RelativeMoveButton>
        <RelativeMoveButton
          direction={Actions.DOWN}
          shortcuts={[
            [metaKey, "Shift", "2"],
            [metaKey, "Shift", "ArrowDown"],
          ]}
          shortcutsDisabled={shortcutsDisabled}
          tooltipClassName="-translate-y-20  -translate-x-14"
          helpText="Move Down"
        >
          <TriangleIcon className="rotate-180 size-3" />
        </RelativeMoveButton>
        <RelativeMoveButton
          direction={Actions.DOWN | Actions.RIGHT}
          shortcuts={[[metaKey, "Shift", "3"]]}
          shortcutsDisabled={shortcutsDisabled}
          tooltipClassName="-translate-y-9 translate-x-11"
          helpText="Move Diagonally Down-Right"
        >
          <TriangleIcon className="rotate-[135deg] size-3" />
        </RelativeMoveButton>
      </>
    ),
    zoom: (
      <>
        <RelativeMoveButton
          direction={Actions.ZOOM_IN}
          shortcuts={[[metaKey, "I"]]}
          shortcutsDisabled={shortcutsDisabled}
          tooltipClassName="tooltip-left translate-y-2 translate-x-1"
          helpText="Zoom In"
        >
          <ZoomInIcon className="size-3" />
        </RelativeMoveButton>
        <RelativeMoveButton
          direction={Actions.ZOOM_OUT}
          shortcuts={[[metaKey, "O"]]}
          shortcutsDisabled={shortcutsDisabled}
          tooltipClassName="tooltip-left translate-y-2 translate-x-1"
          helpText="Zoom Out"
        >
          <ZoomOutIcon className="size-3" />
        </RelativeMoveButton>
      </>
    ),

    reset: (
      <FeedButton
        onTrigger={resetStream}
        shortcuts={[["Shift", "R"]]}
        shortcutsDisabled={shortcutsDisabled}
        tooltipClassName="tooltip-left translate-y-2 translate-x-1"
        helpText="Reset"
      >
        <ResetIcon className="size-3" />
      </FeedButton>
    ),
    // fullscreen: (
    //   <FeedButton
    //     onTrigger={() => props.setFullscreen(!props.isFullscreen)}
    //     shortcuts={[["Shift", "F"]]}
    //     shortcutsDisabled={shortcutsDisabled}
    //     helpText={props.isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
    //     tooltipClassName="tooltip-left translate-y-2 translate-x-1"
    //   >
    //     <CareIcon
    //       icon={
    //         props.isFullscreen ? "l-compress-arrows" : "l-expand-arrows-alt"
    //       }
    //     />
    //   </FeedButton>
    // ),
  };

  if (props.inlineView) {
    return (
      <div className="text-white opacity-0 transition-all delay-100 duration-200 ease-in-out group-hover:opacity-100 group-hover:delay-0">
        <div className="absolute bottom-4 left-4 transition-all delay-100 duration-200 ease-in-out group-hover:bottom-5 group-hover:delay-0">
          <div className="grid grid-cols-3 gap-1">{controls.position}</div>
        </div>
        <div className="absolute bottom-4 right-4 transition-all delay-100 duration-200 ease-in-out group-hover:right-8 group-hover:delay-0">
          <div className="flex flex-col items-center justify-center gap-1">
            {controls.zoom}
            {controls.reset}
            {/* {controls.fullscreen} */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col gap-2">{controls.zoom}</div>
      <div className="grid grid-cols-3 gap-2">{controls.position}</div>
      <div className="flex flex-col gap-2">
        {controls.reset}
        {/* {controls.fullscreen} */}
      </div>
    </div>
  );
}

const Actions = {
  UP: 1 << 0,
  DOWN: 1 << 1,
  LEFT: 1 << 2,
  RIGHT: 1 << 3,
  ZOOM_IN: 1 << 4,
  ZOOM_OUT: 1 << 5,
} as const;

/**
 * Returns the PTZ payload for the given action
 *
 * Example:
 * ```
 * payload(Actions.TOP | Actions.LEFT);
 * ```
 *
 * @param action An Actions or a combination of Actions
 * @param precision Precision of the PTZ action
 * @returns The PTZ payload
 */
const makePtzPayload = (action: number, precision: number) => {
  let [x, y, zoom] = [0, 0, 0];
  const delta = 0.1 / Math.max(1, precision);

  const _ = (direction: number) => action & direction && delta;

  x -= _(Actions.LEFT);
  x += _(Actions.RIGHT);
  y += _(Actions.UP);
  y -= _(Actions.DOWN);
  zoom += _(Actions.ZOOM_IN);
  zoom -= _(Actions.ZOOM_OUT);

  return { x, y, zoom };
};

export const RelativeMoveButton = ({
  direction,
  shortcuts,
  shortcutsDisabled,
  helpText,
  tooltipClassName,
  children,
}: {
  direction: number;
  shortcuts?: string[][];
  shortcutsDisabled?: boolean;
  helpText: string;
  tooltipClassName?: string;
  children: React.ReactNode;
}) => {
  const { device, ptzPrecision } = useCameraFeed();
  const { mutate: relativeMove, isPending: isMoving } = useMutation({
    mutationFn: mutate(cameraActionApi.relativeMove, {
      pathParams: { cameraId: device.id },
    }),
  });

  return (
    <FeedButton
      className={cn(isMoving && "pointer-events-none cursor-none")}
      onTrigger={() => relativeMove(makePtzPayload(direction, ptzPrecision))}
      shortcutsDisabled={shortcutsDisabled}
      helpText={helpText}
      tooltipClassName={tooltipClassName}
      shortcuts={shortcuts}
    >
      {isMoving ? <Loader2 className="size-4 animate-spin" /> : children}
    </FeedButton>
  );
};
