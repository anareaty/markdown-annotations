import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, FileManager, TFile, MarkdownSourceView, Workspace } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {

		const openDailyAtRight = async () => {
			let sideLeaf = await this.app.workspace.createLeafBySplit(this.app.workspace.getMostRecentLeaf()!, "vertical");
			await this.app.workspace.setActiveLeaf(sideLeaf)
			await this.app.commands.executeCommandById("daily-notes")
		  };
	  
	  
	  
		  const saveQuoteToDaily = async () => {
			let dailyOptions = this.app.internalPlugins.plugins["daily-notes"].instance.options
	  
			let dailyFolder = dailyOptions.folder
			let dailyFormat = dailyOptions.format
			let today = window.moment().format(dailyFormat)
			let dailyPath = dailyFolder + "/" + today + ".md"
	  
			let selection = this.app.workspace.activeEditor!.editor!.getSelection();
			let selectionQuote = "> " + selection.replace(/\n/g, "\n> ");
	  
			let selectionHighlight = "==" + selection.replace(/\n/g, "==\n==") + "==";
			selectionHighlight = selectionHighlight.replace(/====/g, "");
	  
			let dailyFile = this.app.vault.getFiles().find((f) => f.path == dailyPath);
			if (!dailyFile) {
			  dailyFile = await this.app.vault.create(dailyPath, "");
			}
	  
			let dailyContent = await this.app.vault.read(dailyFile);
	  
			await this.app.vault.modify(dailyFile, dailyContent + "\n" + selectionQuote + "\n\n");
			this.app.workspace.activeEditor!.editor!.replaceSelection(selectionHighlight);
		  };
	  
	  
		  const saveLinkToDaily = async () => {
	  
			let dailyOptions = this.app.internalPlugins.plugins["daily-notes"].instance.options
			let dailyFolder = dailyOptions.folder
			let dailyFormat = dailyOptions.format
			let today = window.moment().format(dailyFormat)
			let dailyPath = dailyFolder + "/" + today + ".md"
			let dailyFile = this.app.vault.getFiles().find((f) => f.path == dailyPath);
			if (!dailyFile) {
			  dailyFile = await this.app.vault.create(dailyPath, "");
			}
			let dailyContent = await this.app.vault.read(dailyFile);
	  
	  
			let currentFile = this.app.workspace.activeEditor!.file;
			let fileName = currentFile!.basename
			let filePath = currentFile!.path.replace(".md", "")
			let properties
			await this.app.fileManager.processFrontMatter(currentFile!, (frontmatter) => {
			  properties = frontmatter;
			});
	  
			let link = ""
	  
			if (properties && properties["Источник"]) {
			  link = "## " + "[" + fileName + "](" + properties["Источник"] + ")"
			} else {
			  link = "## " + "[[" + filePath + "|" + fileName + "]]"
			}
	  
			await this.app.vault.modify(dailyFile, dailyContent + "\n\n" + link + "\n");
		  };

		  





		


		const openSideNotes = async() => {
			let currentFile = this.app.workspace.activeEditor!.file
			let currentFolder = currentFile!.parent!.path
			let currentName = currentFile!.basename






			interface GenericObject {
				[key: string]: any,
			 }




			let properties : GenericObject = {}
			await this.app.fileManager.processFrontMatter(currentFile!, f => {properties = f})
			let sideNotesProp = properties["Примечания"]




			//let properties = this.app.workspace.activeEditor!.metadataEditor.properties
			//let sideNotesProp = properties.find(p => p.key == "Примечания") 
			let sideNotesLink = ""

			if (sideNotesProp && sideNotesProp.value) {

				sideNotesLink = sideNotesProp.value
			} else {

				sideNotesLink = currentFolder + "/" + currentName + " — примечания"
				await this.app.fileManager.processFrontMatter(currentFile!, (frontmatter) => { 
						frontmatter["Примечания"] = sideNotesLink
					})
			}
			
			let sideNotesFile = this.app.vault.getFiles().find(f => f.path == sideNotesLink + ".md")
			if (!sideNotesFile) {
				sideNotesFile = await this.app.vault.create(currentFolder + "/" + currentName + " — примечания" + ".md", "")
			}

			let sideLeaf = this.app.workspace.createLeafBySplit(this.app.workspace.getMostRecentLeaf()!, "vertical")
			await sideLeaf.openFile(sideNotesFile, { active: false } );
		}



		const saveQuoteToSideNotes = async () => {
			let currentFile = this.app.workspace.activeEditor!.file
			let currentFolder = currentFile!.parent!.path
			let currentName = currentFile!.basename

			let selection = this.app.workspace.activeEditor!.editor!.getSelection() 
			let selectionFirstLine = selection.split("\n")[0]
			let shortenedFirstLine = selectionFirstLine.slice(0, 40)
			if (shortenedFirstLine.length < selectionFirstLine.length) {
				shortenedFirstLine = shortenedFirstLine + "…"
			}
			let selectionQuote = "> " + selection.replace(/\n/g, "\n> ")
			let selectionHighlight = "==" + selection.replace(/\n/g, "==\n==") + "=="
			selectionHighlight = selectionHighlight.replace(/====/g, "")





			interface GenericObject {
				[key: string]: any,
			 }


			let properties : GenericObject = {}
			await this.app.fileManager.processFrontMatter(currentFile!, f => {properties = f})
			let sideNotesProp = properties["Примечания"]

			//let properties = this.app.workspace.activeEditor!.metadataEditor.properties
			//let sideNotesProp = properties.find(p => p.key == "Примечания") 
			let sideNotesLink = ""

			if (sideNotesProp && sideNotesProp.value) {

				sideNotesLink = sideNotesProp.value
			} else {

				sideNotesLink = currentFolder + "/" + currentName + " — примечания"
				await this.app.fileManager.processFrontMatter(currentFile!, (frontmatter) => { 
						frontmatter["Примечания"] = sideNotesLink
					})
			}
			
			let sideNotesFile = this.app.vault.getFiles().find(f => f.path == sideNotesLink + ".md")
			if (!sideNotesFile) {
				sideNotesFile = await this.app.vault.create(currentFolder + "/" + currentName + " — примечания" + ".md", "")
			}

			let sideNotesContent = await this.app.vault.read(sideNotesFile)

			const checkHeader = (header : string, headerNum : number) : string => {
				let re = new RegExp(header)
				if (re.test(sideNotesContent)) {
					re = new RegExp(header + " " + headerNum)
					if (re.test(sideNotesContent)) {
						return checkHeader(header, headerNum + 1)
					} else return header + " " + headerNum
				} else return header
			}

			let header = "# " + shortenedFirstLine
			header = checkHeader(header, 1)

			await this.app.vault.modify(sideNotesFile, sideNotesContent + "\n\n##" + header + "\n" + selectionQuote)
			let insertLink = "[[" + sideNotesLink + header + "|📝]]"


			this.app.workspace.activeEditor!.editor!.replaceSelection(selectionHighlight + " " + insertLink)

		}


		this.addCommand({
			id: 'open-side-notes',
			name: 'Открыть примечания',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await openSideNotes()
			}
		});

		this.addCommand({
			id: 'save-quote-to-side-notes',
			name: 'Сохранить цитату в примечания',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await saveQuoteToSideNotes()
			}
		});


		this.addCommand({
			id: "open-daily-at-right",
			name: "Открыть ежедневную заметку справа",
			editorCallback: async (editor, view) => {
			  await openDailyAtRight();
			}
		  });
	  
		  this.addCommand({
			id: "save-quote-to-daily",
			name: "Сохранить цитату в ежедневную заметку",
			editorCallback: async (editor, view) => {
			  await saveQuoteToDaily();
			}
		  });
	  
		  this.addCommand({
			id: "save-link-to-daily",
			name: "Сохранить ссылку в ежедневную заметку как заголовок",
			editorCallback: async (editor, view) => {
			  await saveLinkToDaily();
			}
		  });
	  

		  





		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
			  menu.addItem((item) => {
				item
				  .setTitle("Открыть примечания")
				  .setIcon("file-input")
				  .onClick(async () => {
					await openSideNotes();
				  });
			  });
			})
		);


		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
			  menu.addItem((item) => {
				item
				  .setTitle("Сохранить цитату в примечания")
				  .setIcon("quote")
				  .onClick(async () => {
					await saveQuoteToSideNotes()
				  });
			  });
			})
		);


		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
			  menu.addItem((item) => {
				item.setTitle("Открыть ежедневную заметку справа").setIcon("file-input").onClick(async () => {
				  await openDailyAtRight();
				});
			  });
			})
		  );
		  this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
			  menu.addItem((item) => {
				item.setTitle("Сохранить цитату в ежедневную заметку").setIcon("quote").onClick(async () => {
				  await saveQuoteToDaily();
				});
			  });
			})
		  );
		  this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
			  menu.addItem((item) => {
				item.setTitle("Сохранить ссылку в ежедневную заметку как заголовок").setIcon("link").onClick(async () => {
				  await saveLinkToDaily();
				});
			  });
			})
		  );
		














		




	}

	onunload() {

	}

}



