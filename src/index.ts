import * as ts from 'typescript/lib/tsserverlibrary'
import { decorateWithTemplateLanguageService } from 'typescript-template-language-service-decorator'

import { CSSTemplateLanguageService } from './language-service'

function init(modules: { typescript: typeof ts }) {
  function create(info: ts.server.PluginCreateInfo) {
    // Diagnostic logging
    info.project.projectService.logger.info(
      "I'm getting set up now! Check the log for this message.",
    )

    return decorateWithTemplateLanguageService(
      modules.typescript,
      info.languageService,
      info.project,
      new CSSTemplateLanguageService(),
      { tags: ['css'] },
    )
  }

  return { create }
}

export = init
