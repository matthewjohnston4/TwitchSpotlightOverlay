# TwitchSpotlightOverlay

A simple OBS overlay to allow a Twitch channel's broadcaster or mods to spotlight any chat user. The spotlit user's messages then appear in the overlay, with 4 messages shown at any one time, in reverse order.

## Installation

If you want to use this overlay, you'll need OBS or similar and be comfortable editing a settings file for configuration.

1. Download the ZIP archive of [the latest stable release](https://github.com/matthewjohnston4/TwitchSpotlightOverlay/releases) and extract to your local machine or just clone this repo.
2. In the extracted files, rename `config-local.js.sample` to `config-local.js`.
3. Fill in `twitchUser` in `config-local.js` with your Twitch channel username.
4. _Optional_ Fill in `password` and `botUsername` in `config-local.js` to enable chat-based errors for command users (see the comments in `config-local.js.sample` for a longer explanation).
5. Open OBS or whatever you're using, and add `twitchOverlays.html` as a Browser Source. Set `height` and `width` to the same dimensions as the resolution of your stream.
6. _Optional:_ Enable "Shutdown source when not visible" to reload the overlay when you toggle its visibility — this is useful if you're making adjustments to the CSS or color variables.
7. Position the overlay by dragging it to your preferred vertical location within OBS. Check out the `fillDirection` setting below for more on how you can customise how the overlay will expand vertically.

You're done! Now you can test this out by typing `!spotlight <@username>` in your Twitch channel chat.

## Usage

All these subcommands can vary based on the values of `commands` in `config-general.js`:

- **Spotlighting a new user:**
  `!spotlight <@username>` spotlights a new user (you should include the @) and removes any previous spotlight.
- **Deleting and hiding the spotlight:**
  `!spotlightRemove` deletes all content from the overlay, unspotlights the user, and hides the overlay.

## Customising

There are a few common settings to edit in `config-general.js` in order to adjust how the overlay looks and sounds:

- `commands`: The base command names to use. Change these if you need to avoid collisions with other overlays.
- `position`:
  - `horizontal`: Where to put the messages within the entire overlay bounds. One of `left`, `right`, or `middle`. You can also ignore this setting and drag the position of the overlay in OBS, but if you want to quickly flip the messages from one side of the stream to another, this setting will help you do that.
  - `fillMethod`: Determines how the message list will expand as you add messages. You can still position your overlay manually by dragging it in OBS, but the `fillMethod` will ensure your list will expand in the right direction for where you place it.
    - `fromCentre` means the height will expand vertically in equal amounts for each added message.
    - `downwards` means the height will always expand downwards.
    - `upwards` means the height will always expand upwards.
  - `hMargin`: Horizontal margins around the message list (include CSS units). Margins are useful if you want to snap the overlay, but still have a gap from the edge of your stream video.
  - `vMargin`: Vertical margins around message list (include CSS units).
  - `padding`: Padding inside the message list, around the content (include CSS units).
  - `width`: Width that the message list should fill within the overlay bounds. Can be a static value like `400px` or a proportional one like `25vw`.
- `font`:
  - `baseSize`: Base font size. Include a CSS unit.
  - `titleSize`: Title font size. Include a CSS unit.
  - `textAlign`: One of `left` or `right`
  - `family`: A valid font-family string.
- `colors`:
  - `foreground`: RGB value of the text and line colors within the message list.
  - `foregroundOpacity`: Decimal value (to one place) between 0 and 1.0 of the opacity of the text.
  - `background`: RGB value of the background of the message list.
  - `backgroundOpacity`: Decimal value (to one place) between 0 and 1.0 of the opacity of the background of the message list.
- `style`:
  - `rounded`: Set a px value for rounded corners of the overlay
- `twitchEmotes`: Set to false to leave emote text as text, true to try and convert it to an image (GIFs do not work).
- `sounds`: **Not yet used**. All sound options can be left as a blank string (`""`) if you don't want any sounds to play.
  - `activate`: Sound that plays when the message list is shown.
  - `newItem`: Sound that plays when a new message is posted by the spotlit user.

You can also replace the sound files in `assets/sounds` with your own files to customise the alert sounds.

### Custom CSS

If you want to customise further, please add a file in `assets/styles_extra.css` and add CSS rules to it. This file is included in the `.gitignore`, so it will not be overwritten when you want to upgrade your version of the overlay.

## Upgrading

To upgrade, you can backup your `styles_extra.css`, `config-general.js`, and `config-local.js` files, delete the overlay directory, and then re-download. Copy relevant configuration settings back in again afterwards. And make sure OBS has refreshed your updates.

After you have updated, I recommend testing the overlay a while yourself, and make sure that it all works as expected. I run a bunch of manual tests before putting up new versions of the overlay, but can't give it quite as much of a test as a live stream will provide.

## Reporting feedback or bugs

Please use the ["Issues" tab](https://github.com/matthewjohnston4/TwitchListOverlay/issues) here on Github to report any problems or ideas you might have for the overlay.

## Credits

This project was originally based on the great [TwitchPopups project](https://github.com/DaftLimmy/TwitchPopups). If you like this one, check that one out too.

No need to credit me (a shoutout to twitch.tv/matthewindublin would be very nice of you if you feel like it) but if you want to chuck me a donation, [go to my Ko-fi](https://ko-fi.com/matthewathome).

Included sounds used under Creative Commons license from https://freesound.org/people/rhodesmas/

---

## Preprocessing after making code changes

After you've made changes to any `src/*` files, you'll need to re-preprocess them into compatible browser JavaScript using Webpack and Babel. It's pretty simple, if you have Node (v12.13.0 was used to create this) and NPM (v6.13.4) installed:

1. Run `npm i` from the project root. This will install a whole bunch of development pre-requisites, including Webpack, Babel, and some other plugins for those. You shouldn't need to configure anything, however.
2. Run `npm run build`. This will run the TypeScript typechecker and an ESLint linter.

You can also use `npm run watch` which will launch an auto-watcher which will look for changes in `src/` and process them into `bin/` where `twitchOverlays.htm` expects them to be.
