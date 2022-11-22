import * as ts from 'typescript/lib/tsserverlibrary'
import * as vscode from 'vscode-languageserver-types'
import {
  TemplateLanguageService,
  TemplateContext,
} from 'typescript-template-language-service-decorator'
import { LanguageService, getSCSSLanguageService } from 'vscode-css-languageservice'

export class CSSTemplateLanguageService implements TemplateLanguageService {
  private scssLanguageService: LanguageService

  constructor() {
    this.scssLanguageService = getSCSSLanguageService()
  }

  getCompletionsAtPosition(
    context: TemplateContext,
    position: ts.LineAndCharacter,
  ): ts.CompletionInfo {
    const items = this.getCompletionItems(context, position)

    return {
      isGlobalCompletion: false,
      isMemberCompletion: false,
      isNewIdentifierLocation: false,
      entries: items.map((completionItem) => ({
        name: completionItem.label,
        kind: translateCompletionItemKind(completionItem.kind),
        kindModifiers: '',
        sortText: completionItem.sortText || completionItem.label,
      })),
    }
  }

  private getCompletionItems(context: TemplateContext, position: ts.LineAndCharacter) {
    /**
     * This would happen if a ` is triggered causing VSCode to open up two ``. At this stage completions aren't needed
     * but they are still requested.
     * Due to the fact there's nothing to complete (empty template) the language servers below end up requesting everything,
     * causing a 3-4 second delay. When a template string is opened up we should do nothing and return an empty list.
     *
     * Also fixes: https://github.com/styled-components/vscode-styled-components/issues/276
     **/
    if (context.node.getText() === '``') {
      return []
    }

    // 1. Create a virtual document with the template context
    // 2. Create a stylesheet with the virtual document
    // 3. Get completions by calling doComplete on stylesheet
    const doc = createVirtualDocument(context)
    const stylesheet = this.scssLanguageService.parseStylesheet(doc)
    const completions = this.scssLanguageService.doComplete(doc, position, stylesheet)

    return completions.items
  }
}

// --------------------------------------------------------
// UTILS

// https://github.com/microsoft/typescript-styled-plugin/blob/b3d93958581bfb1d19bc463e5e27ea028fbf1869/src/_virtual-document-provider.ts
function createVirtualDocument(context: TemplateContext) {
  const contents = context.text
  return {
    uri: 'untitled://embedded.scss',
    languageId: 'scss',
    lineCount: contents.split(/\n/g).length + 1,
    version: 1,
    getText: () => contents,
    positionAt: (offset: number) => {
      return context.toPosition(offset)
    },
    offsetAt: (position: ts.LineAndCharacter) => {
      return context.toOffset(position)
    },
  }
}

function translateCompletionItemKind(
  kind?: vscode.CompletionItemKind,
): ts.ScriptElementKind {
  if (!kind) return ts.ScriptElementKind.unknown

  switch (kind) {
    case vscode.CompletionItemKind.Method:
      return ts.ScriptElementKind.memberFunctionElement
    case vscode.CompletionItemKind.Function:
      return ts.ScriptElementKind.functionElement
    case vscode.CompletionItemKind.Constructor:
      return ts.ScriptElementKind.constructorImplementationElement
    case vscode.CompletionItemKind.Field:
    case vscode.CompletionItemKind.Variable:
      return ts.ScriptElementKind.variableElement
    case vscode.CompletionItemKind.Class:
      return ts.ScriptElementKind.classElement
    case vscode.CompletionItemKind.Interface:
      return ts.ScriptElementKind.interfaceElement
    case vscode.CompletionItemKind.Module:
      return ts.ScriptElementKind.moduleElement
    case vscode.CompletionItemKind.Property:
      return ts.ScriptElementKind.memberVariableElement
    case vscode.CompletionItemKind.Unit:
    case vscode.CompletionItemKind.Value:
      return ts.ScriptElementKind.constElement
    case vscode.CompletionItemKind.Enum:
      return ts.ScriptElementKind.enumElement
    case vscode.CompletionItemKind.Keyword:
      return ts.ScriptElementKind.keyword
    case vscode.CompletionItemKind.Color:
      return ts.ScriptElementKind.constElement
    case vscode.CompletionItemKind.Reference:
      return ts.ScriptElementKind.alias
    case vscode.CompletionItemKind.File:
      return ts.ScriptElementKind.moduleElement
    case vscode.CompletionItemKind.Snippet:
    case vscode.CompletionItemKind.Text:
    default:
      return ts.ScriptElementKind.unknown
  }
}
