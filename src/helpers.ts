import { ChatUserstate } from "tmi.js";
import { Item } from "./app";

export const maybePlaySound = (sound: string) => {
  if (sound !== "") {
      new Audio(sound).play().catch(() => {
        console.log("Couldn't play sound");
      });
  }
};

export const isMod = (context: ChatUserstate) => {
  return context.mod;
};

export const isBroadcaster = (context: ChatUserstate) => {
  return (
    context["badges-raw"] != null &&
    context["badges-raw"].startsWith("broadcaster")
  );
};

export const maybeGetFromStorage = (key: string, defaultValue: string | boolean | Item[]) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}
