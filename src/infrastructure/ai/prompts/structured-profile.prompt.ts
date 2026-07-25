export interface StructuredProfilePromptInput {
  resumeText: string;
  githubUrl?: string;
  linkedinUrl?: string;
  freeDescription?: string;
  desiredRole: string;
  technologies: string[];
}

/**
 * Prompt versionado (key: "structured-profile", v1).
 * Alterações de comportamento da IA devem ser feitas aqui e registradas na tabela `Prompt`
 * quando o painel admin (Fase 3) permitir edição em runtime.
 */
export function buildStructuredProfilePrompt(input: StructuredProfilePromptInput): string {
  return `Você é um especialista em recrutamento técnico. Com base nas informações abaixo, gere um perfil profissional estruturado.

Cargo desejado: ${input.desiredRole}
Tecnologias declaradas: ${input.technologies.join(", ")}
GitHub: ${input.githubUrl ?? "não informado"}
LinkedIn: ${input.linkedinUrl ?? "não informado"}

Descrição livre do candidato:
"""
${input.freeDescription ?? "não informado"}
"""

Texto extraído do currículo:
"""
${input.resumeText}
"""

Regras:
- Não invente experiências, empresas ou tecnologias que não estejam nas fontes acima.
- Responda SOMENTE em JSON válido, sem markdown, no seguinte formato:

{
  "structuredSummary": "resumo profissional em até 4 frases",
  "specialties": ["especialidade 1", "especialidade 2"],
  "hardSkills": ["skill 1", "skill 2"],
  "softSkills": ["skill 1", "skill 2"],
  "atsSummary": "versão do resumo otimizada para sistemas ATS, com palavras-chave relevantes ao cargo desejado"
}`;
}
