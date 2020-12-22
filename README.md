# FoundryVTT - Token Attacher Auto Import JSON Compendium Example
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/KayelGee/token-attacher-compendium-example?style=for-the-badge) 
![GitHub Releases](https://img.shields.io/github/downloads/KayelGee/token-attacher-compendium-example/latest/total?style=for-the-badge) 
![GitHub All Releases](https://img.shields.io/github/downloads/KayelGee/token-attacher-compendium-example/total?style=for-the-badge&label=Downloads+total)  

**[Compatibility]**: *FoundryVTT* 0.7.0+  
**[Systems]**: *any*  
**[Languages]**: *English*  

This Example module has two compendiums in the form of json files exported through Token Attacher. 
When you open the compendium tab it'll ask to import them into the world independent of the current system.
When the module version changes it'll ask to import the compendiums again, deleteing the pervious ones.

## How to use this for your own module

Clone this module.

Update module.json with everything that is necessary for your module.

Update './scripts/compendium-import.js' all important varaiables are at the top:

	-moduleName: has to be equal to the 'name' field in module.json.
	-moduleLabel: should identify your module somehow as all compendiums will have that label in their name.
	-compendiumList: should point to all your json files that you created by exporting a compendium through token-attacher.
	-moduleLocalizationScope: Should you change any text in a localization file then you should change this and replace the placeholder in each localization file.

## Contact

If you wish to contact me for any reason, reach me out on Discord using my tag: `KayelGee#5241`
