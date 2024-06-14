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
			this.app.workspace.setActiveLeaf(sideLeaf)
			// @ts-ignore
			await this.app.commands.executeCommandById("daily-notes")
		  };


		  const getQuoteFile = async () => {
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

			return dailyFile
		  }



		  const generateBlockId = () => {
			return "^" + Math.random().toString(36).substr(2, 6);

		  }


		  const setBlockId = () => {
			let myEditor = this.app.workspace.activeEditor!.editor!
			let line = myEditor.getCursor("to").line
			let linetext = myEditor.getLine(line)
			let ch = linetext.length
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


		const setBacklink = (quoteFile: TFile, blockId2: string, formatting: string) => {

			let link = this.app.fileManager.generateMarkdownLink(quoteFile, "", "#" + blockId2, "📝")
			let myEditor = this.app.workspace.activeEditor!.editor!
			let cursorStart = myEditor.getCursor("from")
			let cursorEnd = myEditor.getCursor("to")
			let offset = formatting.length
			cursorEnd.ch = cursorEnd.ch + offset
			let selection = myEditor.getSelection();
			myEditor.replaceRange(selection + formatting + " " + link, cursorStart, cursorEnd)

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
		

		let quoteFile = await getQuoteFile()
		let content = await this.app.vault.read(quoteFile);
		
		let callout = ">[!quote|quote_1] " + calloutPart
		setHighlight_1()

		await this.app.vault.modify(quoteFile, content + "\n" + callout + "\n\n");

		};







		const saveCalloutToFile_2 = async () => {

			let blockId = setBlockId()
			let calloutPart = createCalloutPart(blockId)
			

			let quoteFile = await getQuoteFile()
			let content = await this.app.vault.read(quoteFile);
			
			let callout = ">[!quote|quote_2] " + calloutPart
			setHighlight_2()

			await this.app.vault.modify(quoteFile, content + "\n" + callout + "\n\n");

		};


		const saveCalloutToFile_3 = async () => {

			let blockId = setBlockId()
			let calloutPart = createCalloutPart(blockId)
			

			let quoteFile = await getQuoteFile()
			let content = await this.app.vault.read(quoteFile);
			
			let callout = ">[!quote|quote_3] " + calloutPart
			setHighlight_3()

			await this.app.vault.modify(quoteFile, content + "\n" + callout + "\n\n");

		};
					
					
		const saveCalloutToFile_4 = async () => {

			let blockId = setBlockId()
			let calloutPart = createCalloutPart(blockId)
			

			let quoteFile = await getQuoteFile()
			let content = await this.app.vault.read(quoteFile);
			
			let callout = ">[!quote|quote_4] " + calloutPart
			setHighlight_4()
	
			await this.app.vault.modify(quoteFile, content + "\n" + callout + "\n\n");

		};	
		
		


		const addComment = async () => {

			let blockId = setBlockId()
			let blockId2 = generateBlockId()
			

			let quoteFile = await getQuoteFile()
			let content = await this.app.vault.read(quoteFile);
					
			setBacklink(quoteFile, blockId2, "")

			let currentFile = this.app.workspace.getActiveFile()

			let link = this.app.fileManager.generateMarkdownLink(currentFile!, "", "#" + blockId, currentFile!.basename)

			await this.app.vault.modify(quoteFile, content + "\n- 📝 " + link + " " + blockId2 + "\n	- Комментарий\n\n");

		};


		



		this.addCommand({
			id: "open-daily-at-right",
			name: "Открыть ежедневную заметку справа",
			editorCallback: async (editor, view) => {
			  await openDailyAtRight();
			}
		  });
	


		  this.addCommand({
			id: "save-callout-1",
			name: "Сохранить цитату 1",
			editorCallback: async (editor, view) => {
			  await saveCalloutToFile_1();
			}
		  });
	  


		  this.addCommand({
			id: "save-callout-2",
			name: "Сохранить цитату 2",
			editorCallback: async (editor, view) => {
			  await saveCalloutToFile_2();
			}
		  });


		  this.addCommand({
			id: "save-callout-3",
			name: "Сохранить цитату 3",
			editorCallback: async (editor, view) => {
			  await saveCalloutToFile_3();
			}
		  });



		  this.addCommand({
			id: "save-callout-4",
			name: "Сохранить цитату 4",
			editorCallback: async (editor, view) => {
			  await saveCalloutToFile_4();
			}
		  });


		  this.addCommand({
			id: "add-comment",
			name: "Добавить комментарий",
			editorCallback: async (editor, view) => {
			  await addComment();
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
				item.setTitle("Сохранить цитату 1").setIcon("quote").onClick(async () => {
				  await saveCalloutToFile_1();
				});
			  });
			})
		  );

		  this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
			  menu.addItem((item) => {
				item.setTitle("Сохранить цитату 2").setIcon("quote").onClick(async () => {
				  await saveCalloutToFile_2();
				});
			  });
			})
		  );
		  
		  
		  this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
			  menu.addItem((item) => {
				item.setTitle("Сохранить цитату 3").setIcon("quote").onClick(async () => {
				  await saveCalloutToFile_3();
				});
			  });
			})
		  );

		  this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
			  menu.addItem((item) => {
				item.setTitle("Сохранить цитату 4").setIcon("quote").onClick(async () => {
				  await saveCalloutToFile_4();
				});
			  });
			})
		  );

		  this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
			  menu.addItem((item) => {
				item.setTitle("Добавить комментарий").setIcon("quote").onClick(async () => {
				  await addComment();
				});
			  });
			})
		  );



	}

	onunload() {

	}

}



