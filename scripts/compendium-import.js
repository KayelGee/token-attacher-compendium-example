(async () => {
	//This has to be the name field from your module.json
	const moduleName = "token-attacher-compendium-example";
	//This should correlate to the title field from your module.json so the user knows from where the compendium is
	const moduleLabel = "Compendium Example";
	//This should contain all your json compendiums
	const compendiumList =[
		"import_packs/test-ta.json",
		"import_packs/test-ta2.json"
	]
	//This should be the system in which you created the original compendium, in case you want to distribute that aswell in your module otherwise make it blank
	const igonreSystem = "dnd5e";
	//This should be the first part of your localization stringIds in the localization files in .\languages\ 
	const moduleLocalizationScope = "TOKENATTACHEREXAMPLECOMPENDIUM";

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Nothing past this point needs to be changed, in theory at least
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

	const templatePath = `/modules/${moduleName}/templates`;

	class Settings extends FormApplication {
		static init() {
		game.settings.registerMenu(moduleName, 'menu', {
			name: '',
			label: `${moduleLabel} GM Menu`,
			type: Settings,
			restricted: true
		  });
		}
	
		static get defaultOptions() {
			return {
				...super.defaultOptions,
				template: `${templatePath}/settings.html`,
				height: "auto",
				title: `${moduleLabel} GM Menu`,
				width: 600,
				classes: ["settings"],
				tabs: [ 
					{
						navSelector: '.tabs',
						contentSelector: 'form',
						initial: 'info'
					} 
				],
				submitOnClose: false
			}
		}
	
	
		constructor(object = {}, options) {
			super(object, options);
		}
	
		_getHeaderButtons() {
			return super._getHeaderButtons();
		}
	
	
		getData() {
			return  super.getData();
		}
	
		activateListeners(html) {
			let force_reimport=html.find(".force-reimport");
			let force_update=html.find(".force-update");

			force_reimport.click(()=>{forceReimport();});
			force_update.click(()=>{forceUpdate();});
		}
	
	}

	//Register settings
	Hooks.on("init", () => {
		game.settings.register(moduleName, "imported", {
			scope: "world",
			config: false,
			type: Boolean,
			default: false
		});
		game.settings.register(moduleName, "module-version", {
			scope: "world",
			config: false,
			type: String,
			default: ""
		});
		
		Settings.init();
	})

	//Hook into Token Attacher
	Hooks.once("token-attacher.macroAPILoaded", () => {
		if(!game.user.isGM) return;
		if(igonreSystem === game.system.id) return;

		if (!game.settings.get(moduleName, "imported") ) {
			Dialog.confirm({
				title: moduleLabel + " Importer",
				content: game.i18n.localize(`${moduleLocalizationScope}.ImportCompendiums`),
				yes: () => StartImport()
			});
		}
		else if(game.settings.get(moduleName, "module-version") !== game.modules.get(moduleName).data.version){
			Dialog.confirm({
				title: moduleLabel + " Updater",
				content: game.i18n.localize(`${moduleLocalizationScope}.UpdateModule`),
				yes: () => StartUpdate()
			});
		}
	});

	/**
	 * Import all compendiums
	 */
	async function StartImport() {
		for (let i = 0; i < compendiumList.length; i++) {
			const json = await fetch(`modules/${moduleName}/${compendiumList[i]}`, {
                headers: {'Content-Type': 'application/json'}
              });
			await tokenAttacher.importFromJSON(await json.text(), {module:moduleName, "module-label":moduleLabel});			
		}
		await game.settings.set(moduleName, "imported", true);
		return game.settings.set(moduleName, "module-version", game.modules.get(moduleName).data.version);
	}

	/**
	 * Delete old compendiums before importing all compendiums
	 */
	async function StartUpdate() {
		for (let i = 0; i < compendiumList.length; i++) {
			const json = await fetch(`modules/${moduleName}/${compendiumList[i]}`, {
                headers: {'Content-Type': 'application/json'}
              });
			const parsed = JSON.parse(await json.text());
			if(parsed.hasOwnProperty("compendium")){
				const pack = await game.packs.get(`world.${moduleName}.${parsed.compendium.name}`);
				if(pack){
					await pack.delete();
				}
			}
		}
		return StartImport();
	}

	async function forceReimport(){
		await game.settings.set(moduleName, "imported", false);
		await game.settings.set(moduleName, "module-version", game.modules.get(moduleName).data.version - 1);
		return ui.notifications.info("Delete old compendiums and refresh the page wtih F5!");

	}

	async function forceUpdate(){
		await game.settings.set(moduleName, "module-version", game.modules.get(moduleName).data.version - 1);
		return ui.notifications.info("Refresh the page wtih F5!");		
	}
})();