# FoundryVTT - Token Attacher Auto Import JSON Compendium Example
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/KayelGee/token-attacher-compendium-example?style=for-the-badge) 
![GitHub Releases](https://img.shields.io/github/downloads/KayelGee/token-attacher-compendium-example/latest/total?style=for-the-badge) 
![GitHub All Releases](https://img.shields.io/github/downloads/KayelGee/token-attacher-compendium-example/total?style=for-the-badge&label=Downloads+total)  

**[Compatibility]**: *FoundryVTT* v11+  
**[Systems]**: *any*  
**[Languages]**: *English*  

This Example module has two dnd5e compendiums as regular compendiums and as json files exported through Token Attacher. 
When you open the world it'll ask to import them into the world if the system differs from the regular compendiums.
When the module version changes it'll ask to import the compendiums again, deleteing the pervious ones.

## How to use this for your own module

Download the latest zip of this module.

Update module.json with everything that is necessary for your module.
Put your compediums and JSON exports side by side in the packs folder, they have to be named the same expect that ".db" has to be ".json" for the JSON exported compendiums.

You can change the texts by editing "languages/en.json". When you do that you have to replace "TOKENATTACHEREXAMPLECOMPENDIUM" with some string that identifies your module for all texts.

## V11 Migration

V11 Brings a new database format, so you will need to update the System Agnostic compendium importing.
To do so:

- Replace the contents of your `compendium-import.js` with the [one from this repository](https://github.com/KayelGee/token-attacher-compendium-example/blob/master/scripts/compendium-import.js)
- Move the `.json` files you previously had inside the new folder named as the `name` property of your compendium.
- Make sure the name of your `.json` file matches the name of the folder your are moving the file to. If your `path` property had a different name from the `name` you'll need to rename the `.json` accordingly.

## Contact

If you wish to contact me for any reason, reach me out on Discord using my tag: `KayelGee#5241`
