# Markdown Annotation

This plugin was inspired by amazing plugin PDF++ that lets you annotate PDFs. I wanted to make something similar, but for Markdown. This plugin allows you faster copy quotes with backlinks from one file to another, automatically create highlights and add comments with two-way links. Also optionally it adds three extra styles for highlights (without using html).

## Annotations file

Before you start you have to chose the file that will be used to copy quotes and paste comments to. You have several options:

- current daily note;
- separate file based on the name of the annotated file;
- one specific file for all annotations;
- the same file that is annotated (quotes and comments will be posted to the bottom) (default option).

You can set up your desired annotations file in the settings.

## Quotes

If you select some text in the editing view, you can run command "Save a quote". After that several things will happen automatically:

1. The selection will be highlighted.
2. The block id will be added to the last paragraph of the selection.
3. The selection will be copied and pasted to your chosen annotations file. It will be formatted as a callout with the link to the block with block id.


By default you have only regular highlighting. But if you want to you can turn on the option of three additional highlighting variants in the settings. They all are using regular Markdown tags and allow three formatting options:

- italic highlighting
- bold  highlighting
- bold italic highlighting

You cal also turn on additional css, that will turn those formatting options into highlighting of different colors or use you own css to style them as you please.

## Commentaries

You can put cursor in any place in the editing view an run the command "Add commentary". That's what will happen:

1. The block id will be added to the current paragraph.
2. In the annotations file the list item will be created. It will contain the link to the selected block and it's own block id. 
3. In the current file the link to this list item will be created, whit the notes emoji as an alias.

It is most convenient to put your comeentary either to the linked list item itself, or to the nested list under it. this way you can see all your comments in the hover preview. Just be careful not to remove the block id.

