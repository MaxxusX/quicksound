# quicksound
easy to use, open source soundboard

created by maxxus

## TODO
- [ ] PWA Support
- [ ] Menu for Managing Soundpacks (adding & removing, resetting to default, list of good soundpacks)
- [ ] Caching
- [ ] Don't Redownload The Same Sound Every Time It Plays
- [ ] SEO
- [ ] Make Better Default Soundpack
- [ ] Make Default Soundpack Removeable
- [ ] Setting to Adjust Volume of Sounds
- [ ] Show Volume Warning on Loud Sounds (not automatic; set by creator of soundpack)

## soundpacks
you can create "soundpacks", which allow you to add your own sounds to the soundboard.

### format
```json
{
  "packname": "example pack",
  "sounds": {
    "example sound 1": {
      "bg": "https://example.com/amogus.png",
      "sound": "https://example.com/sus.wav"
    },
    "example sound 2": {
      "sound": "data:audio/mpeg,data"
    }
  }
}
```
* **REQUIRED** must be a **JSON** file, hosted on a **URL** with protocol of `https:`, `data:`, or `blob:`.
* **REQUIRED** url protocols must be `https:`, `data:`, or `blob:`.
* **REQUIRED** packname and sound names are limited to 36 characters.
* bg must be **png**, **jpg**, **webp**, or other formats supported by `background-image`. *, recommended size is 100x100.
* sound must be **mp3**, **wav**, **ogg**, or other formats supported by `Audio()`.
