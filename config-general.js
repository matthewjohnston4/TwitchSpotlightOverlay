/* eslint-disable @typescript-eslint/no-unused-vars */
window.config = {
  commands: {
    spotlight: "!spotlight",
    removingSpotlight: "!spotlightRemove",
  },
  position: {
    horizontal: "right", // one of `left`, `right`, or `middle`
    fillMethod: "downwards", // one of `fromCentre`, `upwards`, or `downwards`
    hMargin: "50px", // horizontal margins of list
    vMargin: "50px", // vertical margins of list
    padding: "30px", // padding on the overlay list
    width: "420px",
  },
  font: {
    baseSize: "24px", // include size unit value, px, rem, or whatever
    titleSize: "28px",
    textAlign: "left", // one of left or right
    family: "'Poppins', sans-serif",
  },
  colors: {
    foreground: "255,255,255", // RGB value
    foregroundOpacity: "1", // Decimal value (to one place) between 0 and 1.0
    background: "11, 88, 230", // RGB value
    backgroundGradient: {
      direction: "45deg",
      stops: [
        {
          color: "230,11,124,0.8",
          stop: 0,
        },
        {
          color: "235, 64, 52,0.8",
          stop: 50,
        },
        {
          color: "11,88,230,0.8",
          stop: 100,
        },
      ],
    },
    backgroundAnimate: true, // Set whether the background gradient is static or animates in a loop
    backgroundAnimateTiming: "30s",
    backgroundOpacity: "0.9", // Decimal value (to one place) between 0 and 1.0
  },
  style: {
    rounded: 10, // px value of rounded corners
    maxHeight: 40, // percentage of vertical height to limit message list to
  },
  twitchEmotes: true, // set to false to leave emote text as text
  sounds: {
    activate: "assets/sounds/addition.wav",
    newMessage: "assets/sounds/addition.wav",
  },
};
