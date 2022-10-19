'use strict';

(async () => {
	const topLevelUrl = import.meta.url + '/../..';
	const moduleFetch = await fetch(topLevelUrl+ '/module.json');
	const moduleJSON = await moduleFetch.json();

	const moduleName = moduleJSON.name ?? moduleJSON.id;
	const moduleLabel = moduleJSON.title;
	const compendiumList = moduleJSON.packs.filter(p => {
		return p.entity === "Actor";
	});
	for (let i = 0; i < compendiumList.length; i++) {
		const compendium = compendiumList[i];
		let path = compendium.path.split('.');
		path[path.length-1] = "json";
		compendium.path = path.join('.');
	}

	const ignoreSystem = compendiumList[0].system;
	
	const langFetch = await fetch(topLevelUrl+ '/languages/en.json');
	const enJSON = await langFetch.json();
	const moduleLocalizationScope = Object.keys(enJSON)[0].split('.')[0];

	const templatePath = (new URL(`${topLevelUrl}/templates`)).pathname;

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

	//Hook into Token Attacher
	Hooks.once("token-attacher.macroAPILoaded", () => {
		if(!game.user.isGM) return;
		if(ignoreSystem === game.system.id) return;

		//Register settings
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

		if (!game.settings.get(moduleName, "imported") ) {
			Dialog.confirm({
				title: moduleLabel + " Importer",
				content: game.i18n.localize(`${moduleLocalizationScope}.ImportCompendiums`),
				yes: () => StartImport()
			});
		}
		else if(game.settings.get(moduleName, "module-version") !== game.modules.get(moduleName).version){
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
			const json = await fetch(`${topLevelUrl}${compendiumList[i].path}`, {
                headers: {'Content-Type': 'application/json'}
              });
			await tokenAttacher.importFromJSON(await json.text(), {module:moduleName, "module-label":moduleLabel});			
		}
		await game.settings.set(moduleName, "imported", true);
		return game.settings.set(moduleName, "module-version", game.modules.get(moduleName).version);
	}

	/**
	 * Delete old compendiums before importing all compendiums
	 */
	async function StartUpdate() {
		for (let i = 0; i < compendiumList.length; i++) {
			const json = await fetch(`${topLevelUrl}${compendiumList[i].path}`, {
                headers: {'Content-Type': 'application/json'}
              });
			const parsed = JSON.parse(await json.text());
			if(parsed.hasOwnProperty("compendium")){
				const pack = await game.packs.get(`world.` + (`${moduleName}-${parsed.compendium.name}`).slugify({strict: true}));
				if(pack){
					await pack.configure({locked: false});
					await pack.deleteCompendium();
				}
			}
		}
		return StartImport();
	}

	async function forceReimport(){
		await game.settings.set(moduleName, "imported", false);
		await game.settings.set(moduleName, "module-version", game.modules.get(moduleName).version - 1);
		return ui.notifications.info(game.i18n.localize(`${moduleLocalizationScope}.DeleteOld`),);

	}

	async function forceUpdate(){
		await game.settings.set(moduleName, "module-version", game.modules.get(moduleName).version - 1);
		return ui.notifications.info(game.i18n.localize(`${moduleLocalizationScope}.Refresh`),);		
	}
})();