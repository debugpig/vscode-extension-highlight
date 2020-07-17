
import * as vscode from 'vscode';

interface Color {
    light: string;
    dark: string;
}

export class Config {
    constructor() {
        let config = vscode.workspace.getConfiguration('');
        const wholeWordConfig = config.get<boolean>('highlight.configuration.wholeWord');
        this.wholeWord = wholeWordConfig === undefined ? true : wholeWordConfig;

        const ignoreCaseConfig = config.get<boolean>('highlight.configuration.ignoreCase');
        this.ignoreCase = ignoreCaseConfig === undefined ? true : ignoreCaseConfig;

        // 获取所有颜色
        this.decorationTypes = [];
        const colors = config.get<Color[]>('highlight.configuration.colors');
        if (colors) {
            colors.forEach((color) => {
                let decorationType = vscode.window.createTextEditorDecorationType({
                    overviewRulerLane: vscode.OverviewRulerLane.Right,
                    light: {
                        overviewRulerColor: vscode.OverviewRulerLane.Right,
                        backgroundColor: color.light,
                    },
                    dark: {
                        overviewRulerColor: vscode.OverviewRulerLane.Right,
                        backgroundColor: color.dark,
                    }
                });
                this.decorationTypes.push(decorationType);
            });
        }
    }

    public IsIgnoreCase(): boolean {
        return this.ignoreCase;
    }

    public IsWholeWord(): boolean {
        return this.wholeWord;
    }

    public GetDecorationTypes(): vscode.TextEditorDecorationType[] {
        return this.decorationTypes;
    }

    private wholeWord: boolean;
    private ignoreCase: boolean;
    private decorationTypes: vscode.TextEditorDecorationType[];
}
