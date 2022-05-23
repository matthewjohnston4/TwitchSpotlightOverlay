/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { render } from "react-dom";
import tmi, { ChatUserstate } from "tmi.js";
import {
  maybeGetFromStorage,
  maybePlaySound,
  isMod,
  isBroadcaster,
} from "./helpers";
import { Property } from "csstype";
import { reverse } from "dns/promises";

export interface Item {
  text: string;
  complete: boolean;
}

interface Emotes {
  [emoteid: string]: string[];
}

interface SecurityFunc {
  (context: ChatUserstate, _textContent: string): boolean;
}

interface ActionFunc {
  (context: ChatUserstate, _textContent: string): string | null;
}

interface BackgroundStop {
  color: string;
  stop: number;
}

const App = () => {
  // Create a client with our channel from the configLocal file
  const configLocalLoad = (window as any).configLocal;
  const configLoad = (window as any).config;
  const opts: tmi.Options = {
    channels: [configLocalLoad.twitchUser],
  };
  if (
    configLocalLoad.botUsername &&
    configLocalLoad.password &&
    configLocalLoad.botUsername !== "" &&
    configLocalLoad.password !== ""
  ) {
    opts["identity"] = {
      username: configLocalLoad.botUsername,
      password: configLocalLoad.password,
    };
  }
  const client = new tmi.client(opts);

  const [connected, setConnected] = React.useState(false);
  const [active, setActive] = React.useState(
    maybeGetFromStorage("overlaySpotlightActive", false) as boolean
  );

  const [spotlightUser, setSpotlightUser] = React.useState(
    maybeGetFromStorage("overlaySpotlightUser", "") as string
  );

  const [messages, setMessages] = React.useState(
    maybeGetFromStorage("overlaySpotlightMessages", []) as string[]
  );

  const stateRef = useRef<string>();
  stateRef.current = spotlightUser;

  const formatText = useCallback(
    (message: string, emotes: Emotes | undefined, makeUpperCase = false) => {
      // parse the message for html and remove any tags
      if (makeUpperCase) {
        message = message.toUpperCase();
      }
      const newMessage = Array.from(message);
      // replace any twitch emotes in the message with img tags for those emotes
      if (configLoad.twitchEmotes && emotes) {
        for (const emoteKey in emotes) {
          const emotePositions = emotes[emoteKey];
          emotePositions.forEach((emotePosition) => {
            const start = parseInt(emotePosition.split("-")[0]);
            const end = parseInt(emotePosition.split("-")[1]);
            for (let i = start; i <= end; ++i) {
              newMessage[i] = "";
            }
            newMessage[
              start
            ] = `<img class="emoticon" src="https://static-cdn.jtvnw.net/emoticons/v1/${emoteKey}/3.0"/>`;
          });
        }
      }
      return newMessage.join("");
    },
    [configLoad.twitchEmotes]
  );

  const onMessage = useCallback((
    _target: string,
    context: ChatUserstate,
    msg: string,
    _self: boolean
  ) => {
    const config = configLoad;
    if (context) {
      let modSpotlightAction = false;
      if (isMod(context) || isBroadcaster(context)) {
        // Remove whitespace from chat message
        const command = msg.trim();
        const handlerName = command.split(" ")[0];

        // Check for the command to spotlight someone
        // !spotlight @username
        if (handlerName === config.commands.spotlight) {
          const username = command.split(" ")[1].split("@")[1];
          if (username) {
            setActive(true);
            setSpotlightUser(user => { return username });
            setMessages([]);
          }
          modSpotlightAction = true;
        }
        // Command to remove spotlight
        if (handlerName === config.commands.removingSpotlight) {
          setSpotlightUser(user => { return '' });
          setActive(false);
          setMessages([]);
          modSpotlightAction = true;
        }
      }

      console.log(stateRef);

      // Check for messages by someone who is spotlit
      if (
        stateRef.current &&
        context.username === stateRef.current.toLowerCase() &&
        !modSpotlightAction
      ) {
        console.log("Spotlight user spoke");
        const formattedText = formatText(msg, context.emotes);
        if (formattedText) {
          setMessages((messages) => {
            return [...messages, formattedText];
          });
        }
      }
    }
  }, [configLoad, formatText, stateRef]);

  // Register our event handlers
  client.on("message", onMessage);
  client.on("connected", (addr: string, port: number) => {
    setConnected(true);
    console.log(`* Connected to ${addr}:${port}`);
  });
  client.on("disconnected", () => {
    setConnected(false);
    console.log(`* Disconnected from TMI`);
  });

  useEffect(() => {
    // Connect to Twitch:
    if (!connected) {
      client.connect();
    }
  });

  // Called when 'active' changes
  useEffect(() => {
    localStorage.setItem("overlaySpotlightActive", JSON.stringify(active));
  }, [active]);

  // Called when 'messages' changes
  useEffect(() => {
    localStorage.setItem("overlaySpotlightMessages", JSON.stringify(messages));
  }, [messages]);

  // Called when 'spotlightUser' changes
  useEffect(() => {
    localStorage.setItem("overlaySpotlightUser", JSON.stringify(spotlightUser));
  }, [spotlightUser]);

  let bgColor = `rgba(${configLoad.colors.background}, ${configLoad.colors.backgroundOpacity})`;

  const bgStops: BackgroundStop[] =
    configLoad.colors.backgroundGradient.stops ?? [];
  const bgStopsString: string[] = [];

  if (bgStops.length > 0) {
    bgStops.forEach((stop) => {
      bgStopsString.push(`rgba(${stop.color}) ${stop.stop}%`);
    });
  }

  if (bgStopsString.length > 0) {
    bgColor = `linear-gradient(${configLoad.colors.backgroundGradient.direction ?? "45deg"
      }, ${bgStopsString.join(", ")})`;
  }

  const reverseMessages = [...messages];
  reverseMessages.reverse();

  return (
    <div
      style={{
        animation: configLoad.colors.backgroundAnimate
          ? `backgroundAnimate ${configLoad.colors.backgroundAnimateTiming ?? "10s"
          } ease infinite`
          : "none",
        background: bgColor,
        backgroundSize: configLoad.colors.backgroundAnimate
          ? "400% 400%"
          : "initial",
        borderRadius: `${configLoad.style.rounded ?? 0}px`,
        color: `rgba(${configLoad.colors.foreground}, ${configLoad.colors.foregroundOpacity})`,
        fontFamily: configLoad.font.family,
        fontSize: configLoad.font.baseSize,
        marginBottom: configLoad.position.vMargin,
        marginTop: configLoad.position.vMargin,
        marginLeft: configLoad.position.hMargin,
        marginRight: configLoad.position.hMargin,
        textAlign: configLoad.font.textAlign as Property.TextAlign,
        padding: configLoad.position.padding,
        width: configLoad.position.width,
      }}
      className={`overlaySpotlight__root overlaySpotlight__root--h-${configLoad.position.horizontal
        } overlaySpotlight__root--v-${configLoad.position.fillMethod} ${active ? " overlaySpotlight__root--active" : ""
        }`}
    >
      {/* Use dangerouslySetInnerHTML to allow emotes to work */}
      <h1 style={{ fontSize: configLoad.font.titleSize }}>
        {messages.length > 0 ? `${spotlightUser} says:` : `Please welcome ${spotlightUser} to the stage!`}
      </h1>
      <ol className="overlaySpotlight__messages" style={{ maxHeight: `${configLoad.style.maxHeight}vh` ?? '40vh' }}>
        {reverseMessages.map((message) => (
          <li dangerouslySetInnerHTML={{ __html: message }} key={message} />
        ))}
      </ol>
    </div>
  );
};

render(<App />, document.querySelector(".overlaySpotlight__holder"));
