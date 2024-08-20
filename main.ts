import { App, Platform, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, FileManager, TFile, MarkdownSourceView, Workspace, addIcon } from 'obsidian';
import { FolderSuggest, FileSuggest } from 'suggesters/suggestor';


interface MdAnnotationsPluginSettings {
	annotationsFile: string;
	turnOnExtraQuotes: boolean;
	turnOnExtraHighlights: boolean;
	dailyDateFormat: string;
	dailyFolder: string;
	dailyTemplate: string;
	specialFileFolder: string;
	specialFileName: string;
	specialFileTemplate: string;
	tabToOpenFile: string,
	quoteColor_1: string;
	quoteColor_2: string;
	quoteColor_3: string;
	quoteColor_4: string;
	quoteColorRgb_1: any;
	quoteColorRgb_2: any;
	quoteColorRgb_3: any;
	quoteColorRgb_4: any;
}

const DEFAULT_SETTINGS: MdAnnotationsPluginSettings = {
	annotationsFile: "daily",
	turnOnExtraQuotes: false,
	turnOnExtraHighlights: false,
	dailyDateFormat: "YYYY-MM-DD",
	dailyFolder: "",
	dailyTemplate: "",
	specialFileFolder: "",
	specialFileName: "",
	specialFileTemplate: "",
	tabToOpenFile: "right split",
	quoteColor_1: "#cf864a",
	quoteColor_2: "#877db5",
	quoteColor_3: "#8aac6c",
	quoteColor_4: "#c25757",
	quoteColorRgb_1: "207, 134, 74",
	quoteColorRgb_2: "135, 125, 181",
	quoteColorRgb_3: "138, 172, 108",
	quoteColorRgb_4: "194, 87, 87"
}







export default class MdAnnotationsPlugin extends Plugin {
	settings: MdAnnotationsPluginSettings;
	localeStrings: any;
	
	

	async onload() {

		let lang: string = window.localStorage.getItem('language') ?? "en"

		const strings: any = {
			"en": {
				saveQuote1: "Save quote 1",
				saveQuote2: "Save quote 2",
				saveQuote3: "Save quote 3",
				saveQuote4: "Save quote 4",
				saveQuote: "Save quote",
				addComment: "Add commentary",
				selectFile: "Select file to save quotes and annotations",
				daily: "Daily note", 
				special: "Special annotations file for every note", 
				same: "The same note",
				dailyDateFormat: "Date format of the daily note",
				dailyFolder: "Daily notes folder",
				dailyTemplate: "Daily note template",
				specialFolder: "Folder for annotations file",
				specialFolderDesc: "You can use variables {{fileName}} and {{folder}}, to tie folder to the annotated file.",
				specialTitle: "Annotations file title",
				specialTitleDesc: "You can use variables {{fileName}} and {{folder}}, to tie title to the annotated file.",
				specialTemplate: "Annotations file template",
				tabToOpenFile: "Where to open annotations file",
				newTab: "New tab", 
				rightSplit: "Right split",
				turnOnExtraQuotes: "Turn on extra quotes",
				turnOnExtraQuotesDesc: "Add extra commands to command pallete and editor menu to allow you to creale quotes of different colors.",
				turnOnExtraHighlights: "Turn on extra hightlights colors",
				turnOnExtraHighlightsDesc: "If this option is enabled, normal, bold, italic and bold italic highlights will be shown in different colors. Note that it will affect the whole vault.",
				quoteColor1: "Quote 1 color",
				quoteColor1Desc: "The color of the callout for normal quote or quote 1. If you turn on extra hightlights colors it will be also the color of normal highlight.",
				quoteColor2: "Quote 2 color",
				quoteColor2Desc: "The color of the callout for quote 2. If you turn on extra hightlights colors it will be also the color of italic highlight.",
				quoteColor3: "Quote 3 color",
				quoteColor3Desc: "The color of the callout for quote 3. If you turn on extra hightlights colors it will be also the color of bold highlight.",
				quoteColor4: "Quote 4 color",
				quoteColor4Desc: "The color of the callout for quote 4. If you turn on extra hightlights colors it will be also the color of bold italic highlight."
			},
			"ru": {
				saveQuote1: "Сохранить цитату 1",
				saveQuote2: "Сохранить цитату 2",
				saveQuote3: "Сохранить цитату 3",
				saveQuote4: "Сохранить цитату 4",
				saveQuote: "Сохранить цитату",
				addComment: "Добавить комментарий",
				selectFile: "Выберите файл для сохранения цитат и заметок",
				daily: "Ежедневная заметка", 
				special: "Отдельный файл аннотаций для каждой заметки", 
				same: "Тот же самый файл",
				dailyDateFormat: "Формат даты ежедневной заметки",
				dailyFolder: "Папка ежедневной заметки",
				dailyTemplate: "Шаблон ежедневной заметки",
				specialFolder: "Папка файла для аннотаций",
				specialFolderDesc: "Можно использовать переменные {{fileName}} и {{folder}}, чтобы привязать папку к аннотируемому файлу.",
				specialTitle: "Название файла для аннотаций",
				specialTitleDesc: "Можно использовать переменные {{fileName}} и {{folder}}, чтобы привязать название к аннотируемому файлу.",
				specialTemplate: "Шаблон файла для аннотаций",
				tabToOpenFile: "Как открывать файл для аннотаций",
				newTab: "В новой вкладке", 
				rightSplit: "В панели справа",
				turnOnExtraQuotes: "Включить дополнительные виды цитат",
				turnOnExtraQuotesDesc: "Добавляет дополнительные команды в палитру команд и меню редактора, чтобы можно было создавать цитаты разных цветов.",
				turnOnExtraHighlights: "Включить дополнительные цвета для выделения",
				turnOnExtraHighlightsDesc: "Если эта опция включена, нормальные, полужирные, курвивные и полужирные-курсивные выделения будут отображаться разного цвета. Учитывайте, что это затрагивает всё хранилище.",
				quoteColor1: "Цвет цитаты 1",
				quoteColor1Desc: "Цвет коллаута для обычной цитаты или цитаты 1. Если включены дополнительные цвета выделений, это также будет цвет нормального выделения.",
				quoteColor2: "Цвет цитаты 2",
				quoteColor2Desc: "Цвет коллаута для цитаты 2. Если включены дополнительные цвета выделений, это также будет цвет курсивного выделения.",
				quoteColor3: "Цвет цитаты 3",
				quoteColor3Desc: "Цвет коллаута для цитаты 3. Если включены дополнительные цвета выделений, это также будет цвет полужирного выделения.",
				quoteColor4: "Цвет цитаты 4",
				quoteColor4Desc: "Цвет коллаута для цитаты 4. Если включены дополнительные цвета выделений, это также будет цвет полужирного курсивного выделения."
			}
		}

		this.localeStrings = strings[lang] ?? strings["en"]


		await this.loadSettings();

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.toggleHighlightsColors()
		this.setQuoteColors()



		const openAnnotationsFile = async (file: TFile) => {

			let allOpenedViews = this.app.workspace.getLeavesOfType('markdown')

			if(!allOpenedViews.find(leaf => leaf.getViewState().state.file == file.path)) {

				if (Platform.isDesktop && this.settings.tabToOpenFile == "right split") {
					let leaf = this.app.workspace.getLeaf('split', 'vertical')
					await leaf.openFile(file)

				} else {
					let leaf = this.app.workspace.getLeaf(true)
					leaf.openFile(file, {active: false})

				} 
			}
		
		};




		  const getAnnotationsFile = async () => {
		

			let file: TFile | undefined | null = this.app.workspace.activeEditor!.file;

			let fileChoice = this.settings.annotationsFile

			if (fileChoice == "daily") {
	  
				let dailyFolder = this.settings.dailyFolder

				if (dailyFolder.endsWith("/")) dailyFolder = dailyFolder.slice(1)


				let dailyFormat = this.settings.dailyDateFormat

				if (!dailyFormat) dailyFormat = "YYYY-MM-DD"

				let dailyTemplateFile = this.app.vault.getMarkdownFiles().find(f => f.path == this.settings.dailyTemplate)
				let dailyTemplateContent = ""
				if (dailyTemplateFile) {
					dailyTemplateContent = await this.app.vault.cachedRead(dailyTemplateFile)
				}
				
				let today = window.moment().format(dailyFormat)
				let dailyPath = dailyFolder + "/" + today + ".md"

				if (dailyPath.startsWith("/")) dailyPath = dailyPath.replace("/", "")
	
				file = this.app.vault.getMarkdownFiles().find((f) => f.path == dailyPath);

			

				if (!file) {
					if (!this.app.vault.getAbstractFileByPath(dailyFolder) && dailyFolder != "") {
						await this.app.vault.createFolder(dailyFolder)
					}
					//file = await this.app.vault.create(dailyPath, dailyTemplateContent);
					file = await createFile(dailyPath, dailyTemplateContent)
				}

			} else if (fileChoice == "special") {

			

				let folder = this.settings.specialFileFolder.replaceAll("{{fileName}}", file!.basename).replaceAll("{{folder}}", file!.parent!.path)
				if (folder.endsWith("/")) folder = folder.slice(1)
				let fileName = this.settings.specialFileName.replaceAll("{{fileName}}", file!.basename).replaceAll("{{folder}}", file!.parent!.path)
				
				if (fileName == "") {
					fileName = "Annotations"
				}

				let path = folder + "/" + fileName + ".md"
				if (path.startsWith("/")) path = path.replace("/", "")


				let templateFile = this.app.vault.getMarkdownFiles().find(f => f.path == this.settings.specialFileTemplate)
				let templateContent = ""
				if (templateFile) {
					templateContent = await this.app.vault.cachedRead(templateFile)
				}

				file = this.app.vault.getFiles().find((f) => f.path == path);
				if (!file) {


					if (!this.app.vault.getAbstractFileByPath(folder) && folder != "") {						
						await this.app.vault.createFolder(folder)
					}


			

					//file = await this.app.vault.create(path, templateContent);
					file = await createFile(path, templateContent)
				}

			} 


			return file
		  }









		  const generateBlockId = () => {
			return "^" + Math.random().toString(36).slice(2, 8);

		  }


		  const setBlockId = () => {
			let myEditor = this.app.workspace.activeEditor!.editor!
			let line = myEditor.getCursor("to").line
			let blockId = generateBlockId()

			let sections = this.app.metadataCache.getFileCache(this.app.workspace.getActiveFile()!)!.sections

			let block = sections!.find(s => s.position.start.line <= line && s.position.end.line >= line)

			if (block!.id) {
				blockId = "^" + block!.id
			} else {
				myEditor.replaceRange(" " + blockId, {line: block!.position.end.line, ch: block!.position.end.col})
			}

			return blockId
		}


		const setBacklink = (annotationsFile: TFile, blockId2: string, formatting: string) => {

			let link = this.app.fileManager.generateMarkdownLink(annotationsFile, "", "#" + blockId2, "📝")
			let myEditor = this.app.workspace.activeEditor!.editor!
			let cursorStart = myEditor.getCursor("from")
			let cursorEnd = myEditor.getCursor("to")
			let offset = formatting.length
			cursorEnd.ch = cursorEnd.ch + offset
			let selection = myEditor.getSelection();
			myEditor.replaceRange(selection + formatting + " " + link, cursorStart, cursorEnd)

		  }




		const createFile = async (path: string, data: string) => {
			const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
			let file = await this.app.vault.create(path, data);
			await timeout(500)
			return file
		}


		const createCalloutPart = (blockId: string) => {
			let currentFile = this.app.workspace.activeEditor!.file;
			let fileName = currentFile!.basename
			let filePath = currentFile!.path.replace(".md", "")
			let link = "[[" + filePath + "#" + blockId + "|" + fileName + "]]"
			let selection = this.app.workspace.activeEditor!.editor!.getSelection();
			return link + "\n> " + selection.replace(/\n/g, "\n> ")
		}



		  const setHighlight_1 = () => {
			// @ts-ignore
			this.app.workspace.activeEditor.editor.toggleMarkdownFormatting("highlight")
		  }

		  const setHighlight_2 = () => {
			// @ts-ignore
			this.app.workspace.activeEditor.editor.toggleMarkdownFormatting("highlight")
			// @ts-ignore
			this.app.workspace.activeEditor.editor.toggleMarkdownFormatting("italic")

			// @ts-ignore
			let selection = this.app.workspace.activeEditor.editor.getSelection().replaceAll(/==\*([ ]*)\n/mgsi, "*==$1\n").replaceAll(/\n([ ]*)\*==/mgsi, "\n$1==*")
			this.app.workspace.activeEditor!.editor!.replaceSelection(selection)
		  }


		  const setHighlight_3 = () => {
			// @ts-ignore
			this.app.workspace.activeEditor.editor.toggleMarkdownFormatting("highlight")
			// @ts-ignore
			this.app.workspace.activeEditor.editor.toggleMarkdownFormatting("bold")

			// @ts-ignore
			let selection = this.app.workspace.activeEditor.editor.getSelection().replaceAll(/==\*\*([ ]*)\n/mgsi, "**==$1\n").replaceAll(/\n([ ]*)\*\*==/mgsi, "\n$1==**")
			this.app.workspace.activeEditor!.editor!.replaceSelection(selection)
		  }	  

		  const setHighlight_4 = () => {
			// @ts-ignore
			this.app.workspace.activeEditor.editor.toggleMarkdownFormatting("highlight")
			// @ts-ignore
			this.app.workspace.activeEditor.editor.toggleMarkdownFormatting("bold")
			// @ts-ignore
			this.app.workspace.activeEditor.editor.toggleMarkdownFormatting("italic")


			// @ts-ignore
			let selection = this.app.workspace.activeEditor.editor.getSelection().replaceAll(/==\*\*\*([ ]*)\n/mgsi, "***==$1\n").replaceAll(/\n([ ]*)\*\*\*==/mgsi, "\n$1==***")
			this.app.workspace.activeEditor!.editor!.replaceSelection(selection)
		  }
		  
		  


			const saveCalloutToFile_1 = async () => {

			let blockId = setBlockId()
			let calloutPart = createCalloutPart(blockId)
			let annotationsFile = await getAnnotationsFile()

			if (annotationsFile) {
				openAnnotationsFile(annotationsFile)
				let content = await this.app.vault.read(annotationsFile);
				let callout = ">[!quote|quote_1] " + calloutPart
				setHighlight_1()
				await this.app.vault.modify(annotationsFile, content + "\n" + callout + "\n\n");
			}
	
		};







		const saveCalloutToFile_2 = async () => {

			let blockId = setBlockId()
			let calloutPart = createCalloutPart(blockId)
			

			let annotationsFile = await getAnnotationsFile()

			if (annotationsFile) {
			openAnnotationsFile(annotationsFile)
			let content = await this.app.vault.read(annotationsFile);
			
			let callout = ">[!quote|quote_2] " + calloutPart
			setHighlight_2()

			await this.app.vault.modify(annotationsFile, content + "\n" + callout + "\n\n");
			}
		};


		const saveCalloutToFile_3 = async () => {

			let blockId = setBlockId()
			let calloutPart = createCalloutPart(blockId)
			

			let annotationsFile = await getAnnotationsFile()

			if (annotationsFile) {
			openAnnotationsFile(annotationsFile)
			let content = await this.app.vault.read(annotationsFile);
			
			let callout = ">[!quote|quote_3] " + calloutPart
			setHighlight_3()

			await this.app.vault.modify(annotationsFile, content + "\n" + callout + "\n\n");
			}
		};
					
					
		const saveCalloutToFile_4 = async () => {

			let blockId = setBlockId()
			let calloutPart = createCalloutPart(blockId)
			

			let annotationsFile = await getAnnotationsFile()

			if (annotationsFile) {
			openAnnotationsFile(annotationsFile)
			let content = await this.app.vault.read(annotationsFile);
			
			let callout = ">[!quote|quote_4] " + calloutPart
			setHighlight_4()
	
			await this.app.vault.modify(annotationsFile, content + "\n" + callout + "\n\n");
			}
		};	
		
		


		const addComment = async () => {

			let blockId = setBlockId()
			let blockId2 = generateBlockId()
			

			let annotationsFile = await getAnnotationsFile()

			if (annotationsFile) {
			openAnnotationsFile(annotationsFile)
			let content = await this.app.vault.read(annotationsFile);
					
			setBacklink(annotationsFile, blockId2, "")

			let currentFile = this.app.workspace.getActiveFile()

			let link = this.app.fileManager.generateMarkdownLink(currentFile!, "", "#" + blockId, currentFile!.basename)

			await this.app.vault.modify(annotationsFile, content + "\n- 📝 " + link + " " + blockId2 + "\n	- Комментарий\n\n");
			}
		};


	
			

		this.registerEvent(
		this.app.workspace.on("editor-menu", (menu, editor, view) => {

			this.loadSettings()
			
			if (this.settings.turnOnExtraQuotes) {

				addIcon("quote-1", '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>')
				addIcon("quote-2", '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>')
				addIcon("quote-3", '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>')
				addIcon("quote-4", '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>')

				menu.addItem((item) => {
					item.setTitle(this.localeStrings.saveQuote1).setIcon("quote-1").onClick(async () => {
					await saveCalloutToFile_1();
					});
				});

				menu.addItem((item) => {
					item.setTitle(this.localeStrings.saveQuote2).setIcon("quote-2").onClick(async () => {
					await saveCalloutToFile_2();
					});
				});

				menu.addItem((item) => {
					item.setTitle(this.localeStrings.saveQuote3).setIcon("quote-3").onClick(async () => {
					await saveCalloutToFile_3();
					});
				});

				menu.addItem((item) => {
					item.setTitle(this.localeStrings.saveQuote4).setIcon("quote-4").onClick(async () => {
					await saveCalloutToFile_4();
					});
				});

			} else {

				menu.addItem((item) => {
					item.setTitle(this.localeStrings.saveQuote).setIcon("quote").onClick(async () => {
					await saveCalloutToFile_1();
					});
				});

			}

			menu.addItem((item) => {
				item.setTitle(this.localeStrings.addComment).setIcon("message-square-plus").onClick(async () => {
				  await addComment();
				});
			});
		}));














		this.addCommand({
			id: 'save-callout-1',
			name: 'localeStrings.saveQuote1',
			checkCallback: (checking: boolean) => {
				this.loadSettings()
				if (this.settings.turnOnExtraQuotes) {
					if (!checking) {
						saveCalloutToFile_1();
					}
					return true;
				}
			  return false;
			}
		});

		this.addCommand({
			id: 'save-callout-2',
			name: 'localeStrings.saveQuote2',
			checkCallback: (checking: boolean) => {
				this.loadSettings()
				if (this.settings.turnOnExtraQuotes) {
					if (!checking) {
						saveCalloutToFile_2();
					}
					return true;
				}
			  return false;
			}
		});

		this.addCommand({
			id: 'save-callout-3',
			name: 'localeStrings.saveQuote3',
			checkCallback: (checking: boolean) => {
				this.loadSettings()
				if (this.settings.turnOnExtraQuotes) {
					if (!checking) {
						saveCalloutToFile_3();
					}
					return true;
				}
			  return false;
			}
		});

		this.addCommand({
			id: 'save-callout-4',
			name: 'localeStrings.saveQuote4',
			checkCallback: (checking: boolean) => {
				this.loadSettings()
				if (this.settings.turnOnExtraQuotes) {
					if (!checking) {
						saveCalloutToFile_4();
					}
					return true;
				}
			  return false;
			}
		});


		this.addCommand({
			id: 'save-callout',
			name: 'localeStrings.saveQuote',
			checkCallback: (checking: boolean) => {
				this.loadSettings()
				if (!this.settings.turnOnExtraQuotes) {
					if (!checking) {
						saveCalloutToFile_1();
					}
					return true;
				}
			  return false;
			}
		});
		  
  



		this.addCommand({
		id: "add-comment",
		name: "localeStrings.addComment",
		editorCallback: async (editor, view) => {
			await addComment();
		}
		});



	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


	setQuoteColors() {
		let body = document.body
		body.style.setProperty('--quote-color-rgb-1', this.settings.quoteColorRgb_1)
		body.style.setProperty('--quote-color-rgb-2', this.settings.quoteColorRgb_2)
		body.style.setProperty('--quote-color-rgb-3', this.settings.quoteColorRgb_3)
		body.style.setProperty('--quote-color-rgb-4', this.settings.quoteColorRgb_4)
	}

	toggleHighlightsColors() {
		let classList = document.body.classList
		if (this.settings.turnOnExtraHighlights && !classList.contains("extra-highlights-colors")) {
			classList.add("extra-highlights-colors")
		} else if (!this.settings.turnOnExtraHighlights && classList.contains("extra-highlights-colors")) {
			classList.remove("extra-highlights-colors")
		}
	}

}




class SampleSettingTab extends PluginSettingTab {
	plugin: MdAnnotationsPlugin;

	constructor(app: App, plugin: MdAnnotationsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName(this.plugin.localeStrings.selectFile)
			.addDropdown(dropdown => dropdown
				.addOptions({
					"daily": this.plugin.localeStrings.daily, 
					"special": this.plugin.localeStrings.special, 
					"same": this.plugin.localeStrings.same
				})
				.setValue(this.plugin.settings.annotationsFile)
				.onChange(async (value) => {
					this.plugin.settings.annotationsFile = value;
					await this.plugin.saveSettings();
					this.display();
				})
			);

		if (this.plugin.settings.annotationsFile == "daily") {

			new Setting(containerEl)
			.setName(this.plugin.localeStrings.dailyDateFormat)
			.addText(text => text
				.setPlaceholder('YYYY-MM-DD')
				.setValue(this.plugin.settings.dailyDateFormat)
				.onChange(async (value) => {
					this.plugin.settings.dailyDateFormat = value;
					await this.plugin.saveSettings();
				}));

			new Setting(containerEl)
			.setName(this.plugin.localeStrings.dailyFolder)
			.addSearch(search => {
				new FolderSuggest(search.inputEl, this.app);
				search				
				.setPlaceholder('')
				.setValue(this.plugin.settings.dailyFolder)
				.onChange(async (value) => {
					this.plugin.settings.dailyFolder = value;
					await this.plugin.saveSettings();
				})
			});


			new Setting(containerEl)
			.setName(this.plugin.localeStrings.dailyTemplate)
			.addSearch(search => {
				new FileSuggest(search.inputEl, this.app);
				search				
				.setPlaceholder('')
				.setValue(this.plugin.settings.dailyTemplate)
				.onChange(async (value) => {
					this.plugin.settings.dailyTemplate = value;
					await this.plugin.saveSettings();
				})
			});
		}


		

		if (this.plugin.settings.annotationsFile == "special") {

			new Setting(containerEl)
			.setName(this.plugin.localeStrings.specialFolder)
			.setDesc(this.plugin.localeStrings.specialFolderDesc)
			.addText(text => text
				.setPlaceholder('')
				.setValue(this.plugin.settings.specialFileFolder)
				.onChange(async (value) => {
					this.plugin.settings.specialFileFolder = value;
					await this.plugin.saveSettings();
				}));


			new Setting(containerEl)
			.setName(this.plugin.localeStrings.specialTitle)
			.setDesc(this.plugin.localeStrings.specialTitleDesc)
			.addText(text => text
				.setPlaceholder('')
				.setValue(this.plugin.settings.specialFileName)
				.onChange(async (value) => {
					this.plugin.settings.specialFileName = value;
					await this.plugin.saveSettings();
				}));

				



			new Setting(containerEl)
			.setName(this.plugin.localeStrings.specialTemplate)
			.addSearch(search => {
				new FileSuggest(search.inputEl, this.app);
				search				
				.setPlaceholder('')
				.setValue(this.plugin.settings.specialFileTemplate)
				.onChange(async (value) => {
					this.plugin.settings.specialFileTemplate = value;
					await this.plugin.saveSettings();
				})
			});
			


		}




		new Setting(containerEl)
		.setName(this.plugin.localeStrings.tabToOpenFile)
		.addDropdown(dropdown => dropdown
			.addOptions({
				"new tab": this.plugin.localeStrings.newTab, 
				"right split": this.plugin.localeStrings.rightSplit
			})
			.setValue(this.plugin.settings.tabToOpenFile)
			.onChange(async (value) => {
				this.plugin.settings.tabToOpenFile = value;
				await this.plugin.saveSettings();
				this.display();
			})
		);














			new Setting(containerEl)
			.setName(this.plugin.localeStrings.turnOnExtraQuotes)
			.setDesc(this.plugin.localeStrings.turnOnExtraQuotesDesc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.turnOnExtraQuotes)
				.onChange(async (value) => {
					this.plugin.settings.turnOnExtraQuotes = value;
					await this.plugin.saveSettings();
					this.display();
				})
			)


			new Setting(containerEl)
			.setName(this.plugin.localeStrings.turnOnExtraHighlights)
			.setDesc(this.plugin.localeStrings.turnOnExtraHighlightsDesc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.turnOnExtraHighlights)
				.onChange(async (value) => {
					this.plugin.settings.turnOnExtraHighlights = value;
					await this.plugin.saveSettings();
					this.display();
					this.plugin.toggleHighlightsColors()
				})
			)


			if (this.plugin.settings.turnOnExtraQuotes || this.plugin.settings.turnOnExtraHighlights) {

				new Setting(containerEl)
				.setName(this.plugin.localeStrings.quoteColor1)
				.setDesc(this.plugin.localeStrings.quoteColor1Desc)
				.addColorPicker(color => color
					.setValue(this.plugin.settings.quoteColor_1)
					.onChange(async (value) => {
						this.plugin.settings.quoteColor_1 = value;
						let rgb = color.getValueRgb()
						let rgbString = rgb.r + ", " + rgb.g + ", " + rgb.b
						this.plugin.settings.quoteColorRgb_1 = rgbString;
						await this.plugin.saveSettings();
						this.plugin.setQuoteColors()
					})
				)
				.addButton(button => button
					.setIcon("rotate-ccw")
					.setClass("clickable-icon")
					.onClick(async () => {
						this.plugin.settings.quoteColor_1 = DEFAULT_SETTINGS.quoteColor_1
						this.plugin.settings.quoteColorRgb_1 = DEFAULT_SETTINGS.quoteColorRgb_1
						await this.plugin.saveSettings();
						this.display()
						this.plugin.setQuoteColors()
					})
				)




				new Setting(containerEl)
				.setName(this.plugin.localeStrings.quoteColor2)
				.setDesc(this.plugin.localeStrings.quoteColor2Desc)
				.addColorPicker(color => color
					.setValue(this.plugin.settings.quoteColor_2)
					.onChange(async (value) => {
						this.plugin.settings.quoteColor_2 = value;
						let rgb = color.getValueRgb()
						let rgbString = rgb.r + ", " + rgb.g + ", " + rgb.b
						this.plugin.settings.quoteColorRgb_2 = rgbString;
						await this.plugin.saveSettings();
						this.plugin.setQuoteColors()
					})
				)
				.addButton(button => button
					.setIcon("rotate-ccw")
					.setClass("clickable-icon")
					.onClick(async () => {
						this.plugin.settings.quoteColor_2 = DEFAULT_SETTINGS.quoteColor_2
						this.plugin.settings.quoteColorRgb_2 = DEFAULT_SETTINGS.quoteColorRgb_2
						await this.plugin.saveSettings();
						this.display()
						this.plugin.setQuoteColors()
					})
				)




				new Setting(containerEl)
				.setName(this.plugin.localeStrings.quoteColor3)
				.setDesc(this.plugin.localeStrings.quoteColor3Desc)
				.addColorPicker(color => color
					.setValue(this.plugin.settings.quoteColor_3)
					.onChange(async (value) => {
						this.plugin.settings.quoteColor_3 = value;
						let rgb = color.getValueRgb()
						let rgbString = rgb.r + ", " + rgb.g + ", " + rgb.b
						this.plugin.settings.quoteColorRgb_3 = rgbString;
						await this.plugin.saveSettings();
						this.plugin.setQuoteColors()
					})
				)
				.addButton(button => button
					.setIcon("rotate-ccw")
					.setClass("clickable-icon")
					.onClick(async () => {
						this.plugin.settings.quoteColor_3 = DEFAULT_SETTINGS.quoteColor_3
						this.plugin.settings.quoteColorRgb_3 = DEFAULT_SETTINGS.quoteColorRgb_3
						await this.plugin.saveSettings();
						this.display()
						this.plugin.setQuoteColors()
					})
				)




				new Setting(containerEl)
				.setName(this.plugin.localeStrings.quoteColor4)
				.setDesc(this.plugin.localeStrings.quoteColor4Desc)
				.addColorPicker(color => color
					.setValue(this.plugin.settings.quoteColor_4)
					.onChange(async (value) => {
						this.plugin.settings.quoteColor_4 = value;
						let rgb = color.getValueRgb()
						let rgbString = rgb.r + ", " + rgb.g + ", " + rgb.b
						this.plugin.settings.quoteColorRgb_4 = rgbString;
						await this.plugin.saveSettings();
						this.plugin.setQuoteColors()
					})
				)
				.addButton(button => button
					.setIcon("rotate-ccw")
					.setClass("clickable-icon")
					.onClick(async () => {
						this.plugin.settings.quoteColor_4 = DEFAULT_SETTINGS.quoteColor_4
						this.plugin.settings.quoteColorRgb_4 = DEFAULT_SETTINGS.quoteColorRgb_4
						await this.plugin.saveSettings();
						this.display()
						this.plugin.setQuoteColors()
					})
				)

			}
	}
}

