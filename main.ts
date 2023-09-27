import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

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
		


		const openSideNotes = async() => {
			let currentFile = this.app.workspace.activeEditor.file
			let currentFolder = currentFile.parent.path
			let currentName = currentFile.basename

			let properties = this.app.workspace.activeEditor.metadataEditor.properties
			let sideNotesProp = properties.find(p => p.key == "Примечания") 
			let sideNotesLink = ""

			if (sideNotesProp && sideNotesProp.value) {

				sideNotesLink = sideNotesProp.value
			} else {

				sideNotesLink = currentFolder + "/" + currentName + " — примечания"
				await this.app.fileManager.processFrontMatter(currentFile, (frontmatter) => { 
						frontmatter["Примечания"] = sideNotesLink
					})
			}
			
			let sideNotesFile = this.app.vault.getAbstractFileByPath(sideNotesLink + ".md")
			if (!sideNotesFile) {
				sideNotesFile = await this.app.vault.create(currentFolder + "/" + currentName + " — примечания" + ".md", "")
			}

			let sideLeaf = await this.app.workspace.createLeafBySplit(this.app.workspace.getActiveViewOfType(MarkdownView), "vertical")
			await sideLeaf.openFile(sideNotesFile, { focus: false } );
		}



		const saveQuoteToSideNotes = async () => {
			let currentFile = this.app.workspace.activeEditor.file
			let currentFolder = currentFile.parent.path
			let currentName = currentFile.basename

			let selection = await this.app.workspace.activeEditor.getSelection()
			let selectionFirstLine = selection.split("\n")[0]
			let shortenedFirstLine = selectionFirstLine.slice(0, 40)
			if (shortenedFirstLine.length < selectionFirstLine.length) {
				shortenedFirstLine = shortenedFirstLine + "…"
			}
			let selectionQuote = "> " + selection.replaceAll("\n", "\n> ")
			let selectionHighlight = "==" + selection.replaceAll("\n", "==\n==") + "=="
			selectionHighlight = selectionHighlight.replaceAll("====", "")


			let properties = this.app.workspace.activeEditor.metadataEditor.properties
			let sideNotesProp = properties.find(p => p.key == "Примечания") 
			let sideNotesLink = ""

			if (sideNotesProp && sideNotesProp.value) {

				sideNotesLink = sideNotesProp.value
			} else {

				sideNotesLink = currentFolder + "/" + currentName + " — примечания"
				await this.app.fileManager.processFrontMatter(currentFile, (frontmatter) => { 
						frontmatter["Примечания"] = sideNotesLink
					})
			}
			
			let sideNotesFile = this.app.vault.getAbstractFileByPath(sideNotesLink + ".md")
			if (!sideNotesFile) {
				sideNotesFile = await this.app.vault.create(currentFolder + "/" + currentName + " — примечания" + ".md", "")
			}

			let sideNotesContent = await this.app.vault.read(sideNotesFile)

			const checkHeader = (header, headerNum) => {
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

			await this.app.workspace.activeEditor.editor.replaceSelection(selectionHighlight + " " + insertLink)

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
		














		




	}

	onunload() {

	}

}



