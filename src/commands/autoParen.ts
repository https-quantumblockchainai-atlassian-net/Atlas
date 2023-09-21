import * as vscode from 'vscode';

export function AutoParen()
{
    const editor = vscode.window.activeTextEditor
    if (editor)
    {
        const lang = editor.document.languageId;
        const cursorPosition = editor.selection.active;
        const lineText = editor.document.lineAt(cursorPosition.line).text;
        const textAheadOfCursor = lineText.substring(cursorPosition.character);
        if (lang == "hsc4")
        {
          const snip = new vscode.SnippetString('(${1})');
          const pattern = /\w*\s*\(/g;
          const match = textAheadOfCursor.match(pattern);
          if (match)
          {
            return;
          }
          editor.insertSnippet(snip);
        }
        else
        {
          const textBeforeCursor = lineText.substring(0, cursorPosition.character);
          const rangeMatch = new RegExp(/\s*\w+\s*/g);
          const currentWordRange = editor.document.getWordRangeAtPosition(cursorPosition, rangeMatch);
          if (currentWordRange)
          {
            const start = currentWordRange.start
            if (start.character > 0)
            {
              const beforeStart = start.translate(0, -1);
              const char = editor.document.getText(new vscode.Range(beforeStart, start));
              console.log(char);
              if (char == "(")
                return;
            }
          }

          const wordMatch = textBeforeCursor.match(/(\w+\s*)$/g);
          if (wordMatch)
          {
            const wordToInsertParenthesesBefore = wordMatch[0];
            const insertPosition = cursorPosition.translate(0, -wordToInsertParenthesesBefore.length);
            // editor.insertSnippet(snip1, insertPosition)
            // editor.insertSnippet(snip2)
            editor.edit((editBuilder) => {
              editBuilder.insert(insertPosition, '(');
              editBuilder.insert(cursorPosition, ')');
            });
            const newPosition = cursorPosition.translate(0, 1);
            const newSelection = new vscode.Selection(newPosition, newPosition);
            editor.selection = newSelection
          }
        
      }}
}