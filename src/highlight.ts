
import * as vscode from 'vscode';
import {Config} from './config';

export class Highlight {
    constructor() {
        this.selectedWords = [];
        this.decorators = [];
        this.config = new Config();
        this.decorators = this.config.GetDecorationTypes();
    }

    public ClearWords(): void {
        this.selectedWords = [];
        this.DecorateSelectedWords();
    }

    public SelectedWords(): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let selectedWord = this.GetSelectedWord(editor);
        if (selectedWord === "") {
            return;
        }

        // find exist in words
        let idx = this.selectedWords.findIndex((word) => {
            return word === selectedWord;
        });
        if (idx == -1) {
            // 加入列表，先找等于''的位置
            idx = this.selectedWords.findIndex((word) => {
                return word === '';
            });
            if (idx == -1) {
                this.selectedWords.push(selectedWord);
            } else {
                this.selectedWords[idx] = selectedWord;
            }
        } else {
            // 不真正删除，赋值为''就表示删除；原因：如果删除会导致数组中位置混乱，从而导致重新着色
            this.selectedWords[idx] = '';
        }

        this.DecorateSelectedWords();
    }

    public RefeshSelectedWords(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.DecorateSelectedWords();
        }, 500);
    }

    public DecorateSelectedWords(): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        let decorations: vscode.DecorationOptions[][] = [];
        this.decorators.forEach(() => {
            let decoration: vscode.DecorationOptions[] = [];
            decorations.push(decoration);
        });

        const text = editor.document.getText();
        const flags = this.config.IsIgnoreCase() ? 'gi' : 'g';
        this.selectedWords.forEach((selectedWord: string, idx: number) => {
            if (selectedWord == '') {
                return;
            }
            
            const pattern = this.config.IsWholeWord() ? '\\b' + selectedWord + '\\b' : selectedWord;

            const regEx = new RegExp(pattern, flags);
            let execArray = regEx.exec(text);
            while (execArray != null) {
                const startPos = editor.document.positionAt(execArray.index);
                const endPos = editor.document.positionAt(execArray.index + execArray[0].length);
                const decorationPos = { range: new vscode.Range(startPos, endPos) };
                decorations[idx % decorations.length].push(decorationPos);

                execArray = regEx.exec(text);
            }
        });

        this.decorators.forEach((decorator: vscode.TextEditorDecorationType, idx: number) => {
            editor.setDecorations(decorator, decorations[idx]);
        })
    }

    private GetSelectedWord(editor: vscode.TextEditor) : string {
        const select = editor.selection;
        let selectedWord = editor.document.getText(select);
        if (!selectedWord) {
            const range = editor.document.getWordRangeAtPosition(select.start);
            if (range) {
                selectedWord = editor.document.getText(range);
            }
        }

        if (!selectedWord) {
            return "";
        }

        return selectedWord.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    private decorators: vscode.TextEditorDecorationType[];
    private selectedWords: string[];
    private config: Config;
    private timeout: any;
}
