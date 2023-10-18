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
			// @ts-ignore
			await this.app.commands.executeCommandById("daily-notes")
		  };
	  
	  
		  const saveQuoteToDaily = async () => {
			// @ts-ignore
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
			// @ts-ignore	  
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



