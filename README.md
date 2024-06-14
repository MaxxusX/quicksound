# quicksound
easy to use, open source soundboard

created by maxxus

![Build Status](https://github.com/MaxxusX/quicksound/actions/workflows/static.yml/badge.svg)
![CodeQL](https://github.com/MaxxusX/quicksound/actions/workflows/codeql.yml/badge.svg)

## TODO
- [ ] Add "author" Value to Soundpacks (creator(s) of soundpack)
- [ ] Add "description" Value to Soundpacks (description of soundpack)
- [ ] Add "homepage" Value to Soundpacks (link to soundpack repo/homepage)
- [ ] Soundpack Versioning System for Future Overhauls and Breaking Changes
- [ ] Warn Users When Adding Soundpack Not Hosted On This Repository (ppl can request to have their soundpacks hosted!)
- [ ] Setting to Adjust Volume of Sounds
- [ ] Show Volume Warning on Loud Sounds (not automatic - set by creator of soundpack)
- [ ] Show NSFW Warning on NSFW Sounds (not automatic - set by creator of soundpack; can be hidden via setting)
- [ ] Menu for Managing Soundpacks (adding & removing, resetting to default, list of hosted soundpacks)
- [ ] Make Default Soundpack Removeable
- [ ] SEO
- [ ] Caching
- [ ] Don't Redownload The Same Sound Every Time It Plays
- [ ] Make Better Default Soundpack
- [ ] PWA Support

## soundpacks
you can create "soundpacks", which allow you to add your own sounds to the soundboard.

### format
```json
{
  "packname": "example pack", // REQUIRED
  "sounds": { // REQUIRED, MUST HAVE AT LEAST 1 SOUND
    "example sound 1": {
      "bg": "https://example.com/amogus.png", // OPTIONAL
      "sound": "https://example.com/sus.wav" // REQUIRED
    },
    "example sound 2": {
      "sound": "data:audio/mpeg,data"
    }
  }
}
```
* must be a **JSON** file, hosted on a **URL** with protocol of `https:`, `data:`, or `blob:`.
* url protocols **must** be `https:`, `data:`, or `blob:`.
* `packname` and sound names are capped at **36** characters.
* bg must be **png**, **jpg**, **webp**, or other formats supported by `background-image`, recommended size is **100x100** pixels.
* sound must be **mp3**, **wav**, **ogg**, or other formats supported by `Audio()`.
